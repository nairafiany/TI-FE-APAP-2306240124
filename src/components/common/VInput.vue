<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <div class="relative">
      <!-- Slot untuk ikon di kiri (jika ada) -->
      <div
        v-if="$slots.iconLeft"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <slot name="iconLeft" />
      </div>

      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'border border-gray-300 rounded-md p-2 w-full',
          'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          { 'pl-10': $slots.iconLeft },
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        v-bind="$attrs"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineProps<{
  // --- PERBAIKAN DI SINI ---
  // Izinkan modelValue-nya undefined untuk menghindari type mismatch
  modelValue: string | number | null | undefined
  // -------------------------
  label?: string
  type?: string
  placeholder?: string
  disabled?: boolean
}>()

defineEmits(['update:modelValue'])

// ID unik untuk menghubungkan label dengan input (baik untuk aksesibilitas)
const inputId = computed(() => `v-input-${Math.random().toString(36).substring(7)}`)
</script>
