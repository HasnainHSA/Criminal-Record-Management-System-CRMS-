# Test CRMS API

Write-Host "Testing CRMS System..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Add FIR
Write-Host "Test 1: Adding FIR Record..." -ForegroundColor Yellow
$body = @{
    criminal_name = "Ali Khan"
    crime = "Theft"
    location = "Karachi"
    date = "2025-01-18"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/add_fir" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ Success: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: Search Criminal
Write-Host "Test 2: Searching for Criminal..." -ForegroundColor Yellow
$body = @{
    criminal_name = "Ali Khan"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/search_criminal" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ Result:" -ForegroundColor Green
    Write-Host $response.data
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}

Write-Host ""

# Test 3: View All
Write-Host "Test 3: Viewing All Records..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/view_all" -Method Get
    Write-Host "✅ Result:" -ForegroundColor Green
    Write-Host $response.data
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Testing Complete!" -ForegroundColor Cyan
