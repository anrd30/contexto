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
    <div className="w-full max-w-3xl mx-auto p-8">
      <header className="mb-12">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold text-neutral-800 mb-2">
              Task Context Restorer
            </h1>
            <p className="text-neutral-600">
              Preserve your context. Resume without friction.
            </p>
          </div>
          <CalendarIntegration />
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="New task title..."
            className="
              flex-1 px-4 py-3 
              bg-white border border-neutral-300
              text-neutral-800 placeholder-neutral-400
              focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
              transition-all duration-150
            "
          />
          <button
            type="submit"
            className="
              px-6 py-3 
              bg-accent text-white font-medium
              hover:bg-accent/90
              transition-colors duration-150
            "
          >
            Add Task
          </button>
        </div>
      </form>

      {activeTasks.length === 0 && pausedTasks.length === 0 && completedTasks.length === 0 ? (
        <div className="text-center py-16 text-neutral-500">
          <p className="text-lg mb-2">No tasks yet</p>
          <p className="text-sm">Create a task to get started</p>
        </div>
      ) : (
        <>
          {activeTasks.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-neutral-600 uppercase tracking-wide mb-4">
                Active Tasks
              </h2>
              {activeTasks.map((task) => (
                <TaskListItem key={task.id} task={task} />
              ))}
            </section>
          )}

          {pausedTasks.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-neutral-600 uppercase tracking-wide mb-4">
                Paused Tasks
              </h2>
              {pausedTasks.map((task) => (
                <TaskListItem key={task.id} task={task} />
              ))}
            </section>
          )}

          {completedTasks.length > 0 && (
            <section className="mt-12 pt-8 border-t-2 border-neutral-200">
              <h2 className="text-sm font-semibold text-neutral-600 uppercase tracking-wide mb-4">
                Completed
              </h2>
              {completedTasks.map((task) => (
                <TaskListItem key={task.id} task={task} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
};
