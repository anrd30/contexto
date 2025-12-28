# Google Calendar Integration Setup

This guide will help you set up Google Calendar integration for the Task Context Restorer app.

## Prerequisites

- A Google Cloud account
- Google Calendar API access

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project name for reference

### 2. Enable Google Calendar API

1. In the Google Cloud Console, navigate to **APIs & Services > Library**
2. Search for "Google Calendar API"
3. Click on it and press **Enable**

### 3. Configure OAuth Consent Screen

1. Go to **APIs & Services > OAuth consent screen**
2. Choose **External** user type (unless you have a Google Workspace)
3. Fill in the required fields:
   - **App name**: Task Context Restorer
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Click **Save and Continue**
5. On the Scopes page:
   - Click **Add or Remove Scopes**
   - Add these scopes:
     - `https://www.googleapis.com/auth/calendar.events`
     - `https://www.googleapis.com/auth/calendar.readonly`
   - Click **Save and Continue**
6. Add test users (your email) if app is in testing mode
7. Click **Save and Continue**

### 4. Create OAuth 2.0 Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth 2.0 Client ID**
3. Select **Web application**
4. Configure the client:
   - **Name**: Task Context Restorer Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (for local development)
     - `https://your-production-domain.com` (add after deploying)
   - **Authorized redirect URIs**:
     - `http://localhost:5173` (for local development)
     - `https://your-production-domain.com` (add after deploying)
5. Click **Create**
6. Copy your **Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)

### 5. Configure Your Application

1. In your project root, create a `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Client ID:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

### 6. Test the Integration

1. Open your app at `http://localhost:5173`
2. Click **Connect Calendar** button
3. You should see the Google OAuth login screen
4. Sign in with your Google account
5. Grant the requested permissions
6. You should see "Calendar Connected" status

## Production Deployment

When deploying to production (e.g., Vercel):

1. Add your production domain to:
   - Authorized JavaScript origins
   - Authorized redirect URIs
   
2. Update your production environment variables:
   - In Vercel: Go to **Settings > Environment Variables**
   - Add `VITE_GOOGLE_CLIENT_ID` with your Client ID

3. If your app is in testing mode on Google Cloud:
   - Either add users individually as test users
   - Or submit for verification to make it public

## Features Enabled

Once connected, the app can:

✅ **Create calendar events** when you pause a task with a resume time
✅ **Delete calendar events** when you complete a task
✅ **Read upcoming events** to display your schedule
✅ **Sync task context** with calendar event descriptions

## Troubleshooting

### "Google Client ID not configured" error
- Make sure `.env` file exists in project root
- Check that `VITE_GOOGLE_CLIENT_ID` is set
- Restart the dev server after creating `.env`

### OAuth redirect_uri_mismatch error
- Ensure `http://localhost:5173` is added to Authorized JavaScript origins
- Make sure there are no trailing slashes
- Check that the port matches your dev server

### "Authentication expired" error
- The access token has expired (happens after ~1 hour)
- Click "Disconnect Calendar" and reconnect
- In production, you'd implement refresh tokens

### Calendar events not appearing
- Check browser console for errors
- Verify Calendar API is enabled in Google Cloud
- Ensure proper scopes were granted during OAuth

## API Limits

- **Free tier**: 1,000,000 requests per day
- **Per-user limit**: 10 requests per second
- More than enough for personal use

## Security Notes

- Never commit `.env` file to git (it's in `.gitignore`)
- Client ID is safe to expose in frontend code
- Access tokens are stored in localStorage
- In production, consider using refresh tokens for longer sessions

## Need Help?

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/guides/overview)
- [OAuth 2.0 for Client-side Web Apps](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow)
