import { useTaskStore } from '../store';
import { calculateDashboardStats, getTasksByHour, getWeeklyProgress } from '../utils/stats';

export const Dashboard = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const stats = calculateDashboardStats(tasks);
  const hourlyTasks = getTasksByHour(tasks);
  const weeklyProgress = getWeeklyProgress(tasks);

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-white mb-3">
          📊 Dashboard
        </h1>
        <p className="text-dark-500 text-lg">
          Your productivity insights at a glance
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Completed Today */}
        <div className="glass-card p-6 rounded-xl border-l-4 border-l-green-500 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.completedToday}</p>
          <p className="text-sm text-dark-500 font-medium">Completed Today</p>
        </div>

        {/* Completed This Week */}
        <div className="glass-card p-6 rounded-xl border-l-4 border-l-blue-500 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.completedThisWeek}</p>
          <p className="text-sm text-dark-500 font-medium">Completed This Week</p>
        </div>

        {/* Completed This Month */}
        <div className="glass-card p-6 rounded-xl border-l-4 border-l-purple-500 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.completedThisMonth}</p>
          <p className="text-sm text-dark-500 font-medium">Completed This Month</p>
        </div>

        {/* Average Context Switch */}
        <div className="glass-card p-6 rounded-xl border-l-4 border-l-orange-500 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {stats.averageContextSwitchTime > 0 ? Math.round(stats.averageContextSwitchTime) : 0}
            <span className="text-lg text-dark-500 ml-1">min</span>
          </p>
          <p className="text-sm text-dark-500 font-medium">Avg. Context Switch</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Most Productive Hour */}
        <div className="glass-card p-6 rounded-xl hover:bg-white/10 transition-all duration-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-accent-purple/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-accent-purple" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{formatHour(stats.mostProductiveHour)}</p>
              <p className="text-sm text-dark-500 font-medium">Most Productive Hour</p>
            </div>
          </div>
        </div>

        {/* Interruption Count */}
        <div className="glass-card p-6 rounded-xl hover:bg-white/10 transition-all duration-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.interruptionCount}</p>
              <p className="text-sm text-dark-500 font-medium">Interruptions Today</p>
            </div>
          </div>
        </div>

        {/* Total Context Switches */}
        <div className="glass-card p-6 rounded-xl hover:bg-white/10 transition-all duration-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-accent-cyan/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-accent-cyan" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"/>
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalContextSwitches}</p>
              <p className="text-sm text-dark-500 font-medium">Total Context Switches</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-6">Weekly Progress</h3>
          <div className="space-y-4">
            {weeklyProgress.map((day) => {
              const maxCompleted = Math.max(...weeklyProgress.map((d) => d.completed), 1);
              const percentage = (day.completed / maxCompleted) * 100;
              
              return (
                <div key={day.day}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-dark-400">{day.day}</span>
                    <span className="text-sm font-bold text-white">{day.completed}</span>
                  </div>
                  <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-purple to-accent-blue rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hourly Activity Heatmap */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-6">Hourly Activity (This Week)</h3>
          <div className="grid grid-cols-6 gap-2">
            {hourlyTasks.map((count, hour) => {
              const maxCount = Math.max(...hourlyTasks, 1);
              const intensity = count / maxCount;
              const bgColor =
                intensity === 0
                  ? 'bg-dark-800'
                  : intensity < 0.33
                  ? 'bg-accent-purple/30'
                  : intensity < 0.66
                  ? 'bg-accent-purple/60'
                  : 'bg-accent-purple';

              return (
                <div
                  key={hour}
                  className={`${bgColor} rounded p-2 text-center hover:scale-110 transition-transform cursor-pointer group relative`}
                  title={`${formatHour(hour)}: ${count} tasks`}
                >
                  <span className="text-xs font-medium text-white">{hour}</span>
                  {count > 0 && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-900 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {count} tasks
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center mt-6 text-xs text-dark-500">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 bg-dark-800 rounded"></div>
              <div className="w-4 h-4 bg-accent-purple/30 rounded"></div>
              <div className="w-4 h-4 bg-accent-purple/60 rounded"></div>
              <div className="w-4 h-4 bg-accent-purple rounded"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};
