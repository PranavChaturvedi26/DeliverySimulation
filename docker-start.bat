@echo off
REM GreenCart Docker Startup Script for Windows

echo 🚚 Starting GreenCart Logistics Management System with Docker...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

REM Create .env file from example if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from .env.docker template...
    copy .env.docker .env
)

REM Stop any existing containers
echo 🛑 Stopping existing containers...
docker-compose down

REM Remove old volumes (optional)
echo 🗑️  Removing old volumes...
docker-compose down -v

REM Build and start services
echo 🏗️  Building and starting services...
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Check if services are running
echo 🔍 Checking service status...
docker-compose ps

REM Show logs
echo 📋 Recent logs:
docker-compose logs --tail=20

echo.
echo ✅ GreenCart is starting up!
echo.
echo 🌐 Access points:
echo    Frontend:        http://localhost:3000
echo    Backend API:     http://localhost:5000
echo    MongoDB Admin:   http://localhost:8081 (admin/admin)
echo    Redis Admin:     http://localhost:8082
echo.
echo 📊 Monitor logs with: docker-compose logs -f
echo 🛑 Stop services with: docker-compose down
echo.
echo ⚡ To view real-time logs:
echo    docker-compose logs -f backend
echo    docker-compose logs -f frontend
echo    docker-compose logs -f mongodb
echo    docker-compose logs -f redis

pause