<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4">오답노트</h1>
      <BaseButton
        color="primary"
        @click="showCreateDialog = true"
      >
        <v-icon start>mdi-plus</v-icon>
        새 오답노트 추가
      </BaseButton>
    </div>

    <!-- 필터 -->
    <v-card class="mb-6">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedSubject"
              :items="subjects"
              item-title="name"
              item-value="id"
              label="분야"
              clearable
              @update:model-value="filterNotes"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-combobox
              v-model="selectedTags"
              :items="allTags"
              label="태그"
              multiple
              chips
              closable-chips
              @update:model-value="filterNotes"
            ></v-combobox>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchQuery"
              label="검색"
              prepend-inner-icon="mdi-magnify"
              clearable
              @update:model-value="filterNotes"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 오답노트 목록 -->
    <v-row>
      <v-col
        v-for="note in filteredNotes"
        :key="note.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          class="wrong-note-card"
          @click="editNote(note)"
        >
          <v-card-item>
            <v-card-title>{{ note.question }}</v-card-title>
            <v-card-subtitle>
              {{ getSubjectName(note.subjectId) }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <div class="d-flex flex-wrap gap-2 mb-2">
              <v-chip
                v-for="tag in note.tags"
                :key="tag"
                size="small"
                color="primary"
                variant="tonal"
              >
                {{ tag }}
              </v-chip>
            </div>

            <div class="text-body-2 text-medium-emphasis">
              {{ note.answer }}
            </div>

            <div class="d-flex justify-space-between align-center mt-4">
              <v-chip
                color="error"
                size="small"
              >
                {{ note.wrongCount }}회 오답
              </v-chip>
              <div class="text-caption text-medium-emphasis">
                마지막 오답: {{ formatDate(note.lastWrongDate) }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 오답노트 생성/수정 다이얼로그 -->
    <v-dialog
      v-model="showCreateDialog"
      max-width="800px"
    >
      <v-card>
        <v-card-title>
          {{ editingNote ? '오답노트 수정' : '새 오답노트 추가' }}
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="isFormValid">
            <v-select
              v-model="formData.subjectId"
              :items="subjects"
              item-title="name"
              item-value="id"
              label="분야"
              :rules="[v => !!v || '분야를 선택해주세요']"
              required
            ></v-select>

            <BaseInput
              v-model="formData.question"
              label="문제"
              :rules="[v => !!v || '문제를 입력해주세요']"
              required
              class="mt-4"
            />

            <v-textarea
              v-model="formData.answer"
              label="정답"
              :rules="[v => !!v || '정답을 입력해주세요']"
              required
              class="mt-4"
            />

            <v-textarea
              v-model="formData.explanation"
              label="해설"
              class="mt-4"
            />

            <v-combobox
              v-model="formData.tags"
              :items="allTags"
              label="태그"
              multiple
              chips
              closable-chips
              class="mt-4"
            ></v-combobox>

            <v-textarea
              v-model="formData.memo"
              label="메모"
              class="mt-4"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <BaseButton
            color="grey"
            variant="text"
            @click="showCreateDialog = false"
          >
            취소
          </BaseButton>
          <BaseButton
            color="primary"
            :loading="loading"
            :disabled="!isFormValid"
            @click="handleSubmit"
          >
            {{ editingNote ? '수정' : '추가' }}
          </BaseButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useSubjectStore } from '@/stores/subject';
import { useWrongNoteStore, type WrongNote } from '@/stores/wrongNote';
import BaseButton from '@/components/atoms/BaseButton.vue';
import BaseInput from '@/components/atoms/BaseInput.vue';

const subjectStore = useSubjectStore();
const wrongNoteStore = useWrongNoteStore();

const showCreateDialog = ref(false);
const isFormValid = ref(false);
const loading = ref(false);
const editingNote = ref<WrongNote | null>(null);

const selectedSubject = ref<number | null>(null);
const selectedTags = ref<string[]>([]);
const searchQuery = ref('');

const formData = ref({
  subjectId: 0 as number,
  question: '',
  answer: '',
  explanation: '',
  tags: [] as string[],
  memo: '',
});

const subjects = computed(() => subjectStore.subjects);
const wrongNotes = computed(() => wrongNoteStore.wrongNotes);
const allTags = computed(() => {
  const tags = new Set<string>();
  wrongNotes.value.forEach(note => {
    note.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags);
});

const filteredNotes = computed(() => {
  let notes = wrongNotes.value;

  if (selectedSubject.value) {
    notes = notes.filter(note => note.subjectId === selectedSubject.value);
  }

  if (selectedTags.value.length > 0) {
    notes = notes.filter(note =>
      selectedTags.value.every(tag => note.tags.includes(tag))
    );
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    notes = notes.filter(note =>
      note.question.toLowerCase().includes(query) ||
      note.answer.toLowerCase().includes(query) ||
      note.explanation?.toLowerCase().includes(query) ||
      note.memo?.toLowerCase().includes(query)
    );
  }

  return notes;
});

onMounted(async () => {
  await Promise.all([
    subjectStore.fetchSubjects(),
    wrongNoteStore.fetchWrongNotes(),
  ]);
});

const getSubjectName = (subjectId: number) => {
  const subject = subjects.value.find(s => s.id === subjectId);
  return subject?.name || '알 수 없음';
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ko-KR');
};

const resetForm = () => {
  formData.value = {
    subjectId: 0,
    question: '',
    answer: '',
    explanation: '',
    tags: [],
    memo: '',
  };
  editingNote.value = null;
};

const editNote = (note: WrongNote) => {
  editingNote.value = note;
  formData.value = {
    subjectId: note.subjectId,
    question: note.question,
    answer: note.answer,
    explanation: note.explanation || '',
    tags: [...note.tags],
    memo: note.memo || '',
  };
  showCreateDialog.value = true;
};

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  loading.value = true;
  try {
    if (editingNote.value) {
      await wrongNoteStore.updateWrongNote(editingNote.value.id, formData.value);
    } else {
      await wrongNoteStore.createWrongNote(formData.value);
    }
    showCreateDialog.value = false;
    resetForm();
  } catch (error) {
    console.error('Failed to submit:', error);
  } finally {
    loading.value = false;
  }
};

const filterNotes = () => {
  // 필터링은 computed 속성에서 자동으로 처리됨
};
</script>

<style scoped>
.wrong-note-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.wrong-note-card:hover {
  transform: translateY(-4px);
}

.gap-2 {
  gap: 8px;
}
</style> 