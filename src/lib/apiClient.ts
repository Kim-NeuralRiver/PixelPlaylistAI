import { tokenManager } from '@/utils/api/tokenManager';
import { redirect } from 'next/navigation';

// Set base url
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Define interface for the API client
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Options for configuring fetch reqs
interface FetchOptions {
    method?: HttpMethod;
    body?: any;
    headers?: Record<string, string>;
    requiresAuth?: boolean;
}

async function apiRequest<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const {
        method = 'GET',
        body,
        headers = {},
        requiresAuth = false,
    } = options;

    // Ensure endpoint is formatted properly 
    const normalizedEndpoint = endpoint.startsWith('/')
    ? endpoint.substring(1)
    : endpoint;

    const url = `${API_BASE_URL}/${normalizedEndpoint}`;

    // Set up default headers
    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers
    };

    // Check if add auth token is required
    if (requiresAuth) {
        const token = await tokenManager.ensureValidToken();
        if (token) {
            requestHeaders.Authorization = `Bearer ${token}`;
        } else if (requiresAuth) {
            throw new Error('Authentication required but no token found');
        }
    }

    // Prepare request options
    const requestOptions: RequestInit = {
        method, 
        headers: requestHeaders,
        credentials: 'include', // Include cookies for session management
    };

    // Add json body if provided
    if (body) {
        requestOptions.body = JSON.stringify(body);
    }

    try { // Make the API request
        const response = await fetch(url, requestOptions);

        // Handle error scenarios 

        if (!response.ok) {
            if (response.status == 401 && tokenManager.isAuthenticated()) {
                tokenManager.clearTokens(); // Clear tokens if 401
                redirect('/sign-in'); // redirect to sign-in page
            }

            let errorMessage; // Default error message
            try {
                const errorData = await response.json(); 
                errorMessage = errorData.detail || errorData.message || `API Request Error: ${response.status}`;
            } catch {
                errorMessage = `API Request Error: ${response.status}`;
            }

            throw new Error(errorMessage);
        }

        // Handle empty responses
        if (response.status === 204) {
            return {} as T; // Return empty object for 204 No Content
        }

        // Parse JSON response 
        return await response.json();
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Unknown API error occurred'); // Fallback for non-Error exceptions
    }
}

// Export API client methods
export const api = {
  get: <T>(endpoint: string, options?: Omit<FetchOptions, 'method' | 'body'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, body: any, options?: Omit<FetchOptions, 'method'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'POST', body }),
  
  put: <T>(endpoint: string, body: any, options?: Omit<FetchOptions, 'method'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),
  
  patch: <T>(endpoint: string, body: any, options?: Omit<FetchOptions, 'method'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', body }),
  
  delete: <T>(endpoint: string, options?: Omit<FetchOptions, 'method'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};