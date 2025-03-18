<template>
  <div class="memory-test-page">
    <div class="header">
      <h1>암기 테스트</h1>
    </div>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>필터</v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedSubject"
              :items="subjects"
              item-title="name"
              item-value="id"
              label="분야"
              clearable
              class="mt-4"
            />

            <v-select
              v-model="selectedStatus"
              :items="statuses"
              label="상태"
              clearable
              class="mt-4"
            />

            <v-text-field
              v-model="numberOfQuestions"
              label="문제 수"
              type="number"
              class="mt-4"
            />

            <v-btn color="primary" @click="startTest">시작</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="6" v-for="test in filteredTests" :key="test.id">
        <v-card class="test-card">
          <v-card-title>
            <div class="d-flex align-center">
              <v-icon :color="test.subject.color" class="mr-2">{{ test.subject.icon }}</v-icon>
              {{ test.subject.name }}
            </div>
            <div class="text-subtitle-1 mt-2">{{ test.title }}</div>
          </v-card-title>
          <v-card-text>
            <div class="text-body-2 mb-2">{{ test.description }}</div>
            <div class="d-flex flex-wrap gap-2">
              <v-chip
                v-for="tag in test.tags"
                :key="tag"
                size="small"
                variant="outlined"
              >
                {{ tag }}
              </v-chip>
            </div>
            <div class="d-flex justify-space-between align-center mt-2">
              <v-chip
                :color="getStatusColor(test.status)"
                size="small"
              >
                {{ getStatusText(test.status) }}
              </v-chip>
              <span class="text-caption">
                마지막 수정: {{ formatDate(test.updatedAt) }}
              </span>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 테스트 진행 다이얼로그 -->
    <v-dialog v-model="showTestDialog" max-width="800px">
      <v-card>
        <v-card-title>
          <div class="d-flex align-center">
            <v-icon :color="currentTest?.subject.color" class="mr-2">
              {{ currentTest?.subject.icon }}
            </v-icon>
            {{ currentTest?.title }}
          </div>
        </v-card-title>
        <v-card-text>
          <div v-if="currentQuestion" class="text-center">
            <div class="text-h5 mb-4">{{ currentQuestion.question }}</div>
            <v-text-field
              v-model="currentAnswer"
              label="답변"
              :rules="[v => !!v || '답변을 입력해주세요']"
              required
            />
            <div class="d-flex justify-center mt-4">
              <v-btn
                color="primary"
                @click="checkAnswer"
                :loading="loading"
              >
                확인
              </v-btn>
            </div>
          </div>
          <div v-else class="text-center">
            <div class="text-h5 mb-4">테스트 완료!</div>
            <div class="text-body-1">
              정답률: {{ (correctAnswers / totalQuestions) * 100 }}%
            </div>
            <div class="mt-4">
              <v-btn
                color="primary"
                @click="showTestDialog = false"
              >
                닫기
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 문제 리스트 -->
    <v-row>
      <v-col v-for="question in tests[0].questions" :key="question.id" cols="12">
        <v-card>
          <v-card-title>{{ question.question }}</v-card-title>
          <v-card-text v-if="question.showAnswer">정답: {{ question.answer }}</v-card-text>
          <v-card-actions>
            <v-btn @click="question.showAnswer = !question.showAnswer">
              {{ question.showAnswer ? '정답 숨기기' : '정답 확인' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Subject {
  id: number;
  name: string;
  color: string;
  icon: string;
}

interface Question {
  id: number;
  question: string;
  answer: string;
  subjectId: number;
  status: 'planned' | 'in_progress' | 'completed';
  showAnswer: boolean;
}

interface MemoryTest {
  id: number;
  subjectId: number;
  subject: Subject;
  title: string;
  description: string;
  tags: string[];
  questions: Question[];
  status: 'planned' | 'in_progress' | 'completed';
  currentQuestionIndex: number;
  correctAnswers: number;
  createdAt: string;
  updatedAt: string;
}

const subjects = ref<Subject[]>([
  {
    id: 1,
    name: '수학',
    color: 'primary',
    icon: 'mdi-calculator'
  },
  {
    id: 2,
    name: '영어',
    color: 'success',
    icon: 'mdi-translate'
  },
  {
    id: 3,
    name: '과학',
    color: 'warning',
    icon: 'mdi-flask'
  }
]);

const tests = ref<MemoryTest[]>([
  {
    id: 1,
    subjectId: 1,
    subject: subjects.value[0],
    title: '삼각함수 공식',
    description: '삼각함수의 주요 공식 암기 테스트',
    tags: ['삼각함수', '수학', '공식'],
    questions: [
      {
        id: 1,
        question: 'sin²θ + cos²θ = ?',
        answer: '1',
        subjectId: 1,
        status: 'planned',
        showAnswer: false
      },
      {
        id: 2,
        question: 'tanθ = ?',
        answer: 'sinθ/cosθ',
        subjectId: 1,
        status: 'planned',
        showAnswer: false
      }
    ],
    status: 'planned',
    currentQuestionIndex: 0,
    correctAnswers: 0,
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20'
  }
]);

const showTestDialog = ref(false);
const loading = ref(false);
const currentTest = ref<MemoryTest | null>(null);
const currentQuestion = computed(() => {
  if (!currentTest.value) return null;
  return currentTest.value.questions[currentTest.value.currentQuestionIndex];
});
const currentAnswer = ref('');
const correctAnswers = ref(0);
const totalQuestions = ref(0);

const selectedSubject = ref<number | null>(null);
const selectedStatus = ref<string | null>(null);
const numberOfQuestions = ref<number>(10);

const statuses = ['planned', 'in_progress', 'completed'];

const filteredTests = computed(() => {
  return tests.value.filter(test => {
    if (selectedSubject.value && test.subjectId !== selectedSubject.value) {
      return false;
    }
    if (selectedStatus.value && test.status !== selectedStatus.value) {
      return false;
    }
    return true;
  });
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ko-KR');
};

const getStatusColor = (status: MemoryTest['status']) => {
  switch (status) {
    case 'planned':
      return 'grey';
    case 'in_progress':
      return 'warning';
    case 'completed':
      return 'success';
    default:
      return 'grey';
  }
};

const getStatusText = (status: MemoryTest['status']) => {
  switch (status) {
    case 'planned':
      return '예정';
    case 'in_progress':
      return '진행중';
    case 'completed':
      return '완료';
    default:
      return '';
  }
};

const startTest = (test: MemoryTest) => {
  currentTest.value = { ...test };
  correctAnswers.value = 0;
  totalQuestions.value = test.questions.length;
  currentAnswer.value = '';
  showTestDialog.value = true;
};

const checkAnswer = async () => {
  if (!currentTest.value || !currentQuestion.value) return;

  loading.value = true;
  try {
    // TODO: API 호출로 대체
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const isCorrect = currentAnswer.value.trim().toLowerCase() === 
      currentQuestion.value.answer.trim().toLowerCase();
    
    if (isCorrect) {
      correctAnswers.value++;
    }

    if (currentTest.value.currentQuestionIndex < currentTest.value.questions.length - 1) {
      currentTest.value.currentQuestionIndex++;
      currentAnswer.value = '';
    } else {
      // 테스트 완료
      const index = tests.value.findIndex(t => t.id === currentTest.value?.id);
      if (index !== -1) {
        tests.value[index] = {
          ...tests.value[index],
          status: 'completed',
          correctAnswers: correctAnswers.value,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      currentTest.value = null;
    }
  } catch (error) {
    console.error('Failed to check answer:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.memory-test-page {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.test-card {
  height: 100%;
}

.gap-2 {
  gap: 8px;
}
</style> 