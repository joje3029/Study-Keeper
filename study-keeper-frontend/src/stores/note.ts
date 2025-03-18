import { defineStore } from 'pinia';
import type { Subject } from './subject';

export interface Note {
  id: number;
  subjectId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isFavorite: boolean;
}

interface NoteState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

export const useNoteStore = defineStore('note', {
  state: (): NoteState => ({
    notes: [],
    loading: false,
    error: null,
  }),

  getters: {
    getNoteById: (state) => (id: number) => {
      return state.notes.find(note => note.id === id);
    },
    getNotesBySubject: (state) => (subjectId: number) => {
      return state.notes.filter(note => note.subjectId === subjectId);
    },
    getNotesByTag: (state) => (tag: string) => {
      return state.notes.filter(note => note.tags.includes(tag));
    },
    getFavoriteNotes: (state) => {
      return state.notes.filter(note => note.isFavorite);
    },
  },

  actions: {
    async fetchNotes() {
      this.loading = true;
      this.error = null;
      try {
        // TODO: 실제 API 호출로 대체
        const response = await new Promise<Note[]>((resolve) => {
          setTimeout(() => {
            resolve([
              {
                id: 1,
                subjectId: 1,
                title: '현재완료형 정리',
                content: '현재완료형은 과거의 행동이 현재에 영향을 미치는 것을 나타냅니다.\n\n예시:\n- I have finished my homework.\n- She has lived in Seoul for 5 years.',
                createdAt: '2024-03-18',
                updatedAt: '2024-03-18',
                tags: ['문법', '시제'],
                isFavorite: true
              },
              {
                id: 2,
                subjectId: 2,
                title: '이차방정식 풀이 방법',
                content: '1. 인수분해\n2. 완전제곱식 만들기\n3. 근의 공식 사용\n\n각 방법의 장단점:\n- 인수분해: 가장 간단하지만 항상 가능하지는 않음\n- 완전제곱식: 중간 과정이 복잡할 수 있음\n- 근의 공식: 모든 이차방정식에 적용 가능',
                createdAt: '2024-03-17',
                updatedAt: '2024-03-17',
                tags: ['수학', '공식'],
                isFavorite: false
              }
            ]);
          }, 1000);
        });
        this.notes = response;
      } catch (error) {
        this.error = '노트 목록을 불러오는데 실패했습니다.';
        console.error('Failed to fetch notes:', error);
      } finally {
        this.loading = false;
      }
    },

    async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true;
      this.error = null;
      try {
        // TODO: 실제 API 호출로 대체
        const response = await new Promise<Note>((resolve) => {
          setTimeout(() => {
            resolve({
              ...note,
              id: this.notes.length + 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }, 1000);
        });
        this.notes.push(response);
        return response;
      } catch (error) {
        this.error = '노트 생성에 실패했습니다.';
        console.error('Failed to create note:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateNote(id: number, updates: Partial<Note>) {
      this.loading = true;
      this.error = null;
      try {
        // TODO: 실제 API 호출로 대체
        const response = await new Promise<Note>((resolve) => {
          setTimeout(() => {
            const note = this.notes.find(n => n.id === id);
            if (!note) throw new Error('Note not found');
            resolve({
              ...note,
              ...updates,
              updatedAt: new Date().toISOString()
            });
          }, 1000);
        });
        const index = this.notes.findIndex(n => n.id === id);
        if (index !== -1) {
          this.notes[index] = response;
        }
        return response;
      } catch (error) {
        this.error = '노트 수정에 실패했습니다.';
        console.error('Failed to update note:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteNote(id: number) {
      this.loading = true;
      this.error = null;
      try {
        // TODO: 실제 API 호출로 대체
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
        this.notes = this.notes.filter(n => n.id !== id);
      } catch (error) {
        this.error = '노트 삭제에 실패했습니다.';
        console.error('Failed to delete note:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async toggleFavorite(id: number) {
      const note = this.notes.find(n => n.id === id);
      if (note) {
        await this.updateNote(id, {
          isFavorite: !note.isFavorite
        });
      }
    }
  },
}); 