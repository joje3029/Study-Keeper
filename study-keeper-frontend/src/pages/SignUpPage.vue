<template>
  <div class="signup-page">
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-12">
            <v-card-title class="text-center text-h5 py-4">
              Study Keeper 회원가입
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="isFormValid">
                <v-text-field
                  v-model="formData.username"
                  label="아이디"
                  prepend-inner-icon="mdi-account"
                  :rules="[
                    v => !!v || '아이디를 입력해주세요',
                    v => /^[a-zA-Z0-9_]{4,20}$/.test(v) || '아이디는 4-20자의 영문, 숫자, 언더스코어만 사용 가능합니다'
                  ]"
                  required
                />

                <v-text-field
                  v-model="formData.email"
                  label="이메일"
                  prepend-inner-icon="mdi-email"
                  :rules="[
                    v => !!v || '이메일을 입력해주세요',
                    v => /.+@.+\..+/.test(v) || '올바른 이메일 형식이 아닙니다'
                  ]"
                  required
                />

                <v-text-field
                  v-model="formData.password"
                  label="비밀번호"
                  prepend-inner-icon="mdi-lock"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  :rules="[
                    v => !!v || '비밀번호를 입력해주세요',
                    v => v.length >= 8 || '비밀번호는 8자 이상이어야 합니다',
                    v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v) || 
                      '비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다'
                  ]"
                  required
                />

                <v-text-field
                  v-model="formData.confirmPassword"
                  label="비밀번호 확인"
                  prepend-inner-icon="mdi-lock-check"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="[
                    v => !!v || '비밀번호를 다시 입력해주세요',
                    v => v === formData.password || '비밀번호가 일치하지 않습니다'
                  ]"
                  required
                />

                <v-text-field
                  v-model="formData.name"
                  label="이름"
                  prepend-inner-icon="mdi-account-circle"
                  :rules="[v => !!v || '이름을 입력해주세요']"
                  required
                />

                <v-textarea
                  v-model="formData.bio"
                  label="자기소개"
                  prepend-inner-icon="mdi-text-box"
                  rows="3"
                  auto-grow
                />
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
                회원가입
              </v-btn>
            </v-card-actions>
            <v-card-text class="text-center">
              <v-btn
                color="primary"
                variant="text"
                @click="$router.push('/login')"
              >
                이미 계정이 있으신가요? 로그인
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
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  bio: ''
});

const handleSubmit = async () => {
  if (!form.value.validate()) return;

  loading.value = true;
  try {
    // TODO: API 호출로 대체
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push('/login');
  } catch (error) {
    console.error('Failed to sign up:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.signup-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style> 