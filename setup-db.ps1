# ============================================================
#  FoodieGo — Setup Database Script (Windows PowerShell)
#  Chạy 1 lần để tạo user + database + schema
#  Usage: .\setup-db.ps1
# ============================================================

Write-Host "🍔 FoodieGo — Thiết lập Database" -ForegroundColor Cyan

# Tìm psql trong các vị trí phổ biến
$psqlPaths = @(
    "C:\Program Files\PostgreSQL\17\bin\psql.exe",
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe"
)

$psql = $null
foreach ($path in $psqlPaths) {
    if (Test-Path $path) {
        $psql = $path
        break
    }
}

if (-not $psql) {
    Write-Host "❌ Không tìm thấy psql. Hãy cài PostgreSQL trước." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Tìm thấy psql tại: $psql" -ForegroundColor Green

# Tạo user + database (dùng superuser postgres)
Write-Host "`n📦 Tạo user 'foodiego' và database 'foodiego_db'..." -ForegroundColor Yellow

$setupSQL = @"
DO `$`$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'foodiego') THEN
      CREATE USER foodiego WITH PASSWORD 'foodiego123';
   END IF;
END
`$`$;

SELECT 'CREATE DATABASE foodiego_db OWNER foodiego'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'foodiego_db')\gexec
"@

$setupSQL | & $psql -U postgres -c $setupSQL
# Fallback: chạy từng lệnh riêng
& $psql -U postgres -c "DO `$`$ BEGIN IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'foodiego') THEN CREATE USER foodiego WITH PASSWORD 'foodiego123'; END IF; END `$`$;"
& $psql -U postgres -c "SELECT 'CREATE DATABASE foodiego_db OWNER foodiego' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'foodiego_db')" | & $psql -U postgres

Write-Host "`n🗃️  Chạy migration schema..." -ForegroundColor Yellow
& $psql -U postgres -d foodiego_db -f "backend\migrations\001_init.sql"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Database setup hoàn thành!" -ForegroundColor Green
    Write-Host "   DB:       foodiego_db" -ForegroundColor White
    Write-Host "   User:     foodiego" -ForegroundColor White
    Write-Host "   Password: foodiego123" -ForegroundColor White
    Write-Host "   Port:     5432" -ForegroundColor White
} else {
    Write-Host "`n⚠️  Có lỗi xảy ra. Xem output phía trên." -ForegroundColor Yellow
}
