import { useTaskStore } from '../store';
import { formatTimeAgo } from '../utils';

export const ContextView = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const selectedTaskId = useTaskStore((state) => state.selectedTaskId);
  const selectTask = useTaskStore((state) => state.selectTask);
  const setShowContextCapture = useTaskStore((state) => state.setShowContextCapture);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);

  const task = tasks.find((t) => t.id === selectedTaskId);

  if (!task) return null;

  const latestContext = task.contexts.length > 0 ? task.contexts[task.contexts.length - 1] : null;

  const handleResume = () => {
    if (task.status !== 'active') {
      updateTaskStatus(task.id, 'active');
    }
    selectTask(null);
  };

  const handlePause = () => {
    setShowContextCapture(true);
  };

  const handleComplete = () => {
    updateTaskStatus(task.id, 'completed');
    selectTask(null);
  };

  const handleBack = () => {
    selectTask(null);
  };

  return (
    <div className="fixed inset-0 bg-neutral-50 z-50 overflow-y-auto">
      <div className="w-full max-w-2xl mx-auto p-8 min-h-screen">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={handleBack}
            className="text-neutral-600 hover:text-neutral-800 mb-6 transition-colors duration-150"
          >
            ← Back to tasks
          </button>
          
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-neutral-800 mb-3">
                {task.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-neutral-600">
                <span className="uppercase tracking-wide">{task.status}</span>
                <span>•</span>
                <span>Last active {formatTimeAgo(task.lastModified)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Context Display */}
        {latestContext ? (
          <div className="space-y-6 mb-12">
            {/* Media Row: Voice + Screenshot side by side */}
            {(latestContext.audioUrl || latestContext.screenshot) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Voice Memo */}
                {latestContext.audioUrl && (
                  <section>
                    <h2 className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-3">
                      Voice Memo
                    </h2>
                    <div className="bg-white p-4 border-l-4 border-l-accent">
                      <audio src={latestContext.audioUrl} controls className="w-full mb-2" />
                      {latestContext.audioTranscript && (
                        <p className="text-sm text-neutral-700 italic mt-3">
                          "{latestContext.audioTranscript}"
                        </p>
                      )}
                    </div>
                  </section>
                )}

                {/* Screenshot - Compact */}
                {latestContext.screenshot && (
                  <section>
                    <h2 className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-3">
                      Visual Context
                    </h2>
                    <div className="bg-white p-3 border-l-4 border-l-accent">
                      <img 
                        src={latestContext.screenshot} 
                        alt="Context screenshot" 
                        className="w-full h-48 object-cover border border-neutral-200 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(latestContext.screenshot, '_blank')}
                      />
                      <p className="text-xs text-neutral-500 mt-2">Click to view full size</p>
                    </div>
                  </section>
                )}
              </div>
            )}

            <section>
              <h2 className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-3">
                Last Note
              </h2>
              <div className="bg-white p-6 border-l-4 border-l-accent">
                <p className="text-neutral-800 leading-relaxed whitespace-pre-wrap">
                  {latestContext.note}
                </p>
              </div>
            </section>

            {latestContext.links.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-3">
                  Relevant Links
                </h2>
                <div className="space-y-2">
                  {latestContext.links.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        block bg-white p-4 
                        text-accent hover:text-accent/80
                        border border-neutral-200 hover:border-accent/30
                        transition-all duration-150
                        truncate
                      "
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </section>
            )}

            {latestContext.nextAction && (
              <section>
                <h2 className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-3">
                  Next Action
                </h2>
                <div className="bg-white p-6 border-l-4 border-l-neutral-600">
                  <p className="text-neutral-800">
                    {latestContext.nextAction}
                  </p>
                </div>
              </section>
            )}

            <div className="text-xs text-neutral-500 pt-4">
              Context captured {formatTimeAgo(latestContext.timestamp)}
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 text-center mb-12">
            <p className="text-neutral-600">No context captured yet</p>
            <p className="text-sm text-neutral-500 mt-2">
              Pause this task to save your current progress
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleResume}
            className="
              flex-1 px-6 py-4
              bg-accent text-white font-semibold text-lg
              hover:bg-accent/90
              transition-colors duration-150
            "
          >
            Resume Work
          </button>
          
          {task.status !== 'paused' && (
            <button
              onClick={handlePause}
              className="
                px-6 py-4
                bg-white text-neutral-700 font-medium
                border border-neutral-300
                hover:border-neutral-400
                transition-colors duration-150
              "
            >
              Pause
            </button>
          )}
          
          {task.status !== 'completed' && (
            <button
              onClick={handleComplete}
              className="
                px-6 py-4
                bg-white text-neutral-700 font-medium
                border border-neutral-300
                hover:border-neutral-400
                transition-colors duration-150
              "
            >
              Complete
            </button>
          )}
        </div>

        {/* Context History */}
        {task.contexts.length > 1 && (
          <section className="mt-12 pt-12 border-t border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-600 uppercase tracking-wide mb-6">
              Previous Context Snapshots
            </h2>
            <div className="space-y-4">
              {task.contexts.slice(0, -1).reverse().map((ctx) => (
                <div key={ctx.id} className="bg-white p-4 border-l-2 border-l-neutral-300">
                  <p className="text-sm text-neutral-700 mb-2">{ctx.note}</p>
                  <p className="text-xs text-neutral-500">
                    {formatTimeAgo(ctx.timestamp)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
