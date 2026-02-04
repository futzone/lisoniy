$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzY5NTM2OTE1LCJ0eXBlIjoiYWNjZXNzIn0.rZ0pwO3plWxp44eiY3HESK8SW-FzpzXrJJ18Lq-yzJg"
}
$body = @{
    "title" = "Test uchun discussion"
    "body" = "It is a test body"
    "type" = "discussion"
    "tags" = "test, demo"
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/posts/" -Method POST -Headers $headers -Form $body
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $_"
    Write-Host "Response: $($_.Exception.Response)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
}
