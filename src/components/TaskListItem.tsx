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

  const statusColor = {
    active: 'border-l-orange-500',
    paused: 'border-l-red-500',
    completed: 'border-l-green-500',
  }[task.status];

  const statusBadgeColor = {
    active: 'bg-orange-100 text-orange-700',
    paused: 'bg-red-100 text-red-700',
    completed: 'bg-green-100 text-green-700',
  }[task.status];

  return (
    <div
      onClick={handleClick}
      className={`
        border-l-4 ${statusColor} 
        bg-white p-6 mb-3 
        cursor-pointer 
        transition-all duration-200
        hover:shadow-md hover:translate-x-1
        relative
      `}
    >
      {/* Media Indicators - Top Right */}
      {latestContext && (
        <div className="absolute top-6 right-6 flex gap-2">
          {latestContext.audioUrl && (
            <div className="bg-accent/10 p-1.5 rounded" title="Has voice memo">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"/>
              </svg>
            </div>
          )}
          {latestContext.screenshot && (
            <div className="bg-accent/10 p-1.5 rounded" title="Has screenshot">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Status Badge - Bottom Right */}
      <div className="absolute bottom-6 right-6">
        <span className={`text-xs uppercase tracking-wide px-2 py-1 rounded ${statusBadgeColor}`}>
          {task.status}
        </span>
      </div>

      <div className="flex items-start gap-4 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-neutral-800 pr-16 truncate">{task.title}</h3>
          <p className="text-sm text-neutral-600 mt-1">
            {task.status === 'paused' ? 'Paused' : 'Last active'} {formatTimeAgo(task.lastModified)}
          </p>
        </div>
      </div>
      
      {/* Horizontal Layout: Screenshot on left, note on right */}
      {latestContext && (
        <div className="flex gap-4 mt-3 mb-8">
          {latestContext.screenshot && (
            <div className="flex-shrink-0">
              <img 
                src={latestContext.screenshot} 
                alt="Preview" 
                className="w-32 h-24 object-cover border border-neutral-200 rounded"
              />
            </div>
          )}
          <p className="text-sm text-neutral-700 line-clamp-3 flex-1">
            {latestContext.note}
          </p>
        </div>
      )}
    </div>
  );
};
