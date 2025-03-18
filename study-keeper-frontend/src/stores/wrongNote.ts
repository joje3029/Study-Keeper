import { defineStore } from 'pinia';
import type { Subject } from './subject';

export interface WrongNote {
  id: number;
  subjectId: number;
  question: string;
  answer: string;
  explanation?: string;
  wrongCount: number;
  lastWrongDate: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  memo?: string;
}

interface WrongNoteState {
  wrongNotes: WrongNote[];
  loading: boolean;
  error: string | null;
}

export const useWrongNoteStore = defineStore('wrongNote', {
  state: (): WrongNoteState => ({
    wrongNotes: [],
    loading: false,
    error: null,
  }),

  getters: {
    getWrongNoteById: (state) => (id: number) => {
      return state.wrongNotes.find(note => note.id === id);
    },
    getWrongNotesBySubject: (state) => (subjectId: number) => {
      return state.wrongNotes.filter(note => note.subjectId === subjectId);
    },
    getWrongNotesByTag: (state) => (tag: string) => {
      return state.wrongNotes.filter(note => note.tags.includes(tag));
    },
  },

  actions: {
    async fetchWrongNotes() {
      this.loading = true;
      this.error = null;
      try {
        // TODO: 실제 API 호출로 대체
        const response = await new Promise<WrongNote[]>((resolve) => {
          setTimeout(() => {
            resolve([
              {
                id: 1,
                subjectId: 1,
                question: '현재완료형과 현재완료진행형의 차이점은?',
                answer: '현재완료형은 과거의 행동이 현재에 영향을 미치는 것을 나타내고, 현재완료진행형은 과거부터 현재까지 계속되고 있는 행동을 나타냅니다.',
                explanation: '현재완료형: I have finished my homework. (과제를 끝냈고, 그 결과가 현재에 영향을 미침)\n현재완료진행형: I have been studying for 2 hours. (2시간 동안 계속 공부하고 있음)',
                wrongCount: 3,
                lastWrongDate: '2024-03-18',
                createdAt: '2024-03-18',
                updatedAt: '2024-03-18',
                tags: ['문법', '시제'],
                memo: '시제 차이점을 더 자세히 이해할 필요가 있음'
              },
              {
                id: 2,
                subjectId: 2,
                question: '이차방정식의 근의 공식은?',
                answer: 'x = (-b ± √(b² - 4ac)) / 2a',
                explanation: '이차방정식 ax² + bx + c = 0의 해를 구하는 공식입니다.',
                wrongCount: 2,
                lastWrongDate: '2024-03-17',
                createdAt: '2024-03-17',
                updatedAt: '2024-03-17',
                tags: ['수학', '공식'],
                memo: '부호 주의'
              }
            ]);
          }, 1000);
        });
        this.wrongNotes = response;
      } catch (error) {
        this.error = '오답노트 목록을 불러오는데 실패했습니다.';
        console.error('Failed to fetch wrong notes:', error);
      } finally {
        this.loading = false;
      }
    },

    async createWrongNote(wrongNote: Omit<WrongNote, 'id' | 'createdAt' | 'updatedAt' | 'wrongCount' | 'lastWrongDate'>) {
      this.loading = true;
      this.error = null;
      try {
        // TODO: 실제 API 호출로 대체
        const response = await new Promise<WrongNote>((resolve) => {
          setTimeout(() => {
            resolve({
              ...wrongNote,
              id: this.wrongNotes.length + 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              wrongCount: 0,
              lastWrongDate: new Date().toISOString()
            });
          }, 1000);
        });
        this.wrongNotes.push(response);
        return response;
      } catch (error) {
        this.error = '오답노트 생성에 실패했습니다.';
        console.error('Failed to create wrong note:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateWrongNote(id: number, updates: Partial<WrongNote>) {
      this.loading = true;
      this.error = null;
      try {
        // TODO: 실제 API 호출로 대체
        const response = await new Promise<WrongNote>((resolve) => {
          setTimeout(() => {
            const note = this.wrongNotes.find(n => n.id === id);
            if (!note) throw new Error('Wrong note not found');
            resolve({
              ...note,
              ...updates,
              updatedAt: new Date().toISOString()
            });
          }, 1000);
        });
        const index = this.wrongNotes.findIndex(n => n.id === id);
        if (index !== -1) {
          this.wrongNotes[index] = response;
        }
        return response;
      } catch (error) {
        this.error = '오답노트 수정에 실패했습니다.';
        console.error('Failed to update wrong note:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteWrongNote(id: number) {
      this.loading = true;
      this.error = null;
      try {
        // TODO: 실제 API 호출로 대체
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
        this.wrongNotes = this.wrongNotes.filter(n => n.id !== id);
      } catch (error) {
        this.error = '오답노트 삭제에 실패했습니다.';
        console.error('Failed to delete wrong note:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async incrementWrongCount(id: number) {
      const note = this.wrongNotes.find(n => n.id === id);
      if (note) {
        await this.updateWrongNote(id, {
          wrongCount: note.wrongCount + 1,
          lastWrongDate: new Date().toISOString()
        });
      }
    }
  },
}); 