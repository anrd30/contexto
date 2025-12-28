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
    <div className="fixed inset-0 bg-gradient-to-b from-dark-900 to-dark-950 z-50 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-4xl mx-auto p-8 min-h-screen">
        {/* Header */}
        <div className="mb-12 animate-slideUp">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-dark-400 hover:text-white mb-8 transition-colors duration-200 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back to tasks
          </button>
          
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">
                <span className="gradient-text">{task.title}</span>
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-dark-500">
                <span className="px-3 py-1 bg-accent-purple/20 text-accent-purple rounded-full font-semibold uppercase tracking-wide">
                  {task.status}
                </span>
                <span>•</span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                  Last active {formatTimeAgo(task.lastModified)}
                </span>
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
                  <section className="animate-slideUp">
                    <h2 className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"/>
                      </svg>
                      Voice Memo
                    </h2>
                    <div className="glass-card p-5 rounded-xl border-l-4 border-l-accent-purple">
                      <audio src={latestContext.audioUrl} controls className="w-full mb-3" />
                      {latestContext.audioTranscript && (
                        <p className="text-sm text-dark-400 italic mt-4 pt-4 border-t border-white/10">
                          💬 "{latestContext.audioTranscript}"
                        </p>
                      )}
                    </div>
                  </section>
                )}

                {/* Screenshot - Compact */}
                {latestContext.screenshot && (
                  <section className="animate-slideUp" style={{animationDelay: '100ms'}}>
                    <h2 className="text-xs font-bold text-accent-blue uppercase tracking-wider mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                      </svg>
                      Visual Context
                    </h2>
                    <div className="glass-card p-4 rounded-xl border-l-4 border-l-accent-blue group cursor-pointer" onClick={() => window.open(latestContext.screenshot, '_blank')}>
                      <img 
                        src={latestContext.screenshot} 
                        alt="Context screenshot" 
                        className="w-full h-56 object-cover rounded-lg border border-white/20 group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <p className="text-xs text-dark-500 mt-3 group-hover:text-accent-blue transition-colors">🖱️ Click to view full size</p>
                    </div>
                  </section>
                )}
              </div>
            )}

            <section className="animate-slideUp" style={{animationDelay: '200ms'}}>
              <h2 className="text-xs font-bold text-accent-pink uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                </svg>
                Last Note
              </h2>
              <div className="glass-card p-6 rounded-xl border-l-4 border-l-accent-pink">
                <p className="text-white leading-relaxed whitespace-pre-wrap text-lg">
                  {latestContext.note}
                </p>
              </div>
            </section>

            {latestContext.links.length > 0 && (
              <section className="animate-slideUp" style={{animationDelay: '300ms'}}>
                <h2 className="text-xs font-bold text-accent-cyan uppercase tracking-wider mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                  </svg>
                  Relevant Links
                </h2>
                <div className="space-y-3">
                  {latestContext.links.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        block glass-card p-4 rounded-lg
                        text-accent-cyan hover:text-white
                        hover:bg-white/10 hover:scale-[1.02]
                        transition-all duration-200
                        truncate
                      "
                    >
                      🔗 {link}
                    </a>
                  ))}
                </div>
              </section>
            )}

            {latestContext.nextAction && (
              <section className="animate-slideUp" style={{animationDelay: '400ms'}}>
                <h2 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"/>
                  </svg>
                  Next Action
                </h2>
                <div className="glass-card p-6 rounded-xl border-l-4 border-l-orange-400">
                  <p className="text-white text-lg font-medium">
                    🎯 {latestContext.nextAction}
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
        <div className="flex gap-4 animate-slideUp" style={{animationDelay: '500ms'}}>
          <button
            onClick={handleResume}
            className="
              flex-1 px-8 py-5
              bg-gradient-to-r from-accent-purple to-accent-blue
              text-white font-bold text-lg
              rounded-xl
              hover:scale-105 hover:shadow-2xl hover:shadow-accent-purple/50
              active:scale-95
              transition-all duration-200
              glow-button
            "
          >
            ▶️ Resume Work
          </button>
          
          {task.status !== 'paused' && (
            <button
              onClick={handlePause}
              className="
                px-8 py-5
                glass-card rounded-xl
                text-dark-400 hover:text-white font-bold
                hover:bg-white/10 hover:scale-105
                transition-all duration-200
              "
            >
              ⏸️ Pause
            </button>
          )}
          
          {task.status !== 'completed' && (
            <button
              onClick={handleComplete}
              className="
                px-8 py-5
                glass-card rounded-xl
                text-green-400 hover:text-white font-bold
                hover:bg-green-500/20 hover:scale-105
                transition-all duration-200
              "
            >
              ✓ Complete
            </button>
          )}
        </div>

        {/* Context History */}
        {task.contexts.length > 1 && (
          <section className="mt-16 pt-12 border-t border-white/10 animate-slideUp" style={{animationDelay: '600ms'}}>
            <h2 className="text-sm font-bold text-dark-400 uppercase tracking-wider mb-6 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              Previous Context Snapshots
            </h2>
            <div className="space-y-4">
              {task.contexts.slice(0, -1).reverse().map((ctx, index) => (
                <div 
                  key={ctx.id} 
                  className="glass-card p-5 rounded-lg border-l-2 border-l-dark-600 hover:bg-white/5 transition-all duration-200"
                  style={{animationDelay: `${(index + 7) * 50}ms`}}
                >
                  <p className="text-sm text-dark-400 mb-3 leading-relaxed">{ctx.note}</p>
                  <p className="text-xs text-dark-600 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
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
