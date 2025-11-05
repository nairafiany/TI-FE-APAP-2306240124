<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import { bookingService } from '@/services/booking.service'
import VButton from '@/components/common/VButton.vue'
import VSelect from '@/components/common/VSelect.vue' // ✅ import komponen kamu

const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null
const period = ref<'monthly' | 'quarterly'>('monthly')
const year = ref<number>(2025)
const chartData = ref<Record<string, number>>({})

const fetchChartData = async () => {
  chartData.value = await bookingService.getChartData(period.value, year.value)
  renderChart()
}

const renderChart = () => {
  if (!chartRef.value) return

  const labels = Object.keys(chartData.value)
  const values = Object.values(chartData.value)

  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Reservations',
          data: values,
          backgroundColor: '#22c55e',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#374151' },
        },
        title: {
          display: true,
          text: `Booking Results (${period.value === 'monthly' ? 'Monthly' : 'Quarterly'}) for ${year.value}`,
          color: '#111827',
          font: { size: 16, weight: 'bold' },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Number of Bookings' },
        },
      },
    },
  })
}

onMounted(fetchChartData)
watch([period, year], fetchChartData)
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold text-center text-green-700 mb-6">Rental Booking Dashboard</h1>

    <!-- 🌿 Filter Section pakai VSelect -->
    <div class="flex justify-center items-center gap-6 mb-8 bg-gray-50 p-6 rounded-xl shadow-md">
      <div class="w-40">
        <VSelect
          v-model="period"
          label="View By"
          :options="[
            { value: 'monthly', label: '📅 Monthly' },
            { value: 'quarterly', label: '📊 Quarterly' },
          ]"
        />
      </div>

      <div class="w-32">
        <VSelect
          v-model="year"
          label="Year"
          :options="[
            { value: 2023, label: '2023' },
            { value: 2024, label: '2024' },
            { value: 2025, label: '2025' },
            { value: 2026, label: '2026' },
          ]"
        />
      </div>
    </div>

    <!-- Chart -->
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-8">
      <canvas ref="chartRef" height="120"></canvas>
    </div>

    <!-- Table -->
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow p-4 overflow-x-auto">
      <table class="w-full text-center border-collapse">
        <thead>
          <tr class="bg-gray-100 text-gray-700">
            <th v-for="label in Object.keys(chartData)" :key="label" class="p-2 border-b">
              {{ label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="(value, label) in chartData" :key="label" class="p-2 border-b text-gray-800">
              {{ value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
