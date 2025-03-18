<template>
  <v-text-field
    :model-value="modelValue"
    :label="label"
    :type="type"
    :rules="rules"
    :error-messages="errorMessages"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :hint="hint"
    :persistent-hint="persistentHint"
    @update:model-value="$emit('update:modelValue', $event)"
  ></v-text-field>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
  label?: string;
  type?: string;
  rules?: Array<(value: string) => boolean | string>;
  errorMessages?: string[];
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  hint?: string;
  persistentHint?: boolean;
}

withDefaults(defineProps<Props>(), {
  label: '',
  type: 'text',
  rules: () => [],
  errorMessages: () => [],
  disabled: false,
  readonly: false,
  required: false,
  hint: '',
  persistentHint: false,
});

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script> 