<template>
  <div class="w-full">
    <label v-if="label" :for="selectId" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>

    <select
      :id="selectId"
      :value="stringModelValue"
      :disabled="disabled"
      :class="[
        'border border-gray-300 rounded-md p-2 w-full bg-white',
        'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
        'disabled:bg-gray-100 disabled:cursor-not-allowed',
      ]"
      @change="onChange"
      v-bind="$attrs"
    >
      <option v-if="placeholder" value="" disabled>
        {{ placeholder }}
      </option>

      <option v-for="opt in options" :key="opt.value" :value="String(opt.value)">
        {{ opt.label }}
      </option>
    </select>

    <!-- Debug info (hapus setelah berhasil) -->
    <div v-if="showDebug" class="mt-1 text-xs text-gray-500">
      Options count: {{ options.length }} | Selected: {{ stringModelValue }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

interface SelectOption {
  value: string | number
  label: string
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null | undefined
    options: SelectOption[]
    label?: string
    placeholder?: string
    disabled?: boolean
    showDebug?: boolean
  }>(),
  {
    showDebug: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number | null): void
}>()

// HTMLSelectElement.value selalu string; kita tampilkan sebagai string
const stringModelValue = computed(() => {
  const val =
    props.modelValue === null || props.modelValue === undefined ? '' : String(props.modelValue)
  console.log('🔍 VSelect stringModelValue:', val, '| options:', props.options.length)
  return val
})

// Saat emit, kembalikan tipe ASLI sesuai option.value
const onChange = (e: Event) => {
  const raw = (e.target as HTMLSelectElement).value
  console.log('🔄 VSelect onChange:', raw)

  // Jika empty string (placeholder), emit null
  if (raw === '') {
    emit('update:modelValue', null)
    return
  }

  // Cari option yang cocok
  const matched = props.options.find((o) => String(o.value) === raw)
  const emitValue = matched ? matched.value : raw

  console.log('✅ VSelect emit:', emitValue, typeof emitValue)
  emit('update:modelValue', emitValue)
}

const selectId = computed(() => `v-select-${Math.random().toString(36).slice(2, 9)}`)

// Watch options untuk debugging
watch(
  () => props.options,
  (newOptions) => {
    console.log('📋 VSelect options changed:', newOptions)
  },
  { deep: true },
)
</script>
