import { defineStore } from 'pinia';
// import axios from 'axios';

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

interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
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
        const response = await axios.get('/api/profile');
        this.profile = response.data;
      } catch (error) {
        this.error = '프로필을 불러오는데 실패했습니다.';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(profileData: Partial<UserProfile>) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put('/api/profile', profileData);
        this.profile = response.data;
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
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await axios.post('/api/profile/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (this.profile) {
          this.profile.avatar = response.data.avatarUrl;
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
    },

    async updatePassword(passwordData: PasswordUpdate) {
      this.loading = true;
      try {
        await axios.put('/api/profile/password', passwordData);
      } catch (error: any) {
        // 서버에서 특정 에러 메시지를 보내는 경우 처리
        if (error.response?.data?.message) {
          this.error = error.response.data.message;
        } else if (error.response?.status === 401) {
          this.error = '현재 비밀번호가 일치하지 않습니다.';
        } else {
          this.error = '비밀번호 변경에 실패했습니다.';
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },
  }
}); 