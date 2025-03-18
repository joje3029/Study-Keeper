<template>
  <div class="settings-page">
    <div class="header">
      <h1>설정</h1>
    </div>

    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>일반 설정</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="isFormValid">
              <v-select
                v-model="formData.theme"
                :items="themeOptions"
                label="테마"
                required
              />

              <v-select
                v-model="formData.language"
                :items="languageOptions"
                label="언어"
                required
              />

              <v-select
                v-model="formData.timezone"
                :items="timezoneOptions"
                label="시간대"
                required
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              :loading="loading"
              :disabled="!isFormValid"
              @click="handleSubmit"
            >
              저장
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>알림 설정</v-card-title>
          <v-card-text>
            <v-switch
              v-model="formData.notifications.email"
              label="이메일 알림"
            />

            <v-switch
              v-model="formData.notifications.push"
              label="푸시 알림"
            />

            <v-switch
              v-model="formData.notifications.studyReminder"
              label="학습 리마인더"
            />

            <v-switch
              v-model="formData.notifications.testReminder"
              label="테스트 리마인더"
            />
          </v-card-text>
        </v-card>

        <v-card class="mt-4">
          <v-card-title>계정 관리</v-card-title>
          <v-card-text>
            <v-btn
              color="error"
              variant="outlined"
              @click="showDeleteDialog = true"
            >
              계정 삭제
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 계정 삭제 확인 다이얼로그 -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title>계정 삭제</v-card-title>
        <v-card-text>
          <p>정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
          <v-text-field
            v-model="deleteConfirmation"
            label="'DELETE'를 입력하여 확인"
            :rules="[v => v === 'DELETE' || '정확히 DELETE를 입력해주세요']"
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="showDeleteDialog = false"
          >
            취소
          </v-btn>
          <v-btn
            color="error"
            :loading="loading"
            :disabled="deleteConfirmation !== 'DELETE'"
            @click="handleDeleteAccount"
          >
            삭제
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProfileStore } from '@/stores/profile';
import { useRouter } from 'vue-router';
import type { UserProfile } from '@/stores/profile';

const router = useRouter();
const profileStore = useProfileStore();

const isFormValid = ref(false);
const loading = ref(false);
const form = ref();
const showDeleteDialog = ref(false);
const deleteConfirmation = ref('');

const themeOptions = [
  { title: '라이트', value: 'light' as const },
  { title: '다크', value: 'dark' as const },
  { title: '시스템', value: 'system' as const }
];

const languageOptions = [
  { title: '한국어', value: 'ko' },
  { title: 'English', value: 'en' }
];

const timezoneOptions = [
  { title: '서울 (UTC+9)', value: 'Asia/Seoul' },
  { title: '도쿄 (UTC+9)', value: 'Asia/Tokyo' },
  { title: '뉴욕 (UTC-5)', value: 'America/New_York' }
];

const formData = ref<Partial<UserProfile['settings']>>({
  theme: 'system',
  language: 'ko',
  timezone: 'Asia/Seoul',
  notifications: {
    email: true,
    push: true,
    studyReminder: true,
    testReminder: true
  }
});

const handleSubmit = async () => {
  if (!form.value.validate()) return;

  loading.value = true;
  try {
    await profileStore.updateSettings(formData.value);
  } catch (error) {
    console.error('Failed to update settings:', error);
  } finally {
    loading.value = false;
  }
};

const handleDeleteAccount = async () => {
  loading.value = true;
  try {
    await profileStore.deleteAccount();
    router.push('/login');
  } catch (error) {
    console.error('Failed to delete account:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await profileStore.fetchProfile();
  if (profileStore.profile?.settings) {
    formData.value = {
      ...formData.value,
      ...profileStore.profile.settings
    };
  }
});
</script>

<style scoped>
.settings-page {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}
</style> 