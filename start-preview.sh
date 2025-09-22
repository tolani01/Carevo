#!/bin/bash

echo "Setting up Carevo UI Preview..."
echo

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cat > .env.local << EOF
# Supabase (Mock values for UI preview)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (Mock values for UI preview)
DATABASE_URL=postgresql://username:password@localhost:5432/carevo

# Twilio (Mock values for UI preview)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_FROM_NUMBER=+1234567890

# AWS SES (Mock values for UI preview)
AWS_SES_REGION=us-east-1
AWS_SES_SMTP_USER=your-ses-smtp-username
AWS_SES_SMTP_PASS=your-ses-smtp-password

# App
APP_BASE_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret-key-for-development
CRON_TIMEZONE=America/Chicago
EOF
    echo
    echo ".env.local file created with mock values."
    echo
fi

echo "Starting development server..."
echo
echo "The app will be available at: http://localhost:3000"
echo
echo "Available pages:"
echo "- Login: http://localhost:3000/login"
echo "- Board: http://localhost:3000/board"
echo "- My Tasks: http://localhost:3000/my"
echo "- Chat: http://localhost:3000/chat"
echo "- Admin: http://localhost:3000/admin"
echo
echo "Press Ctrl+C to stop the server."
echo

npm run dev

