# Test adding multiple FIR records

Write-Host "Adding multiple FIR records..." -ForegroundColor Cyan

# Add FIR 1
$body1 = @{
    criminal_name = "Ali Khan"
    crime = "Theft"
    location = "Karachi"
    date = "2025-01-18"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/add_fir" -Method Post -Body $body1 -ContentType "application/json" | Out-Null
Write-Host "✅ Added FIR 1: Ali Khan - Theft" -ForegroundColor Green

# Add FIR 2
$body2 = @{
    criminal_name = "Sara Ahmed"
    crime = "Fraud"
    location = "Lahore"
    date = "2025-01-17"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/add_fir" -Method Post -Body $body2 -ContentType "application/json" | Out-Null
Write-Host "✅ Added FIR 2: Sara Ahmed - Fraud" -ForegroundColor Green

# Add FIR 3
$body3 = @{
    criminal_name = "Ahmed Raza"
    crime = "Robbery"
    location = "Islamabad"
    date = "2025-01-16"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/add_fir" -Method Post -Body $body3 -ContentType "application/json" | Out-Null
Write-Host "✅ Added FIR 3: Ahmed Raza - Robbery" -ForegroundColor Green

# Add FIR 4
$body4 = @{
    criminal_name = "Fatima Ali"
    crime = "Cybercrime"
    location = "Karachi"
    date = "2025-01-15"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/add_fir" -Method Post -Body $body4 -ContentType "application/json" | Out-Null
Write-Host "✅ Added FIR 4: Fatima Ali - Cybercrime" -ForegroundColor Green

Write-Host ""
Write-Host "Viewing all records..." -ForegroundColor Cyan
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/view_all" -Method Get
Write-Host $response.data -ForegroundColor Yellow

Write-Host ""
Write-Host "✅ Test complete! Open http://localhost:3000/view-firs to see records in UI" -ForegroundColor Green
