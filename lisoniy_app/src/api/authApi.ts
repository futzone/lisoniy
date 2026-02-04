import { apiClient } from "./apiClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Request/Response Types
export interface RegisterRequest {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
}

export interface RegisterResponse {
    message: string;
    user: {
        id: string;
        email: string;
        full_name: string;
        phone: string | null;
        is_verified: boolean;
    };
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface RefreshTokenResponse {
    access_token: string;
    token_type: string;
    refresh_token?: string; // Optional if backend supports rotation
}

export interface UserResponse {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    role: string;
    is_active: boolean;
    is_verified: boolean;
    created_at?: string;
}

export interface VerifyEmailRequest {
    email: string;
    otp: string;
}

export interface ApiError {
    detail: string;
    status?: number;
}

/**
 * Auth API Service
 */
export const authApi = {
    /**
     * Register a new user
     * @throws ApiError with status 409 if email exists, 429 for rate limit
     */
    async register(data: RegisterRequest): Promise<RegisterResponse> {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error: ApiError = await response.json();
            error.status = response.status;
            throw error;
        }

        return response.json();
    },

    /**
     * Verify email with OTP code
     * @throws ApiError with status 400 for invalid OTP, 404 if user not found
     */
    async verifyEmail(data: VerifyEmailRequest): Promise<UserResponse> {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error: ApiError = await response.json();
            error.status = response.status;
            throw error;
        }

        return response.json();
    },

    /**
     * Login with email and password
     * @throws ApiError with status 401 for invalid credentials, 403 if email not verified, 429 for rate limit
     */
    async login(data: LoginRequest): Promise<TokenResponse> {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error: ApiError = await response.json();
            error.status = response.status;
            throw error;
        }

        return response.json();
    },

    /**
     * Get current user profile
     * Uses apiClient to automatically attach token
     */
    async getMe(): Promise<UserResponse> {
        return apiClient.get<UserResponse>('/api/v1/users/me');
    },

    /**
     * Refresh access token
     * Note: Uses raw fetch to avoid circular dependency loop with apiClient interceptor
     * @throws ApiError with status 401 for invalid/expired refresh token
     */
    async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
            const error: ApiError = await response.json();
            error.status = response.status;
            throw error;
        }

        return response.json();
    },

    /**
     * Request password reset email
     * @throws ApiError with status 429 for rate limit
     */
    async requestPasswordReset(email: string): Promise<{ message: string }> {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/request-password-reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const error: ApiError = await response.json();
            error.status = response.status;
            throw error;
        }

        return response.json();
    },

    /**
     * Reset password with token
     * @throws ApiError with status 400 for invalid/expired token
     */
    async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, new_password: newPassword }),
        });

        if (!response.ok) {
            const error: ApiError = await response.json();
            error.status = response.status;
            throw error;
        }

        return response.json();
    },
};
