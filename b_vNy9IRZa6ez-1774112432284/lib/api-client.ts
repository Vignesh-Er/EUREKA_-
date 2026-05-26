/**
 * Shared API Client for Project Eureka frontend.
 * Provides standardized request envelopes, timeouts, automatic token injection,
 * and elegant two-tier fail-closed/fail-open fallback handling.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface ApiResponseEnvelope<T> {
  ok: boolean;
  data: T | null;
  meta?: {
    request_id: string;
    source: 'nim' | 'fallback' | 'database';
    timestamp: string;
  };
  error?: {
    code: string;
    message: string;
    retry_after?: number;
  } | null;
}

export class ApiClient {
  private static getHeaders(options: RequestInit = {}): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    });

    try {
      const authStorage = localStorage.getItem('eureka.auth');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        const token = parsed?.user?.id;
        if (token) {
          headers.set('Authorization', `Bearer demo-token-${token}`);
        }
      }
    } catch (e) {
      // Ignore SSR localStorage exceptions
    }

    return headers;
  }

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {},
    sensitive: boolean = false,
    timeoutMs: number = 30000
  ): Promise<ApiResponseEnvelope<T>> {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(options),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        // Handle 503 or other server errors for sensitive modules
        if (sensitive || response.status === 503) {
          return {
            ok: false,
            data: null,
            error: {
              code: responseData?.error?.code || 'SERVER_ERROR',
              message: responseData?.error?.message || `API Request failed with status ${response.status}`,
              retry_after: responseData?.error?.retry_after,
            },
          };
        }

        // Return non-sensitive generic error
        return {
          ok: false,
          data: null,
          error: {
            code: 'API_ERROR',
            message: `Request failed with status ${response.status}`,
          },
        };
      }

      // If response is already wrapped in envelope, return as-is
      if (responseData && typeof responseData === 'object' && 'ok' in responseData) {
        return responseData as ApiResponseEnvelope<T>;
      }

      // If not wrapped, wrap it manually for backwards compatibility
      return {
        ok: true,
        data: responseData as T,
        meta: {
          request_id: 'local-wrapped',
          source: 'database',
          timestamp: new Date().toISOString(),
        },
      };

    } catch (error: any) {
      clearTimeout(timeoutId);
      const isTimeout = error.name === 'AbortError';

      if (sensitive) {
        return {
          ok: false,
          data: null,
          error: {
            code: isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR',
            message: isTimeout
              ? 'Operation timed out. The system is busy, please try again.'
              : 'Network error occurred. Please check your internet connection.',
          },
        };
      }

      // For non-sensitive requests, return graceful success with local fallback if it's a network failure
      console.warn(`[ApiClient] Request failed. Returning non-sensitive fallback due to: ${error.message}`);
      return {
        ok: true,
        data: null as any, // Let component handle null or mock data
        meta: {
          request_id: 'network-fallback',
          source: 'fallback',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  public static async get<T>(
    endpoint: string,
    sensitive: boolean = false,
    options: RequestInit = {}
  ): Promise<ApiResponseEnvelope<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' }, sensitive);
  }

  public static async post<T>(
    endpoint: string,
    body: any,
    sensitive: boolean = false,
    options: RequestInit = {}
  ): Promise<ApiResponseEnvelope<T>> {
    return this.request<T>(
      endpoint,
      {
        ...options,
        method: 'POST',
        body: JSON.stringify(body),
      },
      sensitive
    );
  }
}
