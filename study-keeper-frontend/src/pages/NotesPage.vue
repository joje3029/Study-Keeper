<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4">노트</h1>
      <BaseButton
        color="primary"
        @click="showCreateDialog = true"
      >
        <v-icon start>mdi-plus</v-icon>
        새 노트 추가
      </BaseButton>
    </div>

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

    <!-- 노트 목록 -->
    <v-row>
      <v-col
        v-for="note in filteredNotes"
        :key="note.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          class="note-card"
          @click="editNote(note)"
        >
          <v-card-item>
            <div class="d-flex justify-space-between align-center">
              <v-card-title>{{ note.title }}</v-card-title>
              <v-btn
                icon
                :color="note.isFavorite ? 'error' : 'grey'"
                variant="text"
                @click.stop="toggleFavorite(note.id)"
              >
                <v-icon>{{ note.isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
              </v-btn>
            </div>
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

            <div class="text-body-2 text-medium-emphasis note-preview">
              {{ note.content }}
            </div>

            <div class="d-flex justify-space-between align-center mt-4">
              <div class="text-caption text-medium-emphasis">
                수정일: {{ formatDate(note.updatedAt) }}
              </div>
              <v-btn
                icon
                color="error"
                variant="text"
                @click.stop="deleteNote(note.id)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 노트 생성/수정 다이얼로그 -->
    <v-dialog
      v-model="showCreateDialog"
      max-width="800px"
      fullscreen
    >
      <v-card>
        <v-toolbar>
          <v-toolbar-title>
            {{ editingNote ? '노트 수정' : '새 노트 추가' }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="showCreateDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

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
              v-model="formData.title"
              label="제목"
              :rules="[v => !!v || '제목을 입력해주세요']"
              required
              class="mt-4"
            />



            <v-textarea
              v-model="formData.content"
              label="내용"
              class="mt-4"
            ></v-textarea>

            <v-file-input
              v-model="formData.files"
              label="파일 업로드"
              prepend-icon="mdi-paperclip"
              multiple
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

            
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
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
import { useNoteStore, type Note } from '@/stores/note';
import BaseButton from '@/components/atoms/BaseButton.vue';
import BaseInput from '@/components/atoms/BaseInput.vue';

const subjectStore = useSubjectStore();
const noteStore = useNoteStore();

const showCreateDialog = ref(false);
const isFormValid = ref(false);
const loading = ref(false);
const editingNote = ref<Note | null>(null);

const selectedSubject = ref<number | null>(null);
const selectedTags = ref<string[]>([]);
const searchQuery = ref('');

const formData = ref({
  subjectId: 0 as number,
  title: '',
  content: '',
  tags: [] as string[],
  isFavorite: false,
  files: [] as File[],
});

const subjects = computed(() => subjectStore.subjects);
const notes = computed(() => noteStore.notes);
const allTags = computed(() => {
  const tags = new Set<string>();
  notes.value.forEach(note => {
    note.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags);
});

const filteredNotes = computed(() => {
  let filtered = notes.value;

  if (selectedSubject.value) {
    filtered = filtered.filter(note => note.subjectId === selectedSubject.value);
  }

  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(note =>
      selectedTags.value.every(tag => note.tags.includes(tag))
    );
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(note =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  }

  return filtered;
});

onMounted(async () => {
  await Promise.all([
    subjectStore.fetchSubjects(),
    noteStore.fetchNotes(),
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
    title: '',
    content: '',
    tags: [],
    isFavorite: false,
    files: [],
  };
  editingNote.value = null;
};

const editNote = (note: Note) => {
  editingNote.value = note;
  formData.value = {
    subjectId: note.subjectId,
    title: note.title,
    content: note.content,
    tags: [...note.tags],
    isFavorite: note.isFavorite,
    files: [],
  };
  showCreateDialog.value = true;
};

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  loading.value = true;
  try {
    if (editingNote.value) {
      await noteStore.updateNote(editingNote.value.id, formData.value);
    } else {
      await noteStore.createNote(formData.value);
    }
    showCreateDialog.value = false;
    resetForm();
  } catch (error) {
    console.error('Failed to submit:', error);
  } finally {
    loading.value = false;
  }
};

const toggleFavorite = async (id: number) => {
  await noteStore.toggleFavorite(id);
};

const deleteNote = async (id: number) => {
  if (confirm('정말로 이 노트를 삭제하시겠습니까?')) {
    await noteStore.deleteNote(id);
  }
};

const filterNotes = () => {
  // 필터링은 computed 속성에서 자동으로 처리됨
};
</script>

<style scoped>
.note-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.note-card:hover {
  transform: translateY(-4px);
}

.gap-2 {
  gap: 8px;
}

.note-preview {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style> 