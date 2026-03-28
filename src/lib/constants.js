// ─── Clinic Info ──────────────────────────────────────────────
export const CLINIC_NAME = 'Niramay Ayurvedic Clinik'
export const CLINIC_PHONE = '9428004144'
export const CLINIC_WA = `https://wa.me/91${CLINIC_PHONE}`

// Admin credentials — for production move these to .env
export const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin'
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'niramay@2024'

// ─── Backend API base URL ─────────────────────────────────────
// In development: your local backend (Node/Express or Supabase edge)
// In production:  your deployed backend URL
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// ─── Services ─────────────────────────────────────────────────
export const SERVICES = [
  {
    id: 'colon-therapy',
    label: 'Colon Therapy (Basti)',
    icon: '🌿',
    duration: '45–60 min',
    badge: 'Specialty',
    price: 2000,
    deposit: 500,
    desc: 'Traditional Ayurvedic colon cleansing using herbal oils and decoctions to eliminate Ama (toxins) and balance Vata dosha.',
  },
  {
    id: 'panchakarma',
    label: 'Panchakarma',
    icon: '🔥',
    duration: '5–21 days',
    badge: 'Signature',
    price: 15000,
    deposit: 2000,
    desc: 'Comprehensive 5-step detox therapy combining Vamana, Virechana, Basti, Nasya, and Raktamokshana for full body purification.',
  },
  {
    id: 'abhyanga',
    label: 'Abhyanga Massage',
    icon: '💆',
    duration: '60 min',
    badge: 'Popular',
    price: 1500,
    deposit: 300,
    desc: 'Warm medicated oil full-body massage that nourishes tissues, improves circulation, and induces deep relaxation.',
  },
  {
    id: 'shirodhara',
    label: 'Shirodhara',
    icon: '🌱',
    duration: '45 min',
    badge: 'Relaxing',
    price: 1800,
    deposit: 400,
    desc: 'Continuous warm oil stream poured on the forehead to calm the nervous system, relieve stress, and improve sleep.',
  },
  {
    id: 'consultation',
    label: 'Herbal Consultation',
    icon: '🌾',
    duration: '30 min',
    badge: 'Holistic',
    price: 800,
    deposit: 200,
    desc: 'Personalized Ayurvedic assessment of your Prakriti constitution with customized herbal protocols and diet plans.',
  },
  {
    id: 'kati-basti',
    label: 'Kati Basti',
    icon: '✨',
    duration: '45 min',
    badge: 'Therapeutic',
    price: 1200,
    deposit: 300,
    desc: 'Specialized lower back treatment using warm medicated oil retained in a dough ring to relieve pain and stiffness.',
  },
]

// ─── Time Slots ───────────────────────────────────────────────
export const TIME_SLOTS = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
]

// ─── Appointment Statuses ──────────────────────────────────────
export const STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
}

export const STATUS_META = {
  PENDING: { label: 'Pending', badgeClass: 'badge-pending', icon: '⏳', color: 'text-amber-600' },
  CONFIRMED: { label: 'Confirmed', badgeClass: 'badge-confirmed', icon: '✅', color: 'text-green-600' },
  CANCELLED: { label: 'Cancelled', badgeClass: 'badge-cancelled', icon: '❌', color: 'text-red-600' },
  COMPLETED: { label: 'Completed', badgeClass: 'badge-completed', icon: '🎉', color: 'text-blue-600' },
}

// ─── Payment Statuses ──────────────────────────────────────────
export const PAYMENT_META = {
  NONE:     { label: 'No Payment',    badgeClass: 'badge-none',     color: 'text-gray-500'   },
  DEPOSIT:  { label: 'Deposit Paid',  badgeClass: 'badge-deposit',  color: 'text-orange-600' },
  FULL:     { label: 'Fully Paid',    badgeClass: 'badge-full',     color: 'text-green-600'  },
  REFUNDED: { label: 'Refunded',      badgeClass: 'badge-cancelled', color: 'text-blue-600'  },
}

// ─── Testimonials ─────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    rating: 5,
    text: 'After 3 sessions of colon therapy at Niramay, my chronic bloating disappeared completely. The staff is incredibly knowledgeable and caring.',
  },
  {
    name: 'Rajesh Patel',
    rating: 5,
    text: "The Panchakarma program changed my life. I lost 8 kg and my energy levels are incredible now. Highly recommend Dr. ji's treatment.",
  },
  {
    name: 'Meera Joshi',
    rating: 5,
    text: 'Excellent clinic with authentic Ayurvedic approach. The booking process was very easy through WhatsApp. Very convenient!',
  },
]

// ─── Colon Therapy Benefits ───────────────────────────────────
export const COLON_BENEFITS = [
  'Removes accumulated toxins (Ama) from the large intestine',
  'Relieves chronic constipation, bloating & gas',
  'Balances Vata dosha for improved digestion',
  'Enhances energy, mental clarity & focus',
  'Supports healthy weight management',
  'Improves skin health and complexion',
  'Strengthens immune system naturally',
  'Preparation for deeper Panchakarma therapies',
]

// ─── How It Works Steps ───────────────────────────────────────
export const COLON_STEPS = [
  {
    step: '01',
    title: 'Consultation',
    desc: 'Prakriti assessment and health goal discussion with our Ayurvedic expert.',
  },
  {
    step: '02',
    title: 'Preparation',
    desc: 'Personalized dietary and lifestyle guidance to prepare your colon (24 hrs before).',
  },
  {
    step: '03',
    title: 'Treatment',
    desc: 'Comfortable 45–60 min session using sterile equipment in a private room.',
  },
  {
    step: '04',
    title: 'Post-Care',
    desc: 'Rest, hydration, and specific dietary recommendations for continued healing.',
  },
]