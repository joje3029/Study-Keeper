<template>
  <div class="home-page">
    <div class="header">
      <h1>학습 관리 시스템</h1>
      <p class="subtitle">효율적인 학습을 위한 올인원 솔루션</p>
    </div>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="feature-card">
          <v-card-title>
            <v-icon color="primary" class="mr-2">mdi-book-open-variant</v-icon>
            분야 관리
          </v-card-title>
          <v-card-text>
            <p>학습하고 있는 과목들을 체계적으로 관리하세요.</p>
            <v-btn
              color="primary"
              variant="outlined"
              to="/subjects"
              class="mt-4"
            >
              분야 관리하기
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="feature-card">
          <v-card-title>
            <v-icon color="primary" class="mr-2">mdi-note-alert</v-icon>
            오답노트
          </v-card-title>
          <v-card-text>
            <p>틀린 문제를 기록하고 복습하세요.</p>
            <v-btn
              color="primary"
              variant="outlined"
              to="/wrong-notes"
              class="mt-4"
            >
              오답노트 보기
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="feature-card">
          <v-card-title>
            <v-icon color="primary" class="mr-2">mdi-note-text</v-icon>
            노트
          </v-card-title>
          <v-card-text>
            <p>학습 내용을 정리하고 관리하세요.</p>
            <v-btn
              color="primary"
              variant="outlined"
              to="/notes"
              class="mt-4"
            >
              노트 보기
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="feature-card">
          <v-card-title>
            <v-icon color="primary" class="mr-2">mdi-brain</v-icon>
            기억력 테스트
          </v-card-title>
          <v-card-text>
            <p>학습한 내용을 테스트하고 복습하세요.</p>
            <v-btn
              color="primary"
              variant="outlined"
              to="/memory-test"
              class="mt-4"
            >
              테스트 시작하기
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="feature-card">
          <v-card-title>
            <v-icon color="primary" class="mr-2">mdi-calendar</v-icon>
            캘린더
          </v-card-title>
          <v-card-text>
            <p>학습 일정을 관리하고 계획하세요.</p>
            <v-btn
              color="primary"
              variant="outlined"
              to="/calendar"
              class="mt-4"
            >
              캘린더 보기
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="feature-card">
          <v-card-title>
            <v-icon color="primary" class="mr-2">mdi-chart-bar</v-icon>
            통계
          </v-card-title>
          <v-card-text>
            <p>학습 현황과 성과를 확인하세요.</p>
            <v-btn
              color="primary"
              variant="outlined"
              to="/statistics"
              class="mt-4"
            >
              통계 보기
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
// 홈 페이지는 별도의 로직이 필요하지 않습니다.
</script>

<style scoped>
.home-page {
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.subtitle {
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.2rem;
}

.feature-card {
  height: 100%;
}
</style> 