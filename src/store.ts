import { create } from 'zustand';
import type { Task, TaskStatus, Context } from './types';
import { calendarService } from './services/calendar';

interface TaskStore {
  tasks: Task[];
  selectedTaskId: string | null;
  showContextCapture: boolean;
  
  // Actions
  addTask: (title: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  addContext: (
    taskId: string, 
    note: string, 
    links: string[], 
    nextAction?: string, 
    audioUrl?: string, 
    audioTranscript?: string,
    screenshot?: string
  ) => void;
  syncTaskWithCalendar: (taskId: string, resumeTime?: Date) => Promise<void>;
  selectTask: (taskId: string | null) => void;
  setShowContextCapture: (show: boolean) => void;
  loadTasks: () => void;
  saveTasks: () => void;
}

const STORAGE_KEY = 'task-context-restorer-tasks';

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  selectedTaskId: null,
  showContextCapture: false,

  addTask: (title: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      status: 'active',
      createdAt: new Date(),
      lastModified: new Date(),
      contexts: [],
    };
    
    set((state) => ({ tasks: [...state.tasks, newTask] }));
    get().saveTasks();
  },

  updateTaskStatus: (taskId: string, status: TaskStatus) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status, lastModified: new Date() }
          : task
      ),
    }));
    get().saveTasks();
  },

  addContext: (
    taskId: string, 
    note: string, 
    links: string[], 
    nextAction?: string,
    audioUrl?: string,
    audioTranscript?: string,
    screenshot?: string
  ) => {
    const newContext: Context = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      note,
      links: links.filter((link) => link.trim() !== ''),
      nextAction,
      audioUrl,
      audioTranscript,
      screenshot,
    };

    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              contexts: [...task.contexts, newContext],
              lastModified: new Date(),
            }
          : task
      ),
    }));
    get().saveTasks();
  },

  syncTaskWithCalendar: async (taskId: string, resumeTime?: Date) => {
    if (!calendarService.isAuthenticated()) {
      console.log('Calendar not connected, skipping sync');
      return;
    }

    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      // If pausing task and resume time is specified, create calendar event
      if (task.status === 'paused' && resumeTime) {
        const latestContext = task.contexts[task.contexts.length - 1];
        const event = await calendarService.createEvent({
          title: `Resume: ${task.title}`,
          description: latestContext?.note || 'Task context',
          startTime: resumeTime,
          durationMinutes: 30,
        });

        // Update task with calendar event ID and auto-resume time
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { 
                  ...t, 
                  calendarEventId: event.id,
                  autoResumeTime: resumeTime,
                  lastModified: new Date() 
                }
              : t
          ),
        }));
        get().saveTasks();
        console.log('Created calendar event:', event.id);
      }
      
      // If completing task, delete associated calendar event
      if (task.status === 'completed' && task.calendarEventId) {
        await calendarService.deleteEvent(task.calendarEventId);
        console.log('Deleted calendar event:', task.calendarEventId);
      }
    } catch (error) {
      console.error('Failed to sync with calendar:', error);
      // Don't fail the task operation if calendar sync fails
    }
  },

  selectTask: (taskId: string | null) => {
    set({ selectedTaskId: taskId });
  },

  setShowContextCapture: (show: boolean) => {
    set({ showContextCapture: show });
  },

  loadTasks: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const tasks = parsed.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          lastModified: new Date(task.lastModified),
          contexts: task.contexts.map((ctx: any) => ({
            ...ctx,
            timestamp: new Date(ctx.timestamp),
          })),
        }));
        set({ tasks });
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
    }
  },

  saveTasks: () => {
    try {
      const { tasks } = get();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  },
}));
