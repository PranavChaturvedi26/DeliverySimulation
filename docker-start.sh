#!/bin/bash

# GreenCart Docker Startup Script

echo "🚚 Starting GreenCart Logistics Management System with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose and try again."
    exit 1
fi

# Create .env file from example if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.docker template..."
    cp .env.docker .env
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove old volumes (optional - comment out if you want to keep data)
echo "🗑️  Removing old volumes..."
docker-compose down -v

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=20

echo ""
echo "✅ GreenCart is starting up!"
echo ""
echo "🌐 Access points:"
echo "   Frontend:        http://localhost:3000"
echo "   Backend API:     http://localhost:5000"
echo "   MongoDB Admin:   http://localhost:8081 (admin/admin)"
echo "   Redis Admin:     http://localhost:8082"
echo ""
echo "📊 Monitor logs with: docker-compose logs -f"
echo "🛑 Stop services with: docker-compose down"
echo ""
echo "⚡ To view real-time logs:"
echo "   docker-compose logs -f backend"
echo "   docker-compose logs -f frontend"
echo "   docker-compose logs -f mongodb"
echo "   docker-compose logs -f redis"