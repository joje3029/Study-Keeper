<template>
  <div>
    <h1 class="text-h4 mb-6">대시보드</h1>

    <v-row>
      <!-- 학습 통계 카드 -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>이번 주 학습 시간</v-card-title>
          <v-card-text>
            <div class="text-h3">{{ weeklyStudyTime }}시간</div>
            <div class="text-subtitle-2 text-medium-emphasis">목표: 20시간</div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 오답률 카드 -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>오답률</v-card-title>
          <v-card-text>
            <div class="text-h3">{{ wrongAnswerRate }}%</div>
            <div class="text-subtitle-2 text-medium-emphasis">전주 대비 -2%</div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 암기 성공률 카드 -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>암기 성공률</v-card-title>
          <v-card-text>
            <div class="text-h3">{{ memorySuccessRate }}%</div>
            <div class="text-subtitle-2 text-medium-emphasis">전주 대비 +5%</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 최근 학습한 분야 -->
    <v-card class="mt-6">
      <v-card-title>최근 학습한 분야</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="subject in recentSubjects"
            :key="subject.id"
            :title="subject.name"
            :subtitle="subject.lastStudyDate"
            :prepend-icon="subject.icon"
            @click="navigateToSubject(subject.id)"
          >
            <template v-slot:append>
              <v-chip
                :color="subject.progress >= 80 ? 'success' : 'warning'"
                size="small"
              >
                {{ subject.progress }}%
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <!-- 오답노트 바로가기 -->
    <v-card class="mt-6">
      <v-card-title>최근 오답노트</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="note in recentWrongNotes"
            :key="note.id"
            :title="note.question"
            :subtitle="note.subject"
            :prepend-icon="'mdi-note-text'"
            @click="navigateToWrongNote(note.id)"
          >
            <template v-slot:append>
              <v-chip
                color="error"
                size="small"
              >
                {{ note.wrongCount }}회
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 임시 데이터
const weeklyStudyTime = ref(15);
const wrongAnswerRate = ref(25);
const memorySuccessRate = ref(85);

const recentSubjects = ref([
  {
    id: 1,
    name: '영어 문법',
    lastStudyDate: '2024-03-18',
    icon: 'mdi-book-open-variant',
    progress: 75
  },
  {
    id: 2,
    name: '수학 기초',
    lastStudyDate: '2024-03-17',
    icon: 'mdi-calculator',
    progress: 90
  }
]);

const recentWrongNotes = ref([
  {
    id: 1,
    question: '현재완료형과 현재완료진행형의 차이점은?',
    subject: '영어 문법',
    wrongCount: 3
  },
  {
    id: 2,
    question: '이차방정식의 근의 공식은?',
    subject: '수학 기초',
    wrongCount: 2
  }
]);

const navigateToSubject = (id: number) => {
  router.push(`/subjects/${id}`);
};

const navigateToWrongNote = (id: number) => {
  router.push(`/wrong-notes/${id}`);
};
</script> 