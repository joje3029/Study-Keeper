<template>
  <div class="calendar-page">
    <div class="header">
      <h1>학습 캘린더</h1>
      <v-btn color="primary" @click="showCreateDialog = true">
        <v-icon>mdi-plus</v-icon>
        새 일정
      </v-btn>
    </div>

    <div class="calendar-container">
      <v-row>
        <v-col cols="12" md="9">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-btn icon @click="previousMonth">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <span class="mx-4">{{ currentYear }}년 {{ currentMonth + 1 }}월</span>
              <v-btn icon @click="nextMonth">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <div class="calendar-grid">
                <div class="calendar-header">
                  <div v-for="day in weekDays" :key="day" class="calendar-cell header-cell">
                    {{ day }}
                  </div>
                </div>
                <div class="calendar-body">
                  <div
                    v-for="(day, index) in calendarDays"
                    :key="index"
                    class="calendar-cell"
                    :class="{ 'other-month': !day.currentMonth }"
                    @click="selectDate(day.date)"
                  >
                    <div class="day-number">{{ day.dayNumber }}</div>
                    <div class="events-list">
                      <div
                        v-for="event in getEventsForDay(day.date)"
                        :key="event.id"
                        class="event-item"
                        :class="event.type"
                        @click.stop="showEventDetails(event)"
                      >
                        {{ event.title }}
                        <span v-if="event.type === 'exam'"> (시험)</span>
                        <span v-if="event.type === 'study'"> (공부필기)</span>
                        <span v-if="event.type === 'review'"> (오답노트)</span>
                        <span v-if="event.type === 'memory'"> (암기테스트)</span>
                        <span class="d-day">{{ calculateDDay(event.startDate) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">  
          D-day 올 자리
        </v-col>
      </v-row>
    </div>

    <!-- 일정 생성/수정 다이얼로그 -->
    <v-dialog v-model="showCreateDialog" max-width="600px">
      <v-card>
        <v-card-title>{{ editingEvent ? '일정 수정' : '새 일정' }}</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-select
              v-model="formData.subjectId"
              :items="subjects"
              item-title="name"
              item-value="id"
              label="과목"
              :rules="[v => !!v || '과목을 선택해주세요']"
            />
            <v-text-field
              v-model="formData.title"
              label="제목"
              :rules="[v => !!v || '제목을 입력해주세요']"
            />
            <v-textarea
              v-model="formData.description"
              label="설명"
              rows="3"
            />
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="formData.startDate"
                  label="시작일"
                  type="datetime-local"
                  :rules="[v => !!v || '시작일을 선택해주세요']"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="formData.endDate"
                  label="종료일"
                  type="datetime-local"
                  :rules="[v => !!v || '종료일을 선택해주세요']"
                />
              </v-col>
            </v-row>
            <v-select
              v-model="formData.type"
              :items="eventTypes"
              label="일정 유형"
              :rules="[v => !!v || '일정 유형을 선택해주세요']"
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
            :loading="loading"
            :disabled="!formValid"
            @click="handleSubmit"
          >
            {{ editingEvent ? '수정' : '생성' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 일정 상세 다이얼로그 -->
    <v-dialog v-model="showDetailsDialog" max-width="500px">
      <v-card v-if="selectedEvent">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{ selectedEvent.title }}</span>
          <v-btn icon @click="showDetailsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="event-details">
            <div class="detail-item">
              <span class="label">과목:</span>
              <span>{{ getSubjectName(selectedEvent.subjectId) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">일정 유형:</span>
              <span>{{ selectedEvent.type }}</span>
            </div>
            <div class="detail-item">
              <span class="label">시작일:</span>
              <span>{{ formatDateTime(selectedEvent.startDate) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">종료일:</span>
              <span>{{ formatDateTime(selectedEvent.endDate) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">상태:</span>
              <span>{{ selectedEvent.status }}</span>
            </div>
            <div v-if="selectedEvent.description" class="detail-item">
              <span class="label">설명:</span>
              <span>{{ selectedEvent.description }}</span>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="error"
            variant="text"
            @click="deleteEvent(selectedEvent.id)"
          >
            삭제
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            @click="editEvent(selectedEvent)"
          >
            수정
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useSubjectStore } from '@/stores/subject';
import { useCalendarStore, type StudyEvent } from '@/stores/calendar';

const subjectStore = useSubjectStore();
const calendarStore = useCalendarStore();

// 상태
const showCreateDialog = ref(false);
const showDetailsDialog = ref(false);
const formValid = ref(false);
const loading = ref(false);
const selectedEvent = ref<StudyEvent | null>(null);
const editingEvent = ref<StudyEvent | null>(null);
const currentDate = ref(new Date());
const form = ref();

const formData = ref({
  subjectId: 0,
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  type: 'study' as StudyEvent['type'],
  status: 'planned' as StudyEvent['status']
});

// 계산된 속성
const subjects = computed(() => subjectStore.subjects);
const events = computed(() => calendarStore.events);
const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonth = computed(() => currentDate.value.getMonth());

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

const eventTypes = [
  { title: '학습', value: 'study' },
  { title: '시험', value: 'exam' },
  { title: '복습', value: 'review' },
  { title: '암기', value: 'memory' }
];

const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const days = [];

  // 이전 달의 날짜들
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      dayNumber: prevMonthLastDay - i,
      currentMonth: false
    });
  }

  // 현재 달의 날짜들
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      dayNumber: i,
      currentMonth: true
    });
  }

  // 다음 달의 날짜들
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      dayNumber: i,
      currentMonth: false
    });
  }

  return days;
});

