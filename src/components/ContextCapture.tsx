import { useState, useEffect, useRef } from 'react';
import { useTaskStore } from '../store';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { capturePageScreenshot } from '../utils/screenshot';

export const ContextCapture = () => {
  const [note, setNote] = useState('');
  const [links, setLinks] = useState(['', '', '', '', '']);
  const [nextAction, setNextAction] = useState('');
  const [showLinks, setShowLinks] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);
  
  const noteInputRef = useRef<HTMLTextAreaElement>(null);
  
  const {
    isRecording,
    audioUrl,
    transcript,
    error: voiceError,
    startRecording,
    stopRecording,
    clearRecording,
  } = useVoiceRecorder();
  
  const showContextCapture = useTaskStore((state) => state.showContextCapture);
  const setShowContextCapture = useTaskStore((state) => state.setShowContextCapture);
  const selectedTaskId = useTaskStore((state) => state.selectedTaskId);
  const addContext = useTaskStore((state) => state.addContext);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);

  useEffect(() => {
    if (showContextCapture && noteInputRef.current) {
      noteInputRef.current.focus();
    }
  }, [showContextCapture]);

  // Auto-populate note with transcript
  useEffect(() => {
    if (transcript && !note) {
      setNote(transcript);
    }
  }, [transcript]);

  if (!showContextCapture || !selectedTaskId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (note.trim()) {
      addContext(
        selectedTaskId,
        note.trim(),
        links.filter((link) => link.trim() !== ''),
        nextAction.trim() || undefined,
        audioUrl || undefined,
        transcript || undefined,
        screenshot || undefined
      );
      
      updateTaskStatus(selectedTaskId, 'paused');
      
      // Reset form
      setNote('');
      setLinks(['', '', '', '', '']);
      setNextAction('');
      setShowLinks(false);
      setScreenshot(null);
      clearRecording();
      setShowContextCapture(false);
    }
  };

  const handleCancel = () => {
    setNote('');
    setLinks(['', '', '', '', '']);
    setNextAction('');
    setShowLinks(false);
    setScreenshot(null);
    clearRecording();
    setShowContextCapture(false);
  };

  const handleCaptureScreenshot = async () => {
    setIsCapturingScreenshot(true);
    const screenshotData = await capturePageScreenshot();
    if (screenshotData) {
      setScreenshot(screenshotData);
    }
    setIsCapturingScreenshot(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setScreenshot(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target?.result as string;
            setScreenshot(result);
          };
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  return (
    <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">
            Capture Context
          </h2>
          <p className="text-neutral-600 mb-8">
            What were you working on?
          </p>

          <form onSubmit={handleSubmit} className="space-y-6" onPaste={handlePaste}>
            {/* Voice Recording & Screenshot Actions */}
            <div className="flex gap-3 pb-4 border-b border-neutral-200 flex-wrap">
              {/* Voice Recording Button */}
              <button
                type="button"
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={`
                  flex items-center gap-2 px-4 py-2
                  ${isRecording ? 'bg-red-500 text-white' : 'bg-neutral-100 text-neutral-700'}
                  hover:bg-neutral-200
                  transition-colors duration-150
                  font-medium text-sm
                `}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"/>
                </svg>
                {isRecording ? 'Recording...' : 'Hold to Record'}
              </button>

              {/* Upload Image Button */}
              <label className="
                flex items-center gap-2 px-4 py-2
                bg-neutral-100 text-neutral-700
                hover:bg-neutral-200
                transition-colors duration-150
                font-medium text-sm
                cursor-pointer
              ">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"/>
                </svg>
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {/* Auto-capture Button (optional) */}
              <button
                type="button"
                onClick={handleCaptureScreenshot}
                disabled={isCapturingScreenshot}
                className="
                  flex items-center gap-2 px-4 py-2
                  bg-neutral-100 text-neutral-700
                  hover:bg-neutral-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-150
                  font-medium text-sm
                "
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                </svg>
                {isCapturingScreenshot ? 'Capturing...' : 'Auto-Capture'}
              </button>
            </div>

            {/* Paste Hint */}
            <div className="text-xs text-neutral-500 -mt-4 pb-2 border-b border-neutral-100">
              💡 Tip: You can also <strong>Ctrl+V</strong> to paste an image from clipboard
            </div>

            {/* Voice Error */}
            {voiceError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {voiceError}
              </div>
            )}

            {/* Audio Preview */}
            {audioUrl && (
              <div className="bg-neutral-50 p-4 rounded">
                <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-2">
                  Voice Memo Recorded
                </p>
                <audio src={audioUrl} controls className="w-full" />
                {transcript && (
                  <p className="text-sm text-neutral-700 mt-2 italic">
                    Transcript: {transcript}
                  </p>
                )}
                <button
                  type="button"
                  onClick={clearRecording}
                  className="text-xs text-red-600 hover:text-red-700 mt-2"
                >
                  Remove recording
                </button>
              </div>
            )}

            {/* Screenshot Preview */}
            {screenshot && (
              <div className="bg-neutral-50 p-4 rounded">
                <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-2">
                  Screenshot Captured
                </p>
                <img src={screenshot} alt="Context screenshot" className="w-full max-h-48 object-contain border border-neutral-200" />
                <button
                  type="button"
                  onClick={() => setScreenshot(null)}
                  className="text-xs text-red-600 hover:text-red-700 mt-2"
                >
                  Remove screenshot
                </button>
              </div>
            )}

            {/* Main Note */}
            <div>
              <textarea
                ref={noteInputRef}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Describe your current thought or progress..."
                rows={4}
                className="
                  w-full px-4 py-3
                  bg-neutral-50 border-2 border-neutral-200
                  text-neutral-800 placeholder-neutral-400
                  focus:outline-none focus:bg-white focus:border-accent
                  transition-all duration-150
                  resize-none
                "
              />
            </div>

            {/* Toggle Links */}
            {!showLinks && (
              <button
                type="button"
                onClick={() => setShowLinks(true)}
                className="text-sm text-accent hover:text-accent/80 transition-colors duration-150"
              >
                + Add links
              </button>
            )}

            {/* Links Section */}
            {showLinks && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                  Relevant Links (Optional)
                </label>
                {links.map((link, index) => (
                  <input
                    key={index}
                    type="url"
                    value={link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    placeholder={`Link ${index + 1}`}
                    className="
                      w-full px-4 py-2
                      bg-neutral-50 border border-neutral-200
                      text-neutral-800 placeholder-neutral-400
                      focus:outline-none focus:bg-white focus:border-accent
                      transition-all duration-150
                    "
                  />
                ))}
              </div>
            )}

            {/* Next Action */}
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-2">
                Next Action (Optional)
              </label>
              <input
                type="text"
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                placeholder="What should you do when you return?"
                className="
                  w-full px-4 py-2
                  bg-neutral-50 border border-neutral-200
                  text-neutral-800 placeholder-neutral-400
                  focus:outline-none focus:bg-white focus:border-accent
                  transition-all duration-150
                "
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={!note.trim()}
                className="
                  flex-1 px-6 py-3
                  bg-accent text-white font-semibold
                  hover:bg-accent/90
                  disabled:bg-neutral-300 disabled:cursor-not-allowed
                  transition-colors duration-150
                "
              >
                Save Context
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="
                  px-6 py-3
                  bg-white text-neutral-700 font-medium
                  border border-neutral-300
                  hover:border-neutral-400
                  transition-colors duration-150
                "
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
