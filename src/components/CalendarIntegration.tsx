import { useState, useEffect } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { GOOGLE_CONFIG } from '../config/google';
import { calendarService } from '../services/calendar';

const CalendarIntegrationInner = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if already authenticated
    setIsConnected(calendarService.isAuthenticated());
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        calendarService.setAccessToken(tokenResponse.access_token);
        setIsConnected(true);
        setShowModal(false);
        setError(null);
        
        // Test the connection by fetching upcoming events
        const events = await calendarService.listUpcomingEvents(5);
        console.log('Connected successfully. Upcoming events:', events);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect');
        calendarService.clearAccessToken();
        setIsConnected(false);
      }
    },
    onError: () => {
      setError('Failed to authenticate with Google');
    },
    scope: GOOGLE_CONFIG.scopes.join(' '),
  });

  const handleGoogleCalendarAuth = () => {
    if (!GOOGLE_CONFIG.clientId) {
      setError('Google Client ID not configured. Please add VITE_GOOGLE_CLIENT_ID to .env file.');
      return;
    }
    setError(null);
    googleLogin();
  };

  const handleDisconnect = () => {
    calendarService.clearAccessToken();
    setIsConnected(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="
          px-4 py-2 text-sm
          bg-white text-neutral-700
          border border-neutral-300
          hover:border-neutral-400
          transition-colors duration-150
        "
      >
        {isConnected ? '📅 Calendar Connected' : '📅 Connect Calendar'}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">
              Calendar Integration
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {isConnected ? (
              <>
                <div className="mb-6 p-4 bg-green-50 border border-green-200">
                  <p className="text-green-700 font-medium mb-2">✓ Connected to Google Calendar</p>
                  <p className="text-sm text-green-600">
                    Tasks can now sync with your calendar events.
                  </p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleDisconnect}
                    className="
                      w-full px-6 py-3
                      bg-white text-red-600 font-medium
                      border border-red-300
                      hover:bg-red-50
                      transition-colors duration-150
                    "
                  >
                    Disconnect Calendar
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="
                      w-full px-6 py-3
                      text-neutral-600
                      hover:text-neutral-800
                      transition-colors duration-150
                    "
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-neutral-600 mb-6">
                  Connect your calendar to automatically:
                </p>
                <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
                  <li>Create calendar events when pausing tasks</li>
                  <li>Resume tasks based on scheduled times</li>
                  <li>Sync task context with calendar</li>
                  <li>Block focus time for active tasks</li>
                </ul>

                <div className="space-y-3">
                  <button
                    onClick={handleGoogleCalendarAuth}
                    className="
                      w-full px-6 py-3
                      bg-accent text-white font-semibold
                      hover:bg-accent/90
                      transition-colors duration-150
                      flex items-center justify-center gap-2
                    "
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Connect Google Calendar
                  </button>
                  
                  <button
                    onClick={() => alert('Outlook integration coming soon!')}
                    className="
                      w-full px-6 py-3
                      bg-white text-neutral-700 font-medium
                      border border-neutral-300
                      hover:border-neutral-400
                      transition-colors duration-150
                      opacity-50 cursor-not-allowed
                    "
                    disabled
                  >
                    Connect Outlook (Coming Soon)
                  </button>

                  <button
                    onClick={() => setShowModal(false)}
                    className="
                      w-full px-6 py-3
                      text-neutral-600
                      hover:text-neutral-800
                      transition-colors duration-150
                    "
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export const CalendarIntegration = () => {
  if (!GOOGLE_CONFIG.clientId) {
    return (
      <div className="px-4 py-2 text-sm text-neutral-500 border border-neutral-300">
        📅 Calendar (Setup Required)
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CONFIG.clientId}>
      <CalendarIntegrationInner />
    </GoogleOAuthProvider>
  );
};
