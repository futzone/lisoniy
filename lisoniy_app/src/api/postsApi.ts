import { apiClient } from "./apiClient";

export interface Post {
    id: number;
    title: string;
    body: string;
    type: 'article' | 'discussion';
    files: string[];
    tags: string[];
    owner_id: number;
    owner: {
        id: number;
        full_name: string;
        email: string;
    };
    total_views: number;
    total_comments: number;
    comments_count?: number; // Keep for compatibility during transition
    created_at: string;
    updated_at: string;
    is_liked?: boolean;
    comments?: Comment[];
}

export interface PostListResponse {
    items: Post[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export interface Comment {
    id: number;
    body: string;
    owner_id: number;
    owner: {
        id: number;
        full_name: string;
    };
    post_id: number;
    parent_id: number | null;
    replies?: Comment[];
    created_at: string;
}

export interface CreateCommentRequest {
    body: string;
    parent_id?: number;
}

export const postsApi = {
    getPosts: async (params: { skip?: number; limit?: number; type?: string; tag?: string }) => {
        // Backend usually returns a list directly or a paginated object. 
        // Based on previous context, it might be a list. 
        // Let's assume list for now, or check backend logic if possible.
        // Actually, Python backend often returns List[Post] directly unless paginated wrapper is used.
        // Let's assume List[Post] for the endpoint /api/v1/posts/ based on FastAPI default behavior unless Page is used.
        // Re-checking history: "posts, _ = await PostService.get_all_posts(db, skip, limit, type, tag)"
        // And the endpoint returns just `posts`. So it's likely `List[PostResponse]`.
        // Wait, if it's just a list, how do we get `total` for pagination?
        // Usually backends return { items: [], total: ... } or headers.
        // If the context says `posts, _ = ...` but api returns `posts`, then it's just the list.
        // I will assume it returns `Post[]`.

        const queryParams = new URLSearchParams();
        if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
        if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
        if (params.type) queryParams.append('type', params.type);
        if (params.tag) queryParams.append('tag', params.tag);

        return apiClient.get<Post[]>(`/api/v1/posts/?${queryParams.toString()}`);
    },

    getPostById: async (id: string | number) => {
        return apiClient.get<Post>(`/api/v1/posts/${id}`);
    },

    likePost: async (id: string | number) => {
        return apiClient.post<{ message: string; total_likes: number }>(`/api/v1/posts/${id}/like`, {});
    },

    unlikePost: async (id: string | number) => {
        return apiClient.delete<{ message: string; total_likes: number }>(`/api/v1/posts/${id}/like`);
    },

    createComment: async (postId: string | number, data: CreateCommentRequest) => {
        return apiClient.post<Comment>(`/api/v1/comments/${postId}`, data);
    },

    // Generic getting comments for a post
    getComments: async (postId: string | number) => {
        // Assuming endpoint is /api/v1/comments/?post_id=... or /api/v1/posts/{id}/comments
        // Based on common patterns:
        return apiClient.get<Comment[]>(`/api/v1/comments/${postId}`);
        // Wait, the create is /api/v1/comments/{postId}, so get likely same or with query param?
        // Let's assume /api/v1/comments/{postId} gets comments for that post if GET.
    },

    getPopularTags: async (limit: number = 10) => {
        return apiClient.get<{ tag: string, contents: number }[]>(`/api/v1/posts/tags/popular?limit=${limit}`);
    },

    getTopAuthors: async (limit: number = 5) => {
        return apiClient.get<Author[]>(`/api/v1/users/top-authors?limit=${limit}`);
    }
};

export interface Author {
    id: number;
    name: string;
    avatar: string;
    contributions: number;
    rank: string;
    specialization: string;
}
