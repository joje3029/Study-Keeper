<template>
  <v-app-bar color="primary" dark>
    <v-app-bar-nav-icon @click="$emit('toggle-drawer')"></v-app-bar-nav-icon>

    <v-toolbar-title>Study Keeper</v-toolbar-title>

    
    <v-spacer></v-spacer>
    
    
    <v-btn icon @click="navigateHome">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-menu>
      <template v-slot:activator>
        <v-btn icon>
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          :value="item"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          @click="$emit('menu-click', item.action)"
        ></v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

interface MenuItem {
  title: string;
  icon: string;
  to?: string;
  action?: string;
}

const menuItems: MenuItem[] = [
  { title: '프로필', icon: 'mdi-account', to: '/profile' },
  { title: '설정', icon: 'mdi-cog', to: '/settings' },
  { title: '로그아웃', icon: 'mdi-logout', action: 'logout' },
];

const navigateHome = () => {
  router.push('/');
};

defineEmits<{
  (e: 'toggle-drawer'): void;
  (e: 'toggle-theme'): void;
  (e: 'menu-click', action: string): void;
}>();
</script> 