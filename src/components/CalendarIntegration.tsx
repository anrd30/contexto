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
          px-5 py-3 text-sm
          glass-card rounded-lg
          text-dark-400 hover:text-white
          hover:bg-white/10 hover:scale-105
          transition-all duration-200
          font-semibold
          flex items-center gap-2
        "
      >
        {isConnected ? (
          <>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            📅 Calendar Connected
          </>
        ) : (
          '📅 Connect Calendar'
        )}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-card w-full max-w-md p-8 rounded-2xl shadow-2xl border border-white/20 animate-scaleIn">
            <h2 className="text-3xl font-bold mb-2">
              <span className="gradient-text">Calendar Integration</span>
            </h2>
            <p className="text-dark-500 mb-6">Sync with Google Calendar</p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg">
                ⚠️ {error}
              </div>
            )}

            {isConnected ? (
              <>
                <div className="mb-6 p-5 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <p className="text-green-400 font-bold mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                    Connected to Google Calendar
                  </p>
                  <p className="text-sm text-dark-400">
                    Tasks can now sync with your calendar events. ✨
                  </p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleDisconnect}
                    className="
                      w-full px-6 py-3
                      glass-card rounded-lg
                      text-red-400 hover:text-white font-bold
                      hover:bg-red-500/20
                      transition-all duration-200
                    "
                  >
                    Disconnect Calendar
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="
                      w-full px-6 py-3
                      text-dark-500 hover:text-white
                      transition-colors duration-200
                      font-semibold
                    "
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-dark-400 mb-4">
                  Connect your calendar to automatically:
                </p>
                <ul className="list-none text-dark-400 mb-6 space-y-3">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-accent-purple flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Create calendar events when pausing tasks
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-accent-blue flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Resume tasks based on scheduled times
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-accent-pink flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Sync task context with calendar
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-accent-cyan flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Block focus time for active tasks
                  </li>
                </ul>

                <div className="space-y-4">
                  <button
                    onClick={handleGoogleCalendarAuth}
                    className="
                      w-full px-8 py-4
                      bg-gradient-to-r from-accent-purple to-accent-blue
                      text-white font-bold text-lg
                      rounded-xl
                      hover:scale-105 hover:shadow-lg hover:shadow-accent-purple/50
                      active:scale-95
                      transition-all duration-200
                      flex items-center justify-center gap-3
                      glow-button
                    "
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
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
                      glass-card rounded-lg
                      text-dark-600 font-medium
                      opacity-50 cursor-not-allowed
                      transition-all duration-200
                    "
                    disabled
                  >
                    Connect Outlook (Coming Soon)
                  </button>

                  <button
                    onClick={() => setShowModal(false)}
                    className="
                      w-full px-6 py-3
                      text-dark-500 hover:text-white
                      transition-colors duration-200
                      font-semibold
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
      <div className="px-5 py-3 text-sm text-dark-600 glass-card rounded-lg">
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
