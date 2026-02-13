import { apiClient } from "./apiClient";
import { UserResponse } from "./authApi";

export interface UserRankingResponse {
    id: number;
    full_name: string;
    username: string | null;
    avatar_image: string | null;
    ball: number;
    rank: number;
    joined: string;
}

export interface UserMetaResponse {
    bio: string | null;
    telegram_url: string | null;
    github_url: string | null;
    website_url: string | null;
    education: string | null;
    address: string | null;
    nickname: string | null; // Base model has nickname
    username: string | null; // Response alias
    articles: number;
    discussions: number;
    datasets: number;
    terms: number;
    entries: number;
    stars: number;
    likes: number;
    bonus: number;
    rank: number;
    ball: number;
    joined: string;
    last_activity: string | null;
    user: UserResponse;
    avatar_image?: string | null;
}

export interface UserMetaUpdate {
    nickname?: string | null;
    address?: string | null;
    github_url?: string | null;
    telegram_url?: string | null;
    website_url?: string | null;
    education?: string | null;
    bio?: string | null;
    avatar_image?: string | null;
}

export interface ActivityLogResponse {
    id: number;
    action: string;
    term_keyword: string;
    timestamp: string;
}

export interface DatasetResponse {
    id: number;
    name: string;
    description?: string;
    category?: string;
    created_at: string;
}

export interface PostResponse {
    id: number;
    title: string;
    short_text?: string;
    category: string;
    type: string;
    created_at: string;
    total_likes?: number;
    total_views?: number;
}

export interface UserActivityResponse {
    activity_logs: ActivityLogResponse[];
    datasets: DatasetResponse[];
    discussions: PostResponse[];
    articles: PostResponse[];
}

export const userApi = {
    async getMyMeta(): Promise<UserMetaResponse> {
        return apiClient.get<UserMetaResponse>('/api/v1/users/me/meta');
    },

    async getMyActivity(): Promise<UserActivityResponse> {
        return apiClient.get<UserActivityResponse>('/api/v1/users/me/activity');
    },

    async updateMyMeta(data: UserMetaUpdate): Promise<UserMetaResponse> {
        return apiClient.request<UserMetaResponse>('/api/v1/users/me/meta', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async uploadAvatar(file: File): Promise<UserMetaResponse> {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.request<UserMetaResponse>('/api/v1/users/me/avatar', {
            method: 'POST',
            body: formData,
            headers: {
                // Explicitly set Content-Type to undefined to force browser to set boundary
            }
        });
    },

    async getRanking(limit: number = 50): Promise<UserRankingResponse[]> {
        return apiClient.get<UserRankingResponse[]>(`/api/v1/users/ranking?limit=${limit}`);
    },

    async getPublicProfile(username: string): Promise<UserMetaResponse> {
        return apiClient.get<UserMetaResponse>(`/api/v1/users/u/${username}`);
    }
};
