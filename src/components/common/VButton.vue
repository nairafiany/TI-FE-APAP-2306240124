<template>
  <component
    :is="componentTag"
    :to="to"
    :type="type"
    :disabled="disabled"
    :class="finalClasses"
    @click="onClick"
  >
    <!-- Slot untuk ikon (opsional) -->
    <slot name="icon" />

    <!-- Slot untuk teks tombol -->
    <span :class="{ 'ml-2': $slots.icon }">
      <slot />
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

// Tipe untuk varian warna
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline'
// Tipe untuk ukuran
type ButtonSize = 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    to?: string // Jika diisi, tombol akan menjadi RouterLink
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    to: undefined,
    type: 'button',
    disabled: false,
  },
)

const emit = defineEmits(['click'])

// Menentukan apakah komponen ini adalah <button> or <RouterLink>
const componentTag = computed(() => {
  return props.to ? RouterLink : 'button'
})

// ----- STYLING DENGAN TAILWIND -----

// Style dasar yang dimiliki semua tombol
const baseClasses =
  'inline-flex items-center justify-center font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2'

// Style berdasarkan prop `variant`
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      // Sesuai dengan gambar Anda (hijau)
      return 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
    case 'secondary':
      // Tombol abu-abu/gelap untuk aksi sekunder
      return 'bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-600'
    case 'danger':
      // Tombol merah untuk hapus/batal
      return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    case 'outline':
      // Tombol transparan dengan border
      return 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 shadow-sm'
    default:
      return 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1 text-xs' // Ukuran kecil
    case 'md':
    default:
      return 'px-4 py-2 text-sm' // Ukuran standar
  }
})

const disabledClasses = 'opacity-50 cursor-not-allowed hover:scale-100'

const finalClasses = computed(() => {
  return [
    baseClasses,
    variantClasses.value,
    sizeClasses.value,
    props.disabled ? disabledClasses : '',
  ].join(' ')
})

const onClick = (event: Event) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>
