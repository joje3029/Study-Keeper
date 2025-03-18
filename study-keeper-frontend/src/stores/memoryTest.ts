import { defineStore } from 'pinia';
import type { Note } from './note';

export interface MemoryTest {
  id: number;
  noteId: number;
  question: string;
  answer: string;
  createdAt: string;
  lastTestedAt: string | null;
  nextTestDate: string;
  difficulty: 'easy' | 'medium' | 'hard';
  testCount: number;
  successCount: number;
}

interface MemoryTestState {
  tests: MemoryTest[];
  loading: boolean;
  error: string | null;
}

export const useMemoryTestStore = defineStore('memoryTest', {
  state: (): MemoryTestState => ({
    tests: [],
    loading: false,
    error: null,
  }),

  getters: {
    getTestById: (state) => (id: number) => {
      return state.tests.find(test => test.id === id);
    },
    getTestsByNote: (state) => (noteId: number) => {
      return state.tests.filter(test => test.noteId === noteId);
    },
    getTestsByDifficulty: (state) => (difficulty: MemoryTest['difficulty']) => {
      return state.tests.filter(test => test.difficulty === difficulty);
    },
    getDueTests: (state) => {
      const now = new Date();
      return state.tests.filter(test => {
        const nextTest = new Date(test.nextTestDate);
        return nextTest <= now;
      });
    },
  },

  actions: {
    async fetchTests() {
      this.loading = true;
      this.error = null;
      try {
        // TODO: 실제 API 호출로 대체
        const response = await new Promise<MemoryTest[]>((resolve) => {
          setTimeout(() => {
            resolve([
              {
                id: 1,
                noteId: 1,
                question: '현재완료형은 무엇을 나타내나요?',
                answer: '과거의 행동이 현재에 영향을 미치는 것을 나타냅니다.',
                createdAt: '2024-03-18',
                lastTestedAt: '2024-03-19',
                nextTestDate: '2024-03-25',
                difficulty: 'medium',
                testCount: 3,
                successCount: 2
              },
              {
                id: 2,
                noteId: 2,
                question: '이차방정식의 근의 공식은?',
                answer: 'x = (-b ± √(b² - 4ac)) / 2a',
                createdAt: '2024-03-17',
                lastTestedAt: null,
                nextTestDate: '2024-03-20',
                difficulty: 'hard',
                testCount: 0,
                successCount: 0
              }
            ]);
          }, 1000);
        });
        this.tests = response;
      } catch (error) {
        this.error = '기억력 테스트 목록을 불러오는데 실패했습니다.';
        console.error('Failed to fetch memory tests:', error);
      } finally {
        this.loading = false;
      }
    },

    async createTest(note: Note) {
      this.loading = true;
      this.error = null;
      try {
        // TODO: 실제 API 호출로 대체
        const response = await new Promise<MemoryTest>((resolve) => {
          setTimeout(() => {
            resolve({
              id: this.tests.length + 1,
              noteId: note.id,
              question: note.title,
              answer: note.content,
              createdAt: new Date().toISOString(),
              lastTestedAt: null,
              nextTestDate: new Date().toISOString(),
              difficulty: 'medium',
              testCount: 0,
              successCount: 0
            });
          }, 1000);
        });
        this.tests.push(response);
        return response;
      } catch (error) {
        this.error = '기억력 테스트 생성에 실패했습니다.';
        console.error('Failed to create memory test:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTest(id: number, updates: Partial<MemoryTest>) {
      this.loading = true;
      this.error = null;
      try {
        // TODO: 실제 API 호출로 대체
        const response = await new Promise<MemoryTest>((resolve) => {
          setTimeout(() => {
            const test = this.tests.find(t => t.id === id);
            if (!test) throw new Error('Memory test not found');
            resolve({
              ...test,
              ...updates,
              lastTestedAt: updates.lastTestedAt || test.lastTestedAt
            });
          }, 1000);
        });
        const index = this.tests.findIndex(t => t.id === id);
        if (index !== -1) {
          this.tests[index] = response;
        }
        return response;
      } catch (error) {
        this.error = '기억력 테스트 수정에 실패했습니다.';
        console.error('Failed to update memory test:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteTest(id: number) {
      this.loading = true;
      this.error = null;
      try {
        // TODO: 실제 API 호출로 대체
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
        this.tests = this.tests.filter(t => t.id !== id);
      } catch (error) {
        this.error = '기억력 테스트 삭제에 실패했습니다.';
        console.error('Failed to delete memory test:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async submitTestResult(id: number, success: boolean) {
      const test = this.tests.find(t => t.id === id);
      if (!test) return;

      const now = new Date();
      const nextTestDate = new Date();
      
      // 성공/실패에 따른 다음 테스트 날짜 계산
      if (success) {
        // 성공 시 간격을 늘림
        const days = Math.pow(2, test.successCount);
        nextTestDate.setDate(now.getDate() + days);
      } else {
        // 실패 시 다음날 다시 테스트
        nextTestDate.setDate(now.getDate() + 1);
      }

      await this.updateTest(id, {
        lastTestedAt: now.toISOString(),
        nextTestDate: nextTestDate.toISOString(),
        testCount: test.testCount + 1,
        successCount: success ? test.successCount + 1 : 0,
        difficulty: success ? this.calculateDifficulty(test) : 'hard'
      });
    },

    calculateDifficulty(test: MemoryTest): MemoryTest['difficulty'] {
      const successRate = test.testCount > 0 ? test.successCount / test.testCount : 0;
      
      if (successRate >= 0.8) return 'easy';
      if (successRate >= 0.5) return 'medium';
      return 'hard';
    }
  },
}); 