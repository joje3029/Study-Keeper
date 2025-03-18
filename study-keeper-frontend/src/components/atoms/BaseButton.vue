<template>
  <v-btn
    :color="color"
    :variant="variant"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    @click="$emit('click')"
  >
    <slot></slot>
  </v-btn>
</template>

<script setup lang="ts">
interface Props {
  color?: string;
  variant?: 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined';
  size?: 'small' | 'default' | 'large' | 'x-large';
  disabled?: boolean;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  color: 'primary',
  variant: 'elevated',
  size: 'default',
  disabled: false,
  loading: false,
});

defineEmits<{
  (e: 'click'): void;
}>();
</script> 