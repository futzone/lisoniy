import { apiClient } from "./apiClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// ... (Types remain the same) ...
// For brevity, not replacing repeated type definitions if they are unchanged, 
// but technically I should replace the whole file or chunks.
// Given strict instructions, I will replace the API Service object.

// --- Types & Interfaces ---
// (Keeping existing types)
export interface Definition {
    language: string;
    text: string;
    example?: string;
    id?: string;
    term_id?: string;
    is_approved?: boolean;
}

export interface Category {
    id: string;
    slug: string;
    name: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Term {
    id: string;
    keyword: string;
    category_id: string;
    category?: Category;
    definitions: Definition[];
    creator?: {
        id: number;
        full_name: string;
        email: string;
    };
    is_deleted?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface CategoryCreate {
    slug: string;
    name: string;
    description?: string;
}

export interface CategoryUpdate {
    name?: string;
    description?: string;
}

export interface TermCreate {
    keyword: string;
    category_id: string;
    definitions: {
        language: string;
        text: string;
        example?: string;
    }[];
}

export interface TermUpdate {
    keyword?: string;
    category_id?: string;
}

export interface ApiError {
    detail: string;
    status?: number;
}

export interface CategoryTermsResponse {
    category: Category;
    total: number;
    offset: number;
    limit: number;
    terms: Term[];
}

// --- API Service ---

export const terminologyApi = {
    // === Categories ===

    async getCategories(): Promise<Category[]> {
        return apiClient.get<Category[]>('/api/v1/categories/');
    },

    async getCategoryBySlug(slug: string): Promise<Category> {
        return apiClient.get<Category>(`/api/v1/categories/${slug}`);
    },

    async createCategory(data: CategoryCreate): Promise<Category> {
        return apiClient.post<Category>('/api/v1/categories/', data);
    },

    async updateCategory(id: string, data: CategoryUpdate): Promise<Category> {
        return apiClient.patch<Category>(`/api/v1/categories/${id}`, data);
    },

    async deleteCategory(id: string): Promise<void> {
        return apiClient.delete<void>(`/api/v1/categories/${id}`);
    },

    async getCategoryTerms(slug: string, offset = 0, limit = 20): Promise<CategoryTermsResponse> {
        return apiClient.get<CategoryTermsResponse>(
            `/api/v1/categories/${slug}/terms?offset=${offset}&limit=${limit}`
        );
    },

    // === Terms ===

    async createTerm(data: TermCreate): Promise<Term> {
        return apiClient.post<Term>('/api/v1/terms/', data);
    },

    async updateTerm(id: string, data: TermUpdate): Promise<Term> {
        return apiClient.patch<Term>(`/api/v1/terms/${id}`, data);
    },

    async deleteTerm(id: string): Promise<void> {
        return apiClient.delete<void>(`/api/v1/terms/${id}`);
    },

    async getTermByKeyword(keyword: string): Promise<Term> {
        return apiClient.get<Term>(`/api/v1/terms/${keyword}`);
    }
};
