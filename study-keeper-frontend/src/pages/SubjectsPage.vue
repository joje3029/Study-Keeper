<template>
  <v-app>
    <app-header @toggle-drawer="toggleDrawer" @menu-click="handleMenuClick" />
    <v-main>
      <div class="subjects-page">
        <h1>분야 관리</h1>
        <v-btn color="primary" class="mb-4" @click="showCreateDialog = true">
          <v-icon left>mdi-plus</v-icon>
          새 분야 추가
        </v-btn>

        <v-row>
          <v-col v-for="subject in subjects" :key="subject.id" cols="12" md="6" lg="4">
            <v-card class="subject-card">
              <v-card-title>{{ subject.name }}</v-card-title>
              <v-card-actions>
                <v-btn icon @click="deleteSubject(subject.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-dialog v-model="showCreateDialog" max-width="500px">
          <v-card>
            <v-card-title>새 분야 추가</v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="formValid">
                <v-text-field
                  v-model="newSubjectName"
                  label="분야 이름"
                  :rules="[v => !!v || '분야 이름을 입력해주세요']"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="grey" variant="text" @click="showCreateDialog = false">
                취소
              </v-btn>
              <v-btn
                color="primary"
                :disabled="!formValid"
                @click="addSubject"
              >
                추가
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSubjectStore } from '@/stores/subject';

const subjectStore = useSubjectStore();

const showCreateDialog = ref(false);
const formValid = ref(false);
const newSubjectName = ref('');

const subjects = computed(() => subjectStore.subjects);

const addSubject = async () => {
  if (!formValid.value) return;
  await subjectStore.addSubject({
    name: newSubjectName.value,
    icon: 'mdi-book',
    color: '#000000'
  });
  newSubjectName.value = '';
  showCreateDialog.value = false;
};

const deleteSubject = async (id: number) => {
  if (!confirm('이 분야를 삭제하시겠습니까?')) return;
  await subjectStore.deleteSubject(id);
};
</script>

<style scoped>
.subjects-page {
  padding: 20px;
}

.subject-card {
  margin-bottom: 20px;
  transition: transform 0.2s;
}

.subject-card:hover {
  transform: translateY(-4px);
}
</style> 