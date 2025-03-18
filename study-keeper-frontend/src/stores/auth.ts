import { defineStore } from 'pinia';

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated,
  },

  actions: {
    async login(email: string, password: string) {
      try {
        // TODO: 실제 로그인 API 호출
        const response = await new Promise<{ user: User; token: string }>((resolve) => {
          setTimeout(() => {
            resolve({
              user: {
                id: 1,
                email,
                name: '테스트 사용자',
              },
              token: 'dummy-token',
            });
          }, 1000);
        });

        this.user = response.user;
        this.token = response.token;
        this.isAuthenticated = true;
        localStorage.setItem('token', response.token);

        return true;
      } catch (error) {
        console.error('Login failed:', error);
        return false;
      }
    },

    async logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
    },

    async checkAuth() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // TODO: 실제 토큰 검증 API 호출
          const response = await new Promise<{ user: User }>((resolve) => {
            setTimeout(() => {
              resolve({
                user: {
                  id: 1,
                  email: 'test@example.com',
                  name: '테스트 사용자',
                },
              });
            }, 1000);
          });

          this.user = response.user;
          this.token = token;
          this.isAuthenticated = true;
        } catch (error) {
          console.error('Auth check failed:', error);
          this.logout();
        }
      }
    },
  },
}); 