// 메서드
const getSubjectName = (subjectId: number) => {
  const subject = subjects.value.find(s => s.id === subjectId);
  return subject ? subject.name : '알 수 없음';
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getEventsForDay = (date: Date) => {
  const dateString = date.toISOString().split('T')[0];
  return events.value.filter(event => {
    const eventDate = new Date(event.startDate).toISOString().split('T')[0];
    return eventDate === dateString;
  });
};

const previousMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1);
};

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1);
};

const selectDate = (date: Date) => {
  const formattedDate = date.toISOString().slice(0, 16);
  formData.value.startDate = formattedDate;
  formData.value.endDate = formattedDate;
  showCreateDialog.value = true;
};

const showEventDetails = (event: StudyEvent) => {
  selectedEvent.value = event;
  showDetailsDialog.value = true;
};

const editEvent = (event: StudyEvent) => {
  editingEvent.value = event;
  formData.value = {
    subjectId: event.subjectId,
    title: event.title,
    description: event.description || '',
    startDate: event.startDate.slice(0, 16),
    endDate: event.endDate.slice(0, 16),
    type: event.type,
    status: event.status
  };
  showDetailsDialog.value = false;
  showCreateDialog.value = true;
};

const resetForm = () => {
  formData.value = {
    subjectId: 0,
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    type: 'study',
    status: 'planned'
  };
  editingEvent.value = null;
};

const handleSubmit = async () => {
  if (!form.value.validate()) return;

  loading.value = true;
  try {
    if (editingEvent.value) {
      await calendarStore.updateEvent(editingEvent.value.id, formData.value);
    } else {
      await calendarStore.createEvent(formData.value);
    }
    showCreateDialog.value = false;
    resetForm();
  } catch (error) {
    console.error('Failed to save event:', error);
  } finally {
    loading.value = false;
  }
};

const deleteEvent = async (id: number) => {
  if (!confirm('이 일정을 삭제하시겠습니까?')) return;

  loading.value = true;
  try {
    await calendarStore.deleteEvent(id);
    showDetailsDialog.value = false;
    selectedEvent.value = null;
  } catch (error) {
    console.error('Failed to delete event:', error);
  } finally {
    loading.value = false;
  }
};

// Add D-Day calculation and display
const calculateDDay = (startDate: string) => {
  const eventDate = new Date(startDate);
  const today = new Date();
  const timeDiff = eventDate.getTime() - today.getTime();
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return dayDiff > 0 ? `D-${dayDiff}` : dayDiff === 0 ? 'D-Day' : `D+${Math.abs(dayDiff)}`;
};

// 초기화
onMounted(async () => {
  await Promise.all([
    subjectStore.fetchSubjects(),
    calendarStore.fetchEvents()
  ]);
});
</script>

<style scoped>
.calendar-page {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-container {
  margin-top: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.calendar-grid {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-cell {
  min-height: 100px;
  padding: 8px;
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
}

.calendar-cell:hover {
  background-color: #f5f5f5;
}

.header-cell {
  padding: 12px;
  text-align: center;
  font-weight: bold;
}

.other-month {
  background-color: #f9f9f9;
  color: #999;
}

.day-number {
  font-weight: bold;
  margin-bottom: 4px;
}

.events-list {
  font-size: 0.8em;
}

.event-item {
  padding: 2px 4px;
  margin: 2px 0;
  border-radius: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.event-item.study {
  background-color: #e3f2fd;
  color: #1976d2;
}

.event-item.exam {
  background-color: #fce4ec;
  color: #c2185b;
}

.event-item.review {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.event-item.memory {
  background-color: #e8f5e9;
  color: #388e3c;
}

.event-details {
  padding: 16px;
}

.detail-item {
  margin-bottom: 12px;
}

.detail-item .label {
  font-weight: bold;
  margin-right: 8px;
  color: #666;
}
</style> 