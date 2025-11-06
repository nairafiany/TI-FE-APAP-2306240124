import { createRouter, createWebHistory } from 'vue-router'

// === HOME ===
import HomeView from '@/views/HomeView.vue'

// === VEHICLE VIEWS ===
import VehicleView from '@/views/vehicle/VehicleView.vue'
import CreateVehicleView from '@/views/vehicle/CreateVehicleView.vue'
import VehicleDetailView from '@/views/vehicle/VehicleDetailView.vue'
import EditVehicleView from '@/views/vehicle/EditVehicleView.vue'

// === BOOKING VIEWS ===
import BookingView from '@/views/booking/BookingView.vue'
import CreateBookingView from '@/views/booking/CreateBookingView.vue'
import BookingDetailView from '@/views/booking/BookingDetailView.vue'
import UpdateBookingView from '@/views/booking/UpdateBookingView.vue'
import UpdateBookingStatusView from '@/views/booking/UpdateBookingStatusView.vue'
import UpdateBookingAddOnsView from '@/views/booking/UpdateBookingAddOnsView.vue'
import ChartView from '@/views/booking/BookingChartView.vue'
// === ROUTER CONFIGURATION ===
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // === HOME ROUTE ===
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
      props: true,
    },
    {
      path: '/vehicles/:id/update',
      name: 'vehicle-update',
      component: EditVehicleView,
      props: true,
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
      props: true,
    },
    {
      path: '/bookings/:id/update-details',
      name: 'booking-update-details',
      component: UpdateBookingView,
      props: true,
    },
    {
      path: '/bookings/:id/update-status',
      name: 'booking-update-status',
      component: UpdateBookingStatusView,
      props: true,
    },
    {
      path: '/bookings/:id/update-addons',
      name: 'booking-update-addons',
      component: UpdateBookingAddOnsView,
      props: true,
    },
    {
      path: '/bookings/chart',
      name: 'booking-chart',
      component: ChartView,
    },

    // === FALLBACK (REDIRECT) ===
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
