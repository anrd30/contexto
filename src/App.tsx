import { useEffect, useState } from 'react';
import { useTaskStore } from './store';
import { TaskList } from './components/TaskList';
import { ContextView } from './components/ContextView';
import { ContextCapture } from './components/ContextCapture';
import { Dashboard } from './components/Dashboard';

type View = 'tasks' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<View>('tasks');
  const loadTasks = useTaskStore((state) => state.loadTasks);
  const selectedTaskId = useTaskStore((state) => state.selectedTaskId);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Show context view if a task is selected
  if (selectedTaskId) {
    return (
      <>
        <ContextView />
        <ContextCapture />
      </>
    );
  }

  return (
    <>
      {/* Navigation */}
      <div className="fixed top-6 right-6 z-40 flex gap-3">
        <button
          onClick={() => setCurrentView('tasks')}
          className={`
            px-6 py-3 rounded-lg font-semibold transition-all duration-200
            ${
              currentView === 'tasks'
                ? 'bg-gradient-to-r from-accent-purple to-accent-blue text-white shadow-lg'
                : 'glass-card text-dark-400 hover:text-white hover:bg-white/10'
            }
          `}
        >
          📋 Tasks
        </button>
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`
            px-6 py-3 rounded-lg font-semibold transition-all duration-200
            ${
              currentView === 'dashboard'
                ? 'bg-gradient-to-r from-accent-purple to-accent-blue text-white shadow-lg'
                : 'glass-card text-dark-400 hover:text-white hover:bg-white/10'
            }
          `}
        >
          📊 Dashboard
        </button>
      </div>

      {/* Main Content */}
      {currentView === 'tasks' ? <TaskList /> : <Dashboard />}
      <ContextCapture />
    </>
  );
}

export default App;
