# Carevo UI Preview Setup

## Quick Start (UI Preview Only)

To preview the UI on localhost:3000, follow these steps:

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
Create a `.env.local` file in the root directory with these mock values:

```env
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
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
Navigate to: **http://localhost:3000**

## Available Pages

- **Login**: http://localhost:3000/login
- **Board**: http://localhost:3000/board
- **My Tasks**: http://localhost:3000/my
- **Chat**: http://localhost:3000/chat
- **Admin**: http://localhost:3000/admin

## Features to Test

### Authentication Flow
1. Go to `/login`
2. Enter any phone number (e.g., +1 (555) 123-4567)
3. Enter any 6-digit code (e.g., 123456)
4. Set up passkey (optional)

### Task Board
1. Go to `/board`
2. View the Kanban board with sample tasks
3. Click on any task to open the task drawer
4. Try the filters and search functionality
5. Use ⌘K (or Ctrl+K) to open command palette

### Chat Interface
1. Go to `/chat`
2. Select different channels
3. Type messages with @mentions
4. Try creating tasks from messages

### Admin Panel
1. Go to `/admin`
2. Switch between People, Locations, and Security tabs
3. Try adding/editing users and locations

## Notes

- This is a UI preview with mock data
- No real backend integration
- All forms and interactions are functional but won't persist data
- Perfect for demonstrating the user interface and user experience

## Troubleshooting

If you encounter any issues:

1. Make sure Node.js 18+ is installed
2. Delete `node_modules` and `package-lock.json`, then run `npm install`
3. Check that all files are in the correct directory structure
4. Ensure the `.env.local` file is created in the root directory
