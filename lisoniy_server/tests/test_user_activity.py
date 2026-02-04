"""Tests for User Activity API endpoint"""

import pytest
from httpx import AsyncClient


class TestUserActivityAPI:
    """Test suite for User Activity API"""
    
    @pytest.mark.asyncio
    async def test_get_user_activity(self, async_client: AsyncClient, test_user):
        """Test GET /users/{id}/activity endpoint"""
        response = await async_client.get(f"/api/v1/users/{test_user['id']}/activity")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "activity_logs" in data
        assert "datasets" in data
        assert "discussions" in data
        assert "articles" in data
        
        # Verify types
        assert isinstance(data["activity_logs"], list)
        assert isinstance(data["datasets"], list)
        assert isinstance(data["discussions"], list)
        assert isinstance(data["articles"], list)
    
    @pytest.mark.asyncio
    async def test_get_user_activity_with_data(
        self, 
        async_client: AsyncClient, 
        test_user, 
        test_dataset,
        test_discussion,
        test_article
    ):
        """Test user activity endpoint with actual data"""
        response = await async_client.get(f"/api/v1/users/{test_user['id']}/activity")
        
        assert response.status_code == 200
        data = response.json()
        
        # Should have at least one dataset
        assert len(data["datasets"]) >= 1
        dataset = data["datasets"][0]
        assert "id" in dataset
        assert "name" in dataset
        assert "entry_count" in dataset
        
        # Should have at least one discussion
        assert len(data["discussions"]) >= 1
        discussion = data["discussions"][0]
        assert discussion["type"] == "discussion"
        assert "total_likes" in discussion
        
        # Should have at least one article
        assert len(data["articles"]) >= 1
        article = data["articles"][0]
        assert article["type"] == "article"
        assert "total_views" in article
    
    @pytest.mark.asyncio
    async def test_get_user_activity_activity_logs(
        self, 
        async_client: AsyncClient, 
        test_user,
        test_term_audit_log
    ):
        """Test activity logs in user activity"""
        response = await async_client.get(f"/api/v1/users/{test_user['id']}/activity")
        
        assert response.status_code == 200
        data = response.json()
        
        # Should have activity logs
        if len(data["activity_logs"]) > 0:
            log = data["activity_logs"][0]
            assert "id" in log
            assert "action" in log
            assert "term_keyword" in log
            assert "timestamp" in log
            assert log["action"] in ["create", "update", "delete"]
    
    @pytest.mark.asyncio
    async def test_get_user_activity_not_found(self, async_client: AsyncClient):
        """Test GET /users/{id}/activity with non-existent user"""
        response = await async_client.get("/api/v1/users/99999/activity")
        
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
        assert data["detail"] == "User not found"
    
    @pytest.mark.asyncio
    async def test_get_user_activity_empty(self, async_client: AsyncClient, test_user_empty):
        """Test user activity with user who has no activity"""
        response = await async_client.get(f"/api/v1/users/{test_user_empty['id']}/activity")
        
        assert response.status_code == 200
        data = response.json()
        
        # All should be empty arrays
        assert len(data["activity_logs"]) == 0
        assert len(data["datasets"]) == 0
        assert len(data["discussions"]) == 0
        assert len(data["articles"]) == 0
    
    @pytest.mark.asyncio
    async def test_user_activity_limit(
        self, 
        async_client: AsyncClient, 
        test_user,
        create_multiple_datasets
    ):
        """Test that activity endpoint limits to 10 items per category"""
        # Create more than 10 datasets
        await create_multiple_datasets(test_user["id"], count=15)
        
        response = await async_client.get(f"/api/v1/users/{test_user['id']}/activity")
        
        assert response.status_code == 200
        data = response.json()
        
        # Should return max 10 datasets
        assert len(data["datasets"]) <= 10
    
    @pytest.mark.asyncio
    async def test_user_activity_ordering(
        self, 
        async_client: AsyncClient, 
        test_user,
        test_datasets_with_dates
    ):
        """Test that activity items are ordered by date (newest first)"""
        response = await async_client.get(f"/api/v1/users/{test_user['id']}/activity")
        
        assert response.status_code == 200
        data = response.json()
        
        # Check datasets are ordered by created_at desc
        if len(data["datasets"]) >= 2:
            first_date = data["datasets"][0]["created_at"]
            second_date = data["datasets"][1]["created_at"]
            assert first_date >= second_date
