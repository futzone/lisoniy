import { apiClient } from "./apiClient";

export interface DatasetResponse {
    id: string;
    name: string;
    type: string;
    description: string | null;
    is_public: boolean;
    creator_id: number;
    created_at: string;
    updated_at: string;
    entry_count: number;
    meta?: {
        id: string;
        downloads: number;
        views: number;
        stars: number;
        license: string | null;
    } | null;
}

export interface DatasetListResponse {
    total: number;
    offset: number;
    limit: number;
    datasets: DatasetResponse[];
}

export interface DatasetCreate {
    name: string;
    type: string;
    description?: string;
    is_public?: boolean;
}

export interface DatasetUpdate {
    name?: string;
    description?: string;
    is_public?: boolean;
}

export interface DataEntryResponse {
    id: string;
    dataset_id: string;
    content: Record<string, unknown>;
    metadata?: Record<string, unknown> | null;
    hash_key: string;
    creator_id: number;
    created_at: string;
    updated_at: string;
}

export interface DataEntryListResponse {
    total: number;
    offset: number;
    limit: number;
    entries: DataEntryResponse[];
}

export interface DataEntryCreate {
    dataset_id: string;
    content: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}

export interface BulkDataEntryCreate {
    dataset_id: string;
    entries: Record<string, unknown>[];
}

export interface BulkOperationResult {
    total: number;
    created: number;
    skipped: number;
    deleted: number;
    failed: number;
    errors: string[];
}

// Dataset Meta interfaces
export interface DatasetMetaResponse {
    dataset_id: string;
    stars_count: number;
    downloads_count: number;
    views_count: number;
    size_bytes: number;
    readme: string | null;
    description: string | null;
    license_type: string | null;
    license_text: string | null;
    last_updated_user_id: number | null;
    created_at: string;
    updated_at: string;
}

export interface DatasetMetaUpdate {
    readme?: string;
    description?: string;
    license_type?: string;
    license_text?: string;
}


export const datasetApi = {
    // Dataset CRUD
    async getMyDatasets(offset = 0, limit = 20): Promise<DatasetListResponse> {
        return apiClient.get<DatasetListResponse>(`/api/v1/datasets/me?offset=${offset}&limit=${limit}`);
    },

    async getPublicDatasets(offset = 0, limit = 20, type?: string, sortBy: string = "new"): Promise<DatasetListResponse> {
        let url = `/api/v1/datasets/public?offset=${offset}&limit=${limit}&sort_by=${sortBy}`;
        if (type) url += `&dataset_type=${type}`;
        return apiClient.get<DatasetListResponse>(url);
    },

    async searchDatasets(query?: string, type?: string, offset = 0, limit = 20, sortBy: string = "new"): Promise<DatasetListResponse> {
        let url = `/api/v1/datasets/search/all?offset=${offset}&limit=${limit}&sort_by=${sortBy}`;
        if (query) url += `&q=${encodeURIComponent(query)}`;
        if (type) url += `&dataset_type=${type}`;
        return apiClient.get<DatasetListResponse>(url);
    },

    async getDataset(id: string): Promise<DatasetResponse> {
        return apiClient.get<DatasetResponse>(`/api/v1/datasets/${id}`);
    },

    async createDataset(data: DatasetCreate): Promise<DatasetResponse> {
        return apiClient.request<DatasetResponse>('/api/v1/datasets/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async updateDataset(id: string, data: DatasetUpdate): Promise<DatasetResponse> {
        return apiClient.request<DatasetResponse>(`/api/v1/datasets/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    },

    async deleteDataset(id: string): Promise<void> {
        return apiClient.request<void>(`/api/v1/datasets/${id}`, {
            method: 'DELETE'
        });
    },

    // Data Entries CRUD
    async getDatasetEntries(datasetId: string, offset = 0, limit = 20): Promise<DataEntryListResponse> {
        return apiClient.get<DataEntryListResponse>(`/api/v1/entries/?dataset_id=${datasetId}&offset=${offset}&limit=${limit}`);
    },

    async createDataEntry(data: DataEntryCreate): Promise<DataEntryResponse> {
        return apiClient.request<DataEntryResponse>('/api/v1/entries/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async createBulkDataEntries(data: BulkDataEntryCreate): Promise<BulkOperationResult> {
        return apiClient.request<BulkOperationResult>('/api/v1/entries/bulk', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async deleteDataEntry(id: string): Promise<void> {
        return apiClient.request<void>(`/api/v1/entries/${id}`, {
            method: 'DELETE'
        });
    },

    // Dataset Meta CRUD
    async getDatasetMeta(datasetId: string): Promise<DatasetMetaResponse> {
        return apiClient.get<DatasetMetaResponse>(`/api/v1/datasets/${datasetId}/meta`);
    },

    async updateDatasetMeta(datasetId: string, data: DatasetMetaUpdate): Promise<DatasetMetaResponse> {
        return apiClient.request<DatasetMetaResponse>(`/api/v1/datasets/${datasetId}/meta`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    // Dataset Starring
    async starDataset(datasetId: string): Promise<{ message: string }> {
        return apiClient.request<{ message: string }>(`/api/v1/datasets/${datasetId}/star`, {
            method: 'POST'
        });
    },

    async unstarDataset(datasetId: string): Promise<{ message: string }> {
        return apiClient.request<{ message: string }>(`/api/v1/datasets/${datasetId}/star`, {
            method: 'DELETE'
        });
    },

    async isStarred(datasetId: string): Promise<{ is_starred: boolean }> {
        return apiClient.get<{ is_starred: boolean }>(`/api/v1/datasets/${datasetId}/starred`);
    },

    async downloadDataset(id: string, format: 'json' | 'csv') {
        const response: any = await apiClient.get<Blob>(`/api/v1/datasets/${id}/download?format=${format}`, {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `dataset_${id}.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },

    async incrementView(datasetId: string): Promise<void> {
        return apiClient.request<void>(`/api/v1/datasets/${datasetId}/views`, {
            method: 'POST'
        });
    }
};
