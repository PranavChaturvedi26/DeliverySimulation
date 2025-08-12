#!/bin/bash

# AWS EC2 Deployment Script for GreenCart Application
# Run this script on your EC2 instance after setting up Docker

set -e

echo "🚀 Starting GreenCart deployment on AWS EC2..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Get EC2 public IP
EC2_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
if [ -z "$EC2_PUBLIC_IP" ]; then
    print_warning "Could not fetch EC2 public IP. Please update .env.production manually."
    EC2_PUBLIC_IP="localhost"
fi

print_status "EC2 Public IP: $EC2_PUBLIC_IP"

# Update environment variables
if [ -f ".env.production" ]; then
    print_status "Updating environment variables..."
    sed -i "s/your-ec2-public-ip/$EC2_PUBLIC_IP/g" .env.production
    cp .env.production .env
    print_status "Environment variables updated!"
else
    print_error ".env.production file not found. Please create it first."
    exit 1
fi

# Stop existing containers if running
print_status "Stopping existing containers..."
docker compose -f docker-compose.prod.yml down || true

# Remove unused Docker resources
print_status "Cleaning up Docker resources..."
docker system prune -f

# Build and start services
print_status "Building and starting services..."
docker compose -f docker-compose.prod.yml --env-file .env up --build -d

# Wait for services to be healthy
print_status "Waiting for services to be healthy..."
sleep 30

# Check service status
print_status "Checking service status..."
docker compose -f docker-compose.prod.yml ps

# Test API endpoint
print_status "Testing API endpoint..."
if curl -f http://localhost:5000/api/auth/me &> /dev/null; then
    print_status "✅ Backend API is responding!"
else
    print_warning "⚠️  Backend API is not responding yet. Check logs if needed."
fi

# Test frontend
print_status "Testing frontend..."
if curl -f http://localhost/ &> /dev/null; then
    print_status "✅ Frontend is responding!"
else
    print_warning "⚠️  Frontend is not responding yet. Check logs if needed."
fi

print_status "🎉 Deployment completed!"
print_status "Access your application at:"
print_status "  Frontend: http://$EC2_PUBLIC_IP"
print_status "  Backend API: http://$EC2_PUBLIC_IP:5000"
print_status ""
print_status "To view logs:"
print_status "  docker compose -f docker-compose.prod.yml logs -f"
print_status ""
print_status "To update the application:"
print_status "  git pull && ./deploy-to-ec2.sh"