import { useEffect } from 'react';
import { useTaskStore } from './store';
import { TaskList } from './components/TaskList';
import { ContextView } from './components/ContextView';
import { ContextCapture } from './components/ContextCapture';

function App() {
  const loadTasks = useTaskStore((state) => state.loadTasks);
  const selectedTaskId = useTaskStore((state) => state.selectedTaskId);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <>
      {selectedTaskId ? <ContextView /> : <TaskList />}
      <ContextCapture />
    </>
  );
}

export default App;
