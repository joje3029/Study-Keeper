<template>
  <div class="statistics-page">
    <div class="header">
      <h1>학습 통계</h1>
    </div>

    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>주간 학습 시간</v-card-title>
          <v-card-text>
            <div class="text-h4 mb-4">{{ weeklyStudyTime }}시간</div>
            <v-progress-linear
              :model-value="weeklyStudyTime / 40 * 100"
              color="primary"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>과목별 학습 시간</v-card-title>
          <v-card-text>
            <div v-for="subject in subjectStudyTimes" :key="subject.name" class="mb-2">
              <div class="d-flex justify-space-between align-center">
                <span>{{ subject.name }}</span>
                <span>{{ subject.time }}시간</span>
              </div>
              <v-progress-linear
                :model-value="subject.time / maxSubjectTime * 100"
                :color="subject.color"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>기억력 테스트 성공률</v-card-title>
          <v-card-text>
            <div class="text-h4 mb-4">{{ memoryTestSuccessRate }}%</div>
            <v-progress-circular
              :model-value="memoryTestSuccessRate"
              color="success"
              size="100"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>학습 추이</v-card-title>
          <v-card-text>
            <div class="text-h6 mb-2">최근 7일</div>
            <div v-for="day in weeklyProgress" :key="day.date" class="mb-2">
              <div class="d-flex justify-space-between align-center">
                <span>{{ day.date }}</span>
                <span>{{ day.time }}시간</span>
              </div>
              <v-progress-linear
                :model-value="day.time / maxDailyTime * 100"
                color="primary"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 임시 데이터
const weeklyStudyTime = ref(25);
const subjectStudyTimes = ref([
  { name: '수학', time: 10, color: 'primary' },
  { name: '영어', time: 8, color: 'success' },
  { name: '과학', time: 7, color: 'warning' }
]);
const memoryTestSuccessRate = ref(85);
const weeklyProgress = ref([
  { date: '3/20', time: 4 },
  { date: '3/19', time: 3 },
  { date: '3/18', time: 5 },
  { date: '3/17', time: 2 },
  { date: '3/16', time: 4 },
  { date: '3/15', time: 3 },
  { date: '3/14', time: 4 }
]);

const maxSubjectTime = computed(() => {
  return Math.max(...subjectStudyTimes.value.map(s => s.time));
});

const maxDailyTime = computed(() => {
  return Math.max(...weeklyProgress.value.map(d => d.time));
});
</script>

<style scoped>
.statistics-page {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}
</style> 