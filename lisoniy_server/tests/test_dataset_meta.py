"""Tests for Dataset Meta API endpoints"""

import pytest
from httpx import AsyncClient
from uuid import uuid4


class TestDatasetMetaAPI:
    """Test suite for Dataset Meta API"""
    
    @pytest.mark.asyncio
    async def test_get_dataset_meta(self, async_client: AsyncClient, test_dataset, auth_headers):
        """Test GET /datasets/{id}/meta endpoint"""
        response = await async_client.get(f"/api/v1/datasets/{test_dataset['id']}/meta")
        
        assert response.status_code == 200
        data = response.json()
        assert "dataset_id" in data
        assert "stars_count" in data
        assert "downloads_count" in data
        assert "views_count" in data
        assert data["stars_count"] == 0
        assert data["downloads_count"] == 0
    
    @pytest.mark.asyncio
    async def test_get_dataset_meta_not_found(self, async_client: AsyncClient):
        """Test GET /datasets/{id}/meta with non-existent dataset"""
        fake_id = str(uuid4())
        response = await async_client.get(f"/api/v1/datasets/{fake_id}/meta")
        
        assert response.status_code == 404
    
    @pytest.mark.asyncio
    async def test_update_dataset_meta(self, async_client: AsyncClient, test_dataset, auth_headers):
        """Test PUT /datasets/{id}/meta endpoint"""
        update_data = {
            "readme": "# Test Dataset\n\nThis is a test dataset.",
            "description": "Extended description",
            "license_type": "MIT",
            "license_text": "MIT License"
        }
        
        response = await async_client.put(
            f"/api/v1/datasets/{test_dataset['id']}/meta",
            json=update_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["readme"] == update_data["readme"]
        assert data["license_type"] == "MIT"
    
    @pytest.mark.asyncio
    async def test_update_dataset_meta_unauthorized(self, async_client: AsyncClient, test_dataset):
        """Test PUT /datasets/{id}/meta without authentication"""
        update_data = {"readme": "# Test"}
        
        response = await async_client.put(
            f"/api/v1/datasets/{test_dataset['id']}/meta",
            json=update_data
        )
        
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_get_dataset_detail(self, async_client: AsyncClient, test_dataset):
        """Test GET /datasets/{id}/detail endpoint"""
        response = await async_client.get(f"/api/v1/datasets/{test_dataset['id']}/detail")
        
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert "name" in data
        assert "meta" in data
        assert "creator" in data
        assert "contributors" in data
        assert data["views_count"] >= 1  # Should increment on access
    
    @pytest.mark.asyncio
    async def test_star_dataset(self, async_client: AsyncClient, test_dataset, auth_headers):
        """Test POST /datasets/{id}/star endpoint"""
        response = await async_client.post(
            f"/api/v1/datasets/{test_dataset['id']}/star",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "dataset_id" in data
        assert "user_id" in data
        assert "created_at" in data
    
    @pytest.mark.asyncio
    async def test_star_dataset_duplicate(self, async_client: AsyncClient, test_dataset, auth_headers):
        """Test starring same dataset twice"""
        # First star
        await async_client.post(
            f"/api/v1/datasets/{test_dataset['id']}/star",
            headers=auth_headers
        )
        
        # Try to star again
        response = await async_client.post(
            f"/api/v1/datasets/{test_dataset['id']}/star",
            headers=auth_headers
        )
        
        assert response.status_code == 400
    
    @pytest.mark.asyncio
    async def test_unstar_dataset(self, async_client: AsyncClient, test_dataset, auth_headers):
        """Test DELETE /datasets/{id}/star endpoint"""
        # First star the dataset
        await async_client.post(
            f"/api/v1/datasets/{test_dataset['id']}/star",
            headers=auth_headers
        )
        
        # Then unstar
        response = await async_client.delete(
            f"/api/v1/datasets/{test_dataset['id']}/star",
            headers=auth_headers
        )
        
        assert response.status_code == 204
    
    @pytest.mark.asyncio
    async def test_get_dataset_stars(self, async_client: AsyncClient, test_dataset, auth_headers):
        """Test GET /datasets/{id}/stars endpoint"""
        # Star the dataset first
        await async_client.post(
            f"/api/v1/datasets/{test_dataset['id']}/star",
            headers=auth_headers
        )
        
        # Get stars list
        response = await async_client.get(f"/api/v1/datasets/{test_dataset['id']}/stars")
        
        assert response.status_code == 200
        data = response.json()
        assert "total" in data
        assert "stars" in data
        assert data["total"] >= 1
    
    @pytest.mark.asyncio
    async def test_record_download(self, async_client: AsyncClient, test_dataset):
        """Test POST /datasets/{id}/download endpoint"""
        response = await async_client.post(f"/api/v1/datasets/{test_dataset['id']}/download")
        
        assert response.status_code == 204
        
        # Verify download count increased
        meta_response = await async_client.get(f"/api/v1/datasets/{test_dataset['id']}/meta")
        assert meta_response.status_code == 200
        data = meta_response.json()
        assert data["downloads_count"] >= 1
    
    @pytest.mark.asyncio
    async def test_get_dataset_contributors(self, async_client: AsyncClient, test_dataset):
        """Test GET /datasets/{id}/contributors endpoint"""
        response = await async_client.get(f"/api/v1/datasets/{test_dataset['id']}/contributors")
        
        assert response.status_code == 200
        data = response.json()
        assert "total" in data
        assert "contributors" in data
        assert isinstance(data["contributors"], list)
