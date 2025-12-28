import type { Task } from '../types';
import { useTaskStore } from '../store';
import { formatTimeAgo, getLatestContext } from '../utils';

interface TaskListItemProps {
  task: Task;
}

export const TaskListItem = ({ task }: TaskListItemProps) => {
  const selectTask = useTaskStore((state) => state.selectTask);
  const latestContext = getLatestContext(task.contexts);

  const handleClick = () => {
    selectTask(task.id);
  };

  const statusGradient = {
    active: 'from-orange-500/20 to-orange-600/20 border-orange-500/50',
    paused: 'from-red-500/20 to-red-600/20 border-red-500/50',
    completed: 'from-green-500/20 to-green-600/20 border-green-500/50',
  }[task.status];

  const statusBadgeStyle = {
    active: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    paused: 'bg-red-500/20 text-red-400 border-red-500/50',
    completed: 'bg-green-500/20 text-green-400 border-green-500/50',
  }[task.status];

  const glowColor = {
    active: 'hover:shadow-orange-500/20',
    paused: 'hover:shadow-red-500/20',
    completed: 'hover:shadow-green-500/20',
  }[task.status];

  return (
    <div
      onClick={handleClick}
      className={`
        glass-card-hover
        bg-gradient-to-br ${statusGradient}
        p-6 rounded-xl
        cursor-pointer 
        transition-all duration-300
        hover:scale-[1.02] ${glowColor} hover:shadow-2xl
        relative overflow-hidden
        group
      `}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/0 via-accent-blue/5 to-accent-pink/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Media Indicators - Top Right */}
      {latestContext && (
        <div className="absolute top-6 right-6 flex gap-2 z-10">
          {latestContext.audioUrl && (
            <div className="glass-card p-2 rounded-lg backdrop-blur-sm hover:scale-110 transition-transform" title="Has voice memo">
              <svg className="w-4 h-4 text-accent-purple" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"/>
              </svg>
            </div>
          )}
          {latestContext.screenshot && (
            <div className="glass-card p-2 rounded-lg backdrop-blur-sm hover:scale-110 transition-transform" title="Has screenshot">
              <svg className="w-4 h-4 text-accent-blue" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Status Badge - Bottom Right */}
      <div className="absolute bottom-6 right-6 z-10">
        <span className={`
          text-xs font-bold uppercase tracking-wider 
          px-3 py-1.5 rounded-full 
          border ${statusBadgeStyle}
          backdrop-blur-sm
        `}>
          {task.status}
        </span>
      </div>

      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white pr-20 truncate group-hover:text-accent-purple transition-colors">
              {task.title}
            </h3>
            <p className="text-sm text-dark-500 mt-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              {task.status === 'paused' ? 'Paused' : 'Last active'} {formatTimeAgo(task.lastModified)}
            </p>
          </div>
        </div>
        
        {/* Horizontal Layout: Screenshot on left, note on right */}
        {latestContext && (
          <div className="flex gap-4 mt-4 mb-10">
            {latestContext.screenshot && (
              <div className="flex-shrink-0">
                <img 
                  src={latestContext.screenshot} 
                  alt="Preview" 
                  className="w-32 h-24 object-cover rounded-lg border border-white/20 shadow-lg"
                />
              </div>
            )}
            <p className="text-sm text-dark-400 line-clamp-3 flex-1">
              {latestContext.note}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
