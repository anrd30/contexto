import { CALENDAR_API_BASE } from '../config/google';

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
}

class GoogleCalendarService {
  private accessToken: string | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('google_access_token', token);
  }

  getAccessToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('google_access_token');
    }
    return this.accessToken;
  }

  clearAccessToken() {
    this.accessToken = null;
    localStorage.removeItem('google_access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${CALENDAR_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearAccessToken();
        throw new Error('Authentication expired. Please reconnect.');
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Calendar API request failed');
    }

    return response.json();
  }

  async createEvent(event: {
    title: string;
    description?: string;
    startTime: Date;
    durationMinutes?: number;
  }): Promise<CalendarEvent> {
    const endTime = new Date(event.startTime);
    endTime.setMinutes(endTime.getMinutes() + (event.durationMinutes || 30));

    const calendarEvent = {
      summary: event.title,
      description: event.description,
      start: {
        dateTime: event.startTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    return this.makeRequest('/calendars/primary/events', {
      method: 'POST',
      body: JSON.stringify(calendarEvent),
    });
  }

  async updateEvent(eventId: string, updates: {
    title?: string;
    description?: string;
    startTime?: Date;
    durationMinutes?: number;
  }): Promise<CalendarEvent> {
    const event: any = {
      summary: updates.title,
      description: updates.description,
    };

    if (updates.startTime) {
      const endTime = new Date(updates.startTime);
      endTime.setMinutes(endTime.getMinutes() + (updates.durationMinutes || 30));

      event.start = {
        dateTime: updates.startTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      event.end = {
        dateTime: endTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
    }

    return this.makeRequest(`/calendars/primary/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify(event),
    });
  }

  async deleteEvent(eventId: string): Promise<void> {
    await this.makeRequest(`/calendars/primary/events/${eventId}`, {
      method: 'DELETE',
    });
  }

  async getEvent(eventId: string): Promise<CalendarEvent> {
    return this.makeRequest(`/calendars/primary/events/${eventId}`);
  }

  async listUpcomingEvents(maxResults: number = 10): Promise<CalendarEvent[]> {
    const now = new Date().toISOString();
    const params = new URLSearchParams({
      timeMin: now,
      maxResults: maxResults.toString(),
      singleEvents: 'true',
      orderBy: 'startTime',
    });

    const data = await this.makeRequest(`/calendars/primary/events?${params}`);
    return data.items || [];
  }
}

export const calendarService = new GoogleCalendarService();
