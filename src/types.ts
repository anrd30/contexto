export type TaskStatus = 'active' | 'paused' | 'completed';

export interface Context {
  id: string;
  timestamp: Date;
  note: string;
  links: string[];
  nextAction?: string;
  audioUrl?: string;  // Voice memo recording
  audioTranscript?: string;  // Transcribed text
  screenshot?: string;  // Base64 screenshot data
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: Date;
  lastModified: Date;
  contexts: Context[];
  calendarEventId?: string;  // Linked calendar event
  autoResumeTime?: Date;  // Auto-resume after meeting
}
