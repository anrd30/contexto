import { useState } from 'react';

export const CalendarIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleGoogleCalendarAuth = async () => {
    // This would integrate with Google Calendar API
    // For MVP, we'll show instructions
    alert('Calendar Integration:\n\n1. Go to Google Calendar\n2. Create calendar events\n3. Add task IDs in event description\n4. App will auto-pause/resume based on events\n\nFull OAuth integration coming soon!');
    setIsConnected(true);
    setShowModal(false);
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
            <p className="text-neutral-600 mb-6">
              Connect your calendar to automatically:
            </p>
            <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
              <li>Pause tasks when meetings start</li>
              <li>Resume tasks when meetings end</li>
              <li>Sync task deadlines</li>
              <li>Block focus time</li>
            </ul>

            <div className="space-y-3">
              <button
                onClick={handleGoogleCalendarAuth}
                className="
                  w-full px-6 py-3
                  bg-accent text-white font-semibold
                  hover:bg-accent/90
                  transition-colors duration-150
                "
              >
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
                "
              >
                Connect Outlook
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
          </div>
        </div>
      )}
    </>
  );
};
