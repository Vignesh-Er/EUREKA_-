/**
 * Stream client for processing SSE real-time token streaming chunks.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function streamFromAPI(
  endpoint: string,
  body: any,
  onToken: (token: string) => void,
  onComplete?: () => void,
  onError?: (err: Error) => void
): Promise<void> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  let token = null;
  try {
    const authStorage = localStorage.getItem('eureka.auth');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      token = parsed?.user?.id;
    }
  } catch (e) {
    // Ignore localStorage errors in SSR
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer demo-token-${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Streaming request failed: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('ReadableStream not supported by response body.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || ''; // Keep incomplete last chunk in buffer

      for (const line of lines) {
        const cleaned = line.replace(/(\r\n|\n|\r)/gm, '').trim();
        if (!cleaned.startsWith('data: ')) continue;

        const dataStr = cleaned.slice(6);
        if (dataStr === '[DONE]') {
          if (onComplete) onComplete();
          return;
        }

        try {
          const parsed = JSON.parse(dataStr);
          // Handle error chunk
          if (parsed.error) {
            throw new Error(parsed.error);
          }
          // Process standard chunk
          const tokenText = parsed?.choices?.[0]?.delta?.content;
          if (tokenText) {
            onToken(tokenText);
          }
        } catch (e) {
          console.warn('[StreamClient] Failed to parse SSE chunk:', dataStr, e);
        }
      }
    }

    if (onComplete) onComplete();

  } catch (err: any) {
    if (onError) {
      onError(err);
    } else {
      console.error('[StreamClient] Streaming error:', err);
    }
  }
}
export default streamFromAPI;
