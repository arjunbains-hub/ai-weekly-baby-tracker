#!/bin/bash

# Weekly Baby Genie Deployment Script

echo "🚀 Deploying Weekly Baby Genie..."

# Check if we're in the backend directory
if [ ! -f "main.py" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Initialize database and seed data
echo "🗄️ Initializing database..."
python main.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Seed milestone data
echo "🌱 Seeding milestone data..."
python seed_milestones.py

# Stop the backend
kill $BACKEND_PID

echo "✅ Deployment complete!"
echo "🍼 Weekly Baby Genie is ready to help track baby development!" 