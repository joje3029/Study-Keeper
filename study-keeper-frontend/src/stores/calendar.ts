import { defineStore } from 'pinia';

export interface StudyEvent {
  id: number;
  subjectId: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: 'study' | 'exam' | 'review' | 'memory';
  status: 'planned' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface CalendarState {
  events: StudyEvent[];
  loading: boolean;
  error: string | null;
}

export const useCalendarStore = defineStore('calendar', {
  state: (): CalendarState => ({
    events: [],
    loading: false,
    error: null,
  }),

  getters: {
    getEventById: (state) => (id: number) => {
      return state.events.find(event => event.id === id);
    },
    getEventsBySubject: (state) => (subjectId: number) => {
      return state.events.filter(event => event.subjectId === subjectId);
    },
    getEventsByDate: (state) => (date: string) => {
      return state.events.filter(event => {
        const eventDate = new Date(event.startDate).toISOString().split('T')[0];
        return eventDate === date;
      });
    },
    getEventsByType: (state) => (type: StudyEvent['type']) => {
      return state.events.filter(event => event.type === type);
    },
    getEventsByStatus: (state) => (status: StudyEvent['status']) => {
      return state.events.filter(event => event.status === status);
    },
  },

  actions: {
    async fetchEvents() {
      this.loading = true;
      this.error = null;
      try {
        // TODO: 실제 API 호출로 대체
        const response = await new Promise<StudyEvent[]>((resolve) => {
          setTimeout(() => {
            resolve([
              {
                id: 1,
                subjectId: 1,
                title: '영어 문법 복습',
                description: '현재완료형과 현재완료진행형 복습',
                startDate: '2024-03-20T10:00:00',
                endDate: '2024-03-20T11:00:00',
                type: 'review',
                status: 'planned',
                createdAt: '2024-03-18',
                updatedAt: '2024-03-18'
              },
              {
                id: 2,
                subjectId: 2,
                title: '수학 기초 학습',
                description: '이차방정식 풀이 방법 학습',
                startDate: '2024-03-20T14:00:00',
                endDate: '2024-03-20T15:30:00',
                type: 'study',
                status: 'planned',
                createdAt: '2024-03-17',
                updatedAt: '2024-03-17'
              }
            ]);
          }, 1000);
        });
        this.events = response;
      } catch (error) {
        this.error = '일정 목록을 불러오는데 실패했습니다.';
        console.error('Failed to fetch events:', error);
      } finally {
        this.loading = false;
      }
    },

    async createEvent(event: Omit<StudyEvent, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true;
      this.error = null;
      try {
        // TODO: 실제 API 호출로 대체
        const response = await new Promise<StudyEvent>((resolve) => {
          setTimeout(() => {
            resolve({
              ...event,
              id: this.events.length + 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }, 1000);
        });
        this.events.push(response);
        return response;
      } catch (error) {
        this.error = '일정 생성에 실패했습니다.';
        console.error('Failed to create event:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateEvent(id: number, updates: Partial<StudyEvent>) {
      this.loading = true;
      this.error = null;
      try {
        // TODO: 실제 API 호출로 대체
        const response = await new Promise<StudyEvent>((resolve) => {
          setTimeout(() => {
            const event = this.events.find(e => e.id === id);
            if (!event) throw new Error('Event not found');
            resolve({
              ...event,
              ...updates,
              updatedAt: new Date().toISOString()
            });
          }, 1000);
        });
        const index = this.events.findIndex(e => e.id === id);
        if (index !== -1) {
          this.events[index] = response;
        }
        return response;
      } catch (error) {
        this.error = '일정 수정에 실패했습니다.';
        console.error('Failed to update event:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteEvent(id: number) {
      this.loading = true;
      this.error = null;
      try {
        // TODO: 실제 API 호출로 대체
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
        this.events = this.events.filter(e => e.id !== id);
      } catch (error) {
        this.error = '일정 삭제에 실패했습니다.';
        console.error('Failed to delete event:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateEventStatus(id: number, status: StudyEvent['status']) {
      await this.updateEvent(id, { status });
    }
  },
}); 