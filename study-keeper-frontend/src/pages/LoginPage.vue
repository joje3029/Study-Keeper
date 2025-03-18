<template>
  <div class="login-page">
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-12">
            <v-card-title class="text-center text-h5 py-4">
              Study Keeper
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="isFormValid">
                <v-text-field
                  v-model="formData.username"
                  label="아이디"
                  prepend-inner-icon="mdi-account"
                  :rules="[v => !!v || '아이디를 입력해주세요']"
                  required
                />

                <v-text-field
                  v-model="formData.password"
                  label="비밀번호"
                  prepend-inner-icon="mdi-lock"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  :rules="[v => !!v || '비밀번호를 입력해주세요']"
                  required
                />

                <div class="d-flex align-center justify-space-between mt-2">
                  <v-checkbox
                    v-model="formData.rememberMe"
                    label="로그인 상태 유지"
                    hide-details
                  />
                  <v-btn
                    color="primary"
                    variant="text"
                    @click="forgotPassword"
                  >
                    비밀번호 찾기
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-btn
                block
                color="primary"
                size="large"
                :loading="loading"
                :disabled="!isFormValid"
                @click="handleSubmit"
              >
                로그인
              </v-btn>
            </v-card-actions>
            <v-card-text class="text-center">
              <v-btn
                color="primary"
                variant="text"
                @click="$router.push('/signup')"
              >
                회원가입
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = ref();
const isFormValid = ref(false);
const loading = ref(false);
const showPassword = ref(false);

const formData = ref({
  username: '',
  password: '',
  rememberMe: false
});

const handleSubmit = async () => {
  if (!form.value.validate()) return;

  loading.value = true;
  try {
    // TODO: API 호출로 대체
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push('/');
  } catch (error) {
    console.error('Failed to login:', error);
  } finally {
    loading.value = false;
  }
};

const forgotPassword = () => {
  // TODO: 비밀번호 찾기 페이지로 이동
  console.log('Forgot password clicked');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style> 