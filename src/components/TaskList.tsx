import { useState } from 'react';
import { useTaskStore } from '../store';
import { TaskListItem } from './TaskListItem';
import { CalendarIntegration } from './CalendarIntegration';

export const TaskList = () => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  const activeTasks = tasks.filter((t) => t.status === 'active');
  const pausedTasks = tasks.filter((t) => t.status === 'paused');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div className="w-full max-w-6xl mx-auto p-8">
      <header className="mb-12">
        <div className="flex justify-between items-start mb-8">
          <div className="animate-slideUp">
            <h1 className="text-5xl font-bold mb-3">
              <span className="gradient-text">Task Context Restorer</span>
            </h1>
            <p className="text-dark-500 text-lg">
              Preserve your context. Resume without friction. ✨
            </p>
          </div>
          <div className="animate-fadeIn">
            <CalendarIntegration />
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mb-12 animate-slideUp">
        <div className="flex gap-4">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What needs to be done? 🎯"
            className="
              flex-1 px-6 py-4 text-lg
              glass-card
              text-white placeholder-dark-500
              focus:outline-none focus:ring-2 focus:ring-accent-purple/50
              transition-all duration-300
            "
          />
          <button
            type="submit"
            className="
              px-8 py-4 
              bg-gradient-to-r from-accent-purple to-accent-blue
              text-white font-semibold text-lg
              rounded-lg
              hover:scale-105 hover:shadow-lg hover:shadow-accent-purple/50
              active:scale-95
              transition-all duration-200
              glow-button
            "
          >
            Add Task
          </button>
        </div>
      </form>

      {activeTasks.length === 0 && pausedTasks.length === 0 && completedTasks.length === 0 ? (
        <div className="text-center py-24 animate-fadeIn">
          <div className="glass-card inline-block px-12 py-16 rounded-2xl">
            <div className="text-6xl mb-4 animate-float">📝</div>
            <p className="text-xl mb-2 text-dark-500 font-medium">No tasks yet</p>
            <p className="text-dark-600">Create your first task to get started</p>
          </div>
        </div>
      ) : (
        <>
          {activeTasks.length > 0 && (
            <section className="mb-10 animate-slideUp">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full"></div>
                <h2 className="text-sm font-bold text-orange-400 uppercase tracking-wider">
                  Active Tasks ({activeTasks.length})
                </h2>
              </div>
              <div className="space-y-4">
                {activeTasks.map((task, index) => (
                  <div 
                    key={task.id} 
                    className="animate-slideUp"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TaskListItem task={task} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {pausedTasks.length > 0 && (
            <section className="mb-10 animate-slideUp">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-red-400 to-red-600 rounded-full"></div>
                <h2 className="text-sm font-bold text-red-400 uppercase tracking-wider">
                  Paused Tasks ({pausedTasks.length})
                </h2>
              </div>
              <div className="space-y-4">
                {pausedTasks.map((task, index) => (
                  <div 
                    key={task.id} 
                    className="animate-slideUp"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TaskListItem task={task} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {completedTasks.length > 0 && (
            <section className="mt-16 pt-10 border-t border-white/10 animate-slideUp">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
                <h2 className="text-sm font-bold text-green-400 uppercase tracking-wider">
                  Completed ({completedTasks.length})
                </h2>
              </div>
              <div className="space-y-4">
                {completedTasks.map((task, index) => (
                  <div 
                    key={task.id} 
                    className="animate-slideUp"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TaskListItem task={task} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};
