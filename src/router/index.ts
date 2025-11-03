import { createRouter, createWebHistory } from 'vue-router'

// --- Import Views ---

// Vehicle Views
import VehicleView from '@/views/vehicle/VehicleView.vue'
import CreateVehicleView from '@/views/vehicle/CreateVehicleView.vue'
import VehicleDetailView from '@/views/vehicle/VehicleDetailView.vue'
import EditVehicleView from '@/views/vehicle/EditVehicleView.vue'

// Booking Views
import BookingView from '@/views/booking/BookingView.vue'
import CreateBookingView from '@/views/booking/CreateBookingView.vue' // <-- DITAMBAHKAN
import BookingDetailView from '@/views/booking/BookingDetailView.vue'

// (Opsional) Jika Anda punya halaman Home
// import HomeView from '@/views/HomeView.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // === REDIRECT & HOME ROUTE ===
    {
      path: '/',
      name: 'home',
      // Mengarahkan langsung ke halaman daftar booking sebagai default
      redirect: '/bookings',
    },

    // === VEHICLE ROUTES ===
    {
      path: '/vehicles',
      name: 'vehicle-list',
      component: VehicleView, // Menampilkan daftar semua kendaraan
    },
    {
      path: '/vehicles/create',
      name: 'vehicle-create',
      component: CreateVehicleView, // Menampilkan form untuk membuat kendaraan baru
    },
    {
      path: '/vehicles/:id',
      name: 'vehicle-detail',
      component: VehicleDetailView, // Menampilkan detail satu kendaraan
    },
    {
      path: '/vehicles/:id/update',
      name: 'vehicle-update',
      component: EditVehicleView, // Menggunakan file EditVehicleView.vue untuk update
    },

    // === BOOKING ROUTES ===
    {
      path: '/bookings',
      name: 'booking-list',
      component: BookingView, // Menampilkan daftar semua pesanan
    },
    {
      // RUTE BARU UNTUK MEMBUAT BOOKING
      path: '/bookings/create',
      name: 'booking-create',
      component: CreateBookingView,
    },
    {
      path: '/bookings/:id',
      name: 'booking-detail',
      component: BookingDetailView, // Menampilkan detail satu pesanan
    },
  ],
})
