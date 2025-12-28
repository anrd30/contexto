# Task Context Restorer ✨

**Preserve your context. Resume without friction.**

A modern productivity app that helps you seamlessly switch between tasks without losing your mental context. Capture voice memos, screenshots, notes, and links when you pause a task, then instantly restore everything when you're ready to resume.

## 🌟 Features

### Core Functionality
- **📝 Task Management** - Create, pause, resume, and complete tasks
- **🎙️ Voice Context** - Press and hold to record voice memos with auto-transcription
- **📸 Visual Context** - Capture screenshots via upload, paste (Ctrl+V), or auto-capture
- **📎 Link Tracking** - Save relevant URLs for each task
- **🎯 Next Actions** - Define what to do when you return to a task
- **📅 Google Calendar Sync** - Connect tasks with your calendar (OAuth 2.0)

### Dashboard Analytics
- **📊 Productivity Insights** - Tasks completed today/week/month
- **⏱️ Context Switch Metrics** - Average time between task switches
- **🔥 Hourly Heatmap** - Visualize when you're most productive
- **📈 Weekly Progress** - Bar chart showing daily completion trends
- **⚡ Most Productive Hour** - AI-powered insights from your work patterns
- **🚨 Interruption Tracking** - Monitor how often you pause tasks

### UI/UX
- **🌙 Dark Premium Theme** - Beautiful glassmorphism design with gradients
- **✨ Smooth Animations** - Slide-up, fade-in, scale, and hover effects
- **🎨 Color-Coded Status** - Orange (active), Red (paused), Green (completed)
- **💾 LocalStorage Persistence** - Your data stays on your device
- **📱 Responsive Design** - Works on desktop and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/anrd30/contexto.git
cd task-context-restorer

# Install dependencies
npm install

# Set up Google Calendar (optional)
cp .env.example .env
# Add your VITE_GOOGLE_CLIENT_ID to .env

# Start dev server
npm run dev
```

Visit `http://localhost:5173` to see your app!

## ⚙️ Configuration

### Google Calendar Integration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add authorized origins: `http://localhost:5173` and your production domain
6. Copy Client ID to `.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   ```
7. See [GOOGLE_CALENDAR_SETUP.md](GOOGLE_CALENDAR_SETUP.md) for detailed instructions

## 🏗️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **State Management**: Zustand
- **Styling**: TailwindCSS 3
- **Date Handling**: date-fns
- **Voice Recognition**: Web Speech API
- **Calendar**: Google Calendar API + OAuth 2.0
- **Screenshots**: html2canvas

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── TaskList.tsx    # Main task list view
│   ├── TaskListItem.tsx # Individual task card
│   ├── Dashboard.tsx   # Analytics dashboard
│   ├── ContextCapture.tsx # Pause modal
│   ├── ContextView.tsx # Task detail view
│   └── CalendarIntegration.tsx
├── hooks/              # Custom React hooks
│   └── useVoiceRecorder.ts
├── services/           # API services
│   └── calendar.ts     # Google Calendar service
├── utils/              # Utility functions
│   ├── stats.ts        # Dashboard calculations
│   ├── screenshot.ts   # Screenshot utilities
│   └── index.ts        # General utilities
├── types.ts            # TypeScript interfaces
├── store.ts            # Zustand state management
└── App.tsx             # Main app component
```

## 🎯 Usage

### Creating a Task
1. Type task title in the input field
2. Click "Add Task" or press Enter
3. Task appears in "Active Tasks" section

### Capturing Context
1. Click on an active task
2. Click "Pause" button
3. In the modal:
   - 🎙️ Hold the mic button to record voice notes
   - 📸 Upload/paste screenshots (Ctrl+V)
   - 📝 Write detailed notes
   - 🔗 Add relevant links
   - 🎯 Set next action
4. Click "Save Context"

### Resuming Work
1. Click on a paused task
2. Review your captured context (voice, screenshots, notes)
3. Click "Resume Work"
4. Continue where you left off!

### Viewing Analytics
1. Click "📊 Dashboard" button (top-right)
2. See your productivity metrics
3. Analyze hourly activity and weekly trends

## 🔧 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel (recommended)
vercel --prod
```

### Environment Variables for Production
Set these in your hosting platform:
- `VITE_GOOGLE_CLIENT_ID` - Your Google OAuth Client ID

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Inspired by the need to preserve context when switching between tasks
- Built with modern web technologies for optimal performance
- Dark premium theme inspired by modern SaaS applications

## 📬 Contact

Created by [@anrd30](https://github.com/anrd30)

---


