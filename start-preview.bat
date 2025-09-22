@echo off
echo Setting up Carevo UI Preview...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo Creating .env.local file...
    echo # Supabase (Mock values for UI preview) > .env.local
    echo NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co >> .env.local
    echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key >> .env.local
    echo SUPABASE_SERVICE_ROLE_KEY=your-service-role-key >> .env.local
    echo. >> .env.local
    echo # Database (Mock values for UI preview) >> .env.local
    echo DATABASE_URL=postgresql://username:password@localhost:5432/carevo >> .env.local
    echo. >> .env.local
    echo # Twilio (Mock values for UI preview) >> .env.local
    echo TWILIO_ACCOUNT_SID=your-twilio-account-sid >> .env.local
    echo TWILIO_AUTH_TOKEN=your-twilio-auth-token >> .env.local
    echo TWILIO_FROM_NUMBER=+1234567890 >> .env.local
    echo. >> .env.local
    echo # AWS SES (Mock values for UI preview) >> .env.local
    echo AWS_SES_REGION=us-east-1 >> .env.local
    echo AWS_SES_SMTP_USER=your-ses-smtp-username >> .env.local
    echo AWS_SES_SMTP_PASS=your-ses-smtp-password >> .env.local
    echo. >> .env.local
    echo # App >> .env.local
    echo APP_BASE_URL=http://localhost:3000 >> .env.local
    echo JWT_SECRET=your-jwt-secret-key-for-development >> .env.local
    echo CRON_TIMEZONE=America/Chicago >> .env.local
    echo.
    echo .env.local file created with mock values.
    echo.
)

echo Starting development server...
echo.
echo The app will be available at: http://localhost:3000
echo.
echo Available pages:
echo - Login: http://localhost:3000/login
echo - Board: http://localhost:3000/board
echo - My Tasks: http://localhost:3000/my
echo - Chat: http://localhost:3000/chat
echo - Admin: http://localhost:3000/admin
echo.
echo Press Ctrl+C to stop the server.
echo.

npm run dev

