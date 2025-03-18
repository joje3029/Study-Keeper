import { defineStore } from 'pinia';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  settings: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      studyReminder: boolean;
      testReminder: boolean;
    };
  };
}

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    profile: null,
    loading: false,
    error: null
  }),

  getters: {
    isProfileLoaded: (state) => !!state.profile
  },

  actions: {
    async fetchProfile() {
      this.loading = true;
      this.error = null;
      try {
        // TODO: API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.profile = {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          name: '테스트 사용자',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          settings: {
            theme: 'system',
            language: 'ko',
            timezone: 'Asia/Seoul',
            notifications: {
              email: true,
              push: true,
              studyReminder: true,
              testReminder: true
            }
          }
        };
      } catch (error) {
        this.error = '프로필을 불러오는데 실패했습니다.';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(data: Partial<UserProfile>) {
      this.loading = true;
      this.error = null;
      try {
        // TODO: API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (this.profile) {
          this.profile = {
            ...this.profile,
            ...data,
            updatedAt: new Date().toISOString()
          };
        }
      } catch (error) {
        this.error = '프로필 업데이트에 실패했습니다.';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateSettings(data: Partial<UserProfile['settings']>) {
      this.loading = true;
      this.error = null;
      try {
        // TODO: API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (this.profile) {
          this.profile.settings = {
            ...this.profile.settings,
            ...data
          };
          this.profile.updatedAt = new Date().toISOString();
        }
      } catch (error) {
        this.error = '설정 업데이트에 실패했습니다.';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async uploadAvatar(file: File) {
      this.loading = true;
      this.error = null;
      try {
        // TODO: API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (this.profile) {
          this.profile.avatar = URL.createObjectURL(file);
          this.profile.updatedAt = new Date().toISOString();
        }
      } catch (error) {
        this.error = '프로필 이미지 업로드에 실패했습니다.';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteAccount() {
      this.loading = true;
      this.error = null;
      try {
        // TODO: API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.profile = null;
      } catch (error) {
        this.error = '계정 삭제에 실패했습니다.';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
}); 