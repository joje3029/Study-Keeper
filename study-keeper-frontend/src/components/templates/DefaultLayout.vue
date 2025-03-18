<template>
  <v-app>
    <AppHeader
      @toggle-drawer="drawer = !drawer"
      @toggle-theme="toggleTheme"
      @menu-click="handleMenuClick"
    />

    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          :value="item"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          @click="handleNavigation(item.to)"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '../organisms/AppHeader.vue';

const router = useRouter();
const drawer = ref(true);

interface MenuItem {
  title: string;
  icon: string;
  to: string;
}

const menuItems: MenuItem[] = [
  { title: '대시보드', icon: 'mdi-view-dashboard', to: '/dashboard' },
  { title: '분야 관리', icon: 'mdi-book-open-variant', to: '/subjects' },
  { title: '오답노트', icon: 'mdi-note-text', to: '/wrong-notes' },
  { title: '공부 필기', icon: 'mdi-pencil', to: '/notes' },
  { title: '암기 테스트', icon: 'mdi-clipboard-check', to: '/memory-test' },
  { title: '학습 캘린더', icon: 'mdi-calendar', to: '/calendar' },
  { title: '통계/분석', icon: 'mdi-chart-bar', to: '/statistics' },
];

const toggleTheme = () => {
  // TODO: 테마 전환 로직 구현
};

const handleMenuClick = (action: string) => {
  if (action === 'logout') {
    // TODO: 로그아웃 로직 구현
    router.push('/login');
  }
};

const handleNavigation = (to: string) => {
  if (to) {
    router.push(to);
  }
};
</script> 