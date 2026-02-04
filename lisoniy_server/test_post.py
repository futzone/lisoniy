import requests

url = "http://localhost:8000/api/v1/posts/"
headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzY5NTM2OTE1LCJ0eXBlIjoiYWNjZXNzIn0.rZ0pwO3plWxp44eiY3HESK8SW-FzpzXrJJ18Lq-yzJg"
}
data = {
    "title": "Test uchun discussion",
    "body": "It is a test body",
    "type": "discussion",
    "tags": "test, demo"
}

try:
    response = requests.post(url, headers=headers, data=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
