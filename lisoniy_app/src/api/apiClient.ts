import { useAuthStore } from "@/store/authStore";
import { authApi } from "./authApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface RequestConfig extends RequestInit {
    headers?: Record<string, string>;
    _retry?: boolean;
    responseType?: 'json' | 'blob';
}

/**
 * Custom API Client wrapper around fetch
 * Automatically adds Authorization header
 * Handles 401 token refresh logic
 */
export const apiClient = {
    async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
        let url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

        // Get current access token
        const { accessToken, refreshToken, login, logout } = useAuthStore.getState();

        // set default headers
        const headers: Record<string, string> = {
            ...config.headers,
        };

        // Only set proper Content-Type if body is not FormData (browser sets boundary for FormData)
        if (!(config.body instanceof FormData) && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        // Add Authorization header if token exists
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const fetchConfig: RequestInit = {
            ...config,
            headers,
        };

        try {
            let response = await fetch(url, fetchConfig);

            // Access Token Expired (401)
            if (response.status === 401 && !config._retry && refreshToken) {
                config._retry = true; // Mark as retried to prevent infinite loop

                try {
                    // Attempt to refresh token
                    const tokenData = await authApi.refreshToken(refreshToken);

                    // Update store with new tokens (login updates both)
                    const newRefreshToken = tokenData.refresh_token || refreshToken;
                    useAuthStore.getState().setTokens(tokenData.access_token, newRefreshToken!);

                    // Retry original request with new token
                    headers['Authorization'] = `Bearer ${tokenData.access_token}`;
                    // Update headers in config
                    const retryConfig = {
                        ...config,
                        headers,
                    };

                    response = await fetch(url, retryConfig);

                } catch (refreshError) {
                    // Refresh failed (refresh token expired or invalid)
                    logout();
                    // Rethrow original 401 error or new refresh error
                    // We probably want to stop execution here and redirect to login
                    throw new Error("Session expired. Please login again.");
                }
            }

            // Handle API Errors
            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = { detail: response.statusText };
                }
                const error = {
                    detail: errorData.detail || 'An error occurred',
                    status: response.status,
                };
                throw error;
            }

            // Success (some endpoints might return 204 No Content which fails .json())
            if (response.status === 204) {
                return {} as T;
            }

            if (config.responseType === 'blob') {
                return response.blob() as any;
            }

            return response.json();

        } catch (error) {
            throw error;
        }
    },

    get<T>(endpoint: string, config: RequestConfig = {}) {
        return this.request<T>(endpoint, { method: 'GET', ...config });
    },

    post<T>(endpoint: string, body: any, headers?: Record<string, string>) {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            headers
        });
    },

    patch<T>(endpoint: string, body: any, headers?: Record<string, string>) {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers
        });
    },

    delete<T>(endpoint: string, headers?: Record<string, string>) {
        return this.request<T>(endpoint, { method: 'DELETE', headers });
    }
};
