<template>
  <div class="profile-page">
    <div class="header">
      <h1>프로필</h1>
      <v-btn
        color="primary"
        @click="showEditDialog = true"
      >
        <v-icon>mdi-pencil</v-icon>
        프로필 수정
      </v-btn>
    </div>

    <v-row>
      <v-col cols="12" md="4">
        <v-card class="profile-card">
          <v-card-text class="text-center">
            <v-avatar
              size="150"
              class="mb-4"
              :image="profile?.avatar"
            >
              <v-icon size="100">mdi-account</v-icon>
            </v-avatar>

            <div class="text-h5 mb-2">{{ profile?.name }}</div>
            <div class="text-subtitle-1 text-medium-emphasis mb-4">
              @{{ profile?.username }}
            </div>

            <v-file-input
              v-model="avatarFile"
              accept="image/*"
              label="프로필 이미지 변경"
              prepend-icon="mdi-camera"
              hide-details
              class="mb-4"
              @change="handleAvatarChange"
            />

            <div class="text-body-2 text-medium-emphasis">
              가입일: {{ formatDate(profile?.createdAt) }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>자기소개</v-card-title>
          <v-card-text>
            <div class="text-body-1">
              {{ profile?.bio || '자기소개를 입력해주세요.' }}
            </div>
          </v-card-text>
        </v-card>

        <v-card class="mt-4">
          <v-card-title>학습 통계</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <div class="text-h6 mb-2">총 학습 시간</div>
                <div class="text-h4">{{ totalStudyTime }}시간</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-h6 mb-2">완료한 과목</div>
                <div class="text-h4">{{ completedSubjects }}개</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mt-4">
          <v-card-title>보안</v-card-title>
          <v-card-text>
            <v-btn
              color="primary"
              variant="outlined"
              @click="showPasswordDialog = true"
            >
              <v-icon start>mdi-lock</v-icon>
              비밀번호 변경
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 프로필 수정 다이얼로그 -->
    <v-dialog v-model="showEditDialog" max-width="600px">
      <v-card>
        <v-card-title>프로필 수정</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isFormValid">
            <v-text-field
              v-model="formData.name"
              label="이름"
              :rules="[v => !!v || '이름을 입력해주세요']"
              required
            />

            <v-text-field
              v-model="formData.username"
              label="아이디"
              :rules="[
                v => !!v || '아이디를 입력해주세요',
                v => v.length >= 4 || '아이디는 4자 이상이어야 합니다',
                v => /^[a-zA-Z0-9_]+$/.test(v) || '아이디는 영문, 숫자, 언더스코어만 사용 가능합니다'
              ]"
              required
            />

            <v-textarea
              v-model="formData.bio"
              label="자기소개"
              rows="3"
              auto-grow
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="showEditDialog = false"
          >
            취소
          </v-btn>
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
    </v-dialog>

    <!-- 비밀번호 변경 다이얼로그 -->
    <v-dialog v-model="showPasswordDialog" max-width="500px">
      <v-card>
        <v-card-title>비밀번호 변경</v-card-title>
        <v-card-text>
          <v-form ref="passwordForm" v-model="isPasswordFormValid">
            <v-text-field
              v-model="passwordData.currentPassword"
              label="현재 비밀번호"
              type="password"
              :rules="[v => !!v || '현재 비밀번호를 입력해주세요']"
              required
            />

            <v-text-field
              v-model="passwordData.newPassword"
              label="새 비밀번호"
              type="password"
              :rules="[
                v => !!v || '새 비밀번호를 입력해주세요',
                v => v.length >= 8 || '비밀번호는 8자 이상이어야 합니다',
                v => /[A-Z]/.test(v) || '대문자를 포함해야 합니다',
                v => /[0-9]/.test(v) || '숫자를 포함해야 합니다',
                v => /[!@#$%^&*]/.test(v) || '특수문자를 포함해야 합니다'
              ]"
              required
            />

            <v-text-field
              v-model="passwordData.confirmPassword"
              label="새 비밀번호 확인"
              type="password"
              :rules="[
                v => !!v || '새 비밀번호를 다시 입력해주세요',
                v => v === passwordData.newPassword || '비밀번호가 일치하지 않습니다'
              ]"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="showPasswordDialog = false"
          >
            취소
          </v-btn>
          <v-btn
            color="primary"
            :loading="passwordLoading"
            :disabled="!isPasswordFormValid"
            @click="handlePasswordChange"
          >
            변경
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProfileStore } from '@/stores/profile';

const profileStore = useProfileStore();

const showEditDialog = ref(false);
const isFormValid = ref(false);
const loading = ref(false);
const avatarFile = ref<File | null>(null);
const form = ref();

const showPasswordDialog = ref(false);
const isPasswordFormValid = ref(false);
const passwordLoading = ref(false);
const passwordForm = ref();

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const profile = computed(() => profileStore.profile);

const formData = ref({
  name: '',
  username: '',
  bio: ''
});

const totalStudyTime = computed(() => {
  // TODO: 실제 학습 시간 계산 로직 구현
  return 120;
});

const completedSubjects = computed(() => {
  // TODO: 실제 완료된 과목 수 계산 로직 구현
  return 5;
});

const formatDate = (date?: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('ko-KR');
};

const handleAvatarChange = async (file: File | null) => {
  if (!file) return;

  loading.value = true;
  try {
    await profileStore.uploadAvatar(file);
    avatarFile.value = null;
  } catch (error) {
    console.error('Failed to upload avatar:', error);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  if (!form.value.validate()) return;

  loading.value = true;
  try {
    await profileStore.updateProfile(formData.value);
    showEditDialog.value = false;
  } catch (error) {
    console.error('Failed to update profile:', error);
  } finally {
    loading.value = false;
  }
};

const handlePasswordChange = async () => {
  if (!passwordForm.value.validate()) return;

  passwordLoading.value = true;
  try {
    await profileStore.updatePassword({
      currentPassword: passwordData.value.currentPassword,
      newPassword: passwordData.value.newPassword
    });
    
    showPasswordDialog.value = false;
    passwordData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    // 성공 메시지
    alert('비밀번호가 성공적으로 변경되었습니다.');
  } catch (error: any) {
    // 스토어에서 설정된 에러 메시지 사용
    alert(profileStore.error || '비밀번호 변경에 실패했습니다.');
  } finally {
    passwordLoading.value = false;
  }
};

onMounted(async () => {
  await profileStore.fetchProfile();
  if (profile.value) {
    formData.value = {
      name: profile.value.name,
      username: profile.value.username,
      bio: profile.value.bio || ''
    };
  }
});
</script>

<style scoped>
.profile-page {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.profile-card {
  height: 100%;
}
</style> 