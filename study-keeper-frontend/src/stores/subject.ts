import { defineStore } from 'pinia';

export interface Subject {
  id: number;
  name: string;
  description?: string;
  icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  progress: number;
  totalStudyTime: number;
}

interface SubjectState {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
}

export const useSubjectStore = defineStore('subject', {
  state: (): SubjectState => ({
    subjects: [],
    loading: false,
    error: null,
  }),

  getters: {
    getSubjectById: (state) => (id: number) => {
      return state.subjects.find(subject => subject.id === id);
    },
    getSubjectsByProgress: (state) => {
      return [...state.subjects].sort((a, b) => b.progress - a.progress);
    },
  },

  actions: {
    async fetchSubjects() {
      this.loading = true;
      this.error = null;
      try {
        // TODO: 실제 API 호출로 대체
        const response = await new Promise<Subject[]>((resolve) => {
          setTimeout(() => {
            resolve([
              {
                id: 1,
                name: '영어 문법',
                description: '영어 문법 학습',
                icon: 'mdi-book-open-variant',
                color: '#FF9800',
                createdAt: '2024-03-18',
                updatedAt: '2024-03-18',
                progress: 75,
                totalStudyTime: 120
              },
              {
                id: 2,
                name: '수학 기초',
                description: '수학 기초 학습',
                icon: 'mdi-calculator',
                color: '#2196F3',
                createdAt: '2024-03-17',
                updatedAt: '2024-03-17',
                progress: 90,
                totalStudyTime: 180
              }
            ]);
          }, 1000);
        });
        this.subjects = response;
      } catch (error) {
        this.error = '분야 목록을 불러오는데 실패했습니다.';
        console.error('Failed to fetch subjects:', error);
      } finally {
        this.loading = false;
      }
    },

    async createSubject(subject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'totalStudyTime'>) {
      this.loading = true;
      this.error = null;
      try {
        // TODO: 실제 API 호출로 대체
        const response = await new Promise<Subject>((resolve) => {
          setTimeout(() => {
            resolve({
              ...subject,
              id: this.subjects.length + 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              progress: 0,
              totalStudyTime: 0
            });
          }, 1000);
        });
        this.subjects.push(response);
        return response;
      } catch (error) {
        this.error = '분야 생성에 실패했습니다.';
        console.error('Failed to create subject:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateSubject(id: number, updates: Partial<Subject>) {
      this.loading = true;
      this.error = null;
      try {
        // TODO: 실제 API 호출로 대체
        const response = await new Promise<Subject>((resolve) => {
          setTimeout(() => {
            const subject = this.subjects.find(s => s.id === id);
            if (!subject) throw new Error('Subject not found');
            resolve({
              ...subject,
              ...updates,
              updatedAt: new Date().toISOString()
            });
          }, 1000);
        });
        const index = this.subjects.findIndex(s => s.id === id);
        if (index !== -1) {
          this.subjects[index] = response;
        }
        return response;
      } catch (error) {
        this.error = '분야 수정에 실패했습니다.';
        console.error('Failed to update subject:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteSubject(id: number) {
      this.loading = true;
      this.error = null;
      try {
        // TODO: 실제 API 호출로 대체
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
        this.subjects = this.subjects.filter(s => s.id !== id);
      } catch (error) {
        this.error = '분야 삭제에 실패했습니다.';
        console.error('Failed to delete subject:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addSubject(subject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'totalStudyTime'>) {
      try {
        await this.createSubject(subject);
      } catch (error) {
        this.error = 'Failed to add subject';
        console.error(error);
      }
    },
  },
}); 