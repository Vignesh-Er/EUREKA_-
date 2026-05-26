/**
 * API Client for connecting Next.js frontend to FastAPI backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Get Auth Token if using real auth
  // In demo mode, we might just pass a mock token or let the backend mock it
  let token = null;
  
  try {
    const authStorage = localStorage.getItem('eureka.auth');
    if (authStorage) {
      // In a real app with Supabase, you would get the session token here
      // const session = await supabase.auth.getSession();
      // token = session?.data?.session?.access_token;
      
      // For demo mode, we'll just pass a dummy token to satisfy the FastAPI backend
      // if it requires one, or we bypass auth in the backend. 
      // The backend currently has mock auth bypass if x-mock-user-role is sent
      const parsed = JSON.parse(authStorage);
      token = parsed?.user?.id; // just pass user id as a mock token for now
    }
  } catch (e) {
    // Ignore localStorage errors (e.g., in SSR)
  }

  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  });

  if (token) {
    // Pass fake token or real token
    headers.set('Authorization', `Bearer demo-token-${token}`); 
    
    // Pass mock role for demo bypass (if implemented in backend)
    try {
      const authStorage = localStorage.getItem('eureka.auth');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        if (parsed?.user?.role) {
          headers.set('x-mock-user-role', parsed.user.role);
          headers.set('x-mock-user-id', parsed.user.id);
        }
      }
    } catch(e) {}
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Request Failed: ${response.status}`);
  }

  return response.json();
}
