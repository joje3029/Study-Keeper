<template>
  <v-form @submit.prevent="handleSubmit">
    <v-card class="pa-4">
      <v-card-title class="text-center text-h5 mb-4">
        로그인
      </v-card-title>

      <v-card-text>
        <BaseInput
          v-model="email"
          label="이메일"
          type="email"
          :rules="emailRules"
          required
        />

        <BaseInput
          v-model="password"
          label="비밀번호"
          type="password"
          :rules="passwordRules"
          required
        />
      </v-card-text>

      <v-card-actions class="d-flex flex-column">
        <BaseButton
          type="submit"
          color="primary"
          block
          :loading="loading"
          @click="handleSubmit"
        >
          로그인
        </BaseButton>

        <div class="d-flex justify-space-between mt-4 w-100">
          <v-btn variant="text" @click="$emit('forgot-password')">
            비밀번호 찾기
          </v-btn>
          <v-btn variant="text" @click="$emit('register')">
            회원가입
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseInput from '../atoms/BaseInput.vue';
import BaseButton from '../atoms/BaseButton.vue';

const email = ref('');
const password = ref('');
const loading = ref(false);

const emailRules = [
  (v: string) => !!v || '이메일을 입력해주세요',
  (v: string) => /.+@.+\..+/.test(v) || '올바른 이메일 형식이 아닙니다',
];

const passwordRules = [
  (v: string) => !!v || '비밀번호를 입력해주세요',
  (v: string) => v.length >= 6 || '비밀번호는 6자 이상이어야 합니다',
];

const handleSubmit = async () => {
  loading.value = true;
  try {
    // TODO: 실제 로그인 로직 구현
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Login attempt:', { email: email.value, password: password.value });
  } finally {
    loading.value = false;
  }
};

defineEmits<{
  (e: 'forgot-password'): void;
  (e: 'register'): void;
}>();
</script> 