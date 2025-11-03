import { createRouter, createWebHistory } from 'vue-router'

// --- Import Views ---

// Vehicle Views
import VehicleView from '@/views/vehicle/VehicleView.vue'
import CreateVehicleView from '@/views/vehicle/CreateVehicleView.vue'
import VehicleDetailView from '@/views/vehicle/VehicleDetailView.vue'
import EditVehicleView from '@/views/vehicle/EditVehicleView.vue'
import UpdateBookingAddOnsView from '@/views/booking/UpdateBookingAddOnsView.vue'
// Booking Views
import BookingView from '@/views/booking/BookingView.vue'
import CreateBookingView from '@/views/booking/CreateBookingView.vue'
import BookingDetailView from '@/views/booking/BookingDetailView.vue'
// [FIX] Impor komponen UpdateBookingView yang baru
import UpdateBookingView from '@/views/booking/UpdateBookingView.vue'
// (Anda akan menambahkan impor untuk AddOns dan Status di sini nanti)
import UpdateBookingStatusView from '@/views/booking/UpdateBookingStatusView.vue'
export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // === REDIRECT & HOME ROUTE ===
    {
      path: '/',
      name: 'home',
      redirect: '/bookings',
    },

    // === VEHICLE ROUTES ===
    {
      path: '/vehicles',
      name: 'vehicle-list',
      component: VehicleView,
    },
    {
      path: '/vehicles/create',
      name: 'vehicle-create',
      component: CreateVehicleView,
    },
    {
      path: '/vehicles/:id',
      name: 'vehicle-detail',
      component: VehicleDetailView,
    },
    {
      path: '/vehicles/:id/update',
      name: 'vehicle-update',
      component: EditVehicleView,
    },

    // === BOOKING ROUTES ===
    {
      path: '/bookings',
      name: 'booking-list',
      component: BookingView,
    },
    {
      path: '/bookings/create',
      name: 'booking-create',
      component: CreateBookingView,
    },
    {
      path: '/bookings/:id',
      name: 'booking-detail',
      component: BookingDetailView,
    },
    // [FIX] Tambahkan rute yang hilang untuk update details
    {
      path: '/bookings/:id/update-details',
      name: 'booking-update-details',
      component: UpdateBookingView,
    },
    {
      path: '/bookings/:id/update-status',
      name: 'booking-update-status',
      component: UpdateBookingStatusView,
    },
    {
      path: '/bookings/:id/update-addons',
      name: 'booking-update-addons',
      component: UpdateBookingAddOnsView,
    },
    // (Anda akan menambahkan rute untuk add-ons dan status di sini nanti)
    /*
    {
      path: '/bookings/:id/update-addons',
      name: 'booking-update-addons',
      component: UpdateAddOnsView, // Buat file ini nanti
    },
    {
      path: '/bookings/:id/update-status',
      name: 'booking-update-status',
      component: UpdateStatusView, // Buat file ini nanti
    },
    */
  ],
})
