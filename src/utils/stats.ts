import type { Task } from '../types';
import { startOfDay, startOfWeek, startOfMonth, differenceInHours, differenceInMinutes } from 'date-fns';

export interface DashboardStats {
  completedToday: number;
  completedThisWeek: number;
  completedThisMonth: number;
  averageContextSwitchTime: number;
  totalContextSwitches: number;
  mostProductiveHour: number;
  interruptionCount: number;
  activeTaskDuration: number;
}

export const calculateDashboardStats = (tasks: Task[]): DashboardStats => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  // Completed tasks by time period
  const completedToday = tasks.filter(
    (t) => t.status === 'completed' && new Date(t.lastModified) >= todayStart
  ).length;

  const completedThisWeek = tasks.filter(
    (t) => t.status === 'completed' && new Date(t.lastModified) >= weekStart
  ).length;

  const completedThisMonth = tasks.filter(
    (t) => t.status === 'completed' && new Date(t.lastModified) >= monthStart
  ).length;

  // Context switch analysis
  let totalSwitchTime = 0;
  let switchCount = 0;

  tasks.forEach((task) => {
    for (let i = 1; i < task.contexts.length; i++) {
      const prevContext = task.contexts[i - 1];
      const currentContext = task.contexts[i];
      const switchTime = differenceInMinutes(
        new Date(currentContext.timestamp),
        new Date(prevContext.timestamp)
      );
      if (switchTime > 0 && switchTime < 480) { // Ignore switches > 8 hours
        totalSwitchTime += switchTime;
        switchCount++;
      }
    }
  });

  const averageContextSwitchTime = switchCount > 0 ? totalSwitchTime / switchCount : 0;

  // Interruption count (paused tasks today)
  const interruptionCount = tasks.filter(
    (t) => t.status === 'paused' && new Date(t.lastModified) >= todayStart
  ).length;

  // Most productive hour (hour with most completions this week)
  const hourlyCompletions = new Array(24).fill(0);
  tasks
    .filter((t) => t.status === 'completed' && new Date(t.lastModified) >= weekStart)
    .forEach((t) => {
      const hour = new Date(t.lastModified).getHours();
      hourlyCompletions[hour]++;
    });

  const mostProductiveHour = hourlyCompletions.indexOf(Math.max(...hourlyCompletions));

  // Active task duration (active tasks today)
  const activeTaskDuration = tasks
    .filter((t) => t.status === 'active' && new Date(t.createdAt) >= todayStart)
    .reduce((total, task) => {
      return total + differenceInHours(now, new Date(task.createdAt));
    }, 0);

  // Total context switches
  const totalContextSwitches = tasks.reduce((total, task) => total + task.contexts.length, 0);

  return {
    completedToday,
    completedThisWeek,
    completedThisMonth,
    averageContextSwitchTime,
    totalContextSwitches,
    mostProductiveHour,
    interruptionCount,
    activeTaskDuration,
  };
};

export const getTasksByHour = (tasks: Task[]): number[] => {
  const hourlyTasks = new Array(24).fill(0);
  const weekStart = startOfWeek(new Date());
  
  tasks
    .filter((t) => t.status === 'completed' && new Date(t.lastModified) >= weekStart)
    .forEach((t) => {
      const hour = new Date(t.lastModified).getHours();
      hourlyTasks[hour]++;
    });
  
  return hourlyTasks;
};

export const getWeeklyProgress = (tasks: Task[]): { day: string; completed: number }[] => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekStart = startOfWeek(new Date());
  
  return days.map((day, index) => {
    const dayStart = new Date(weekStart);
    dayStart.setDate(dayStart.getDate() + index);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    
    const completed = tasks.filter(
      (t) =>
        t.status === 'completed' &&
        new Date(t.lastModified) >= dayStart &&
        new Date(t.lastModified) < dayEnd
    ).length;
    
    return { day, completed };
  });
};
