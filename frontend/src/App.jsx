// import { useEffect } from 'react'
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import { Toaster } from 'react-hot-toast'
// import { AuthProvider, useAuth } from './context/AuthContext'
// import Lenis from 'lenis'
// import gsap from 'gsap'
// import ScrollTrigger from 'gsap/ScrollTrigger'

// import Home      from './pages/Home'
// import Book      from './pages/Book'
// import Status    from './pages/Status'
// import Feedback from './pages/Feedback'
// import Login     from './pages/admin/Login'
// import Dashboard from './pages/admin/Dashboard'

// gsap.registerPlugin(ScrollTrigger)

// // ─── Protected Route wrapper ──────────────────────────────────
// function ProtectedRoute({ children }) {
//   const { isLoggedIn } = useAuth()
//   return isLoggedIn ? children : <Navigate to="/admin/login" replace />
// }

// // ─── App Routes ───────────────────────────────────────────────
// function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/"             element={<Home />} />
//       <Route path="/book"         element={<Book />} />
//       <Route path="/status"       element={<Status />} />
//       <Route path="/feedback"     element={<Feedback />} />
//       <Route path="/admin/login"  element={<Login />} />
//       <Route
//         path="/admin/dashboard"
//         element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />
//       {/* Catch-all → Home */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   )
// }

// export default function App() {
//   useEffect(() => {
//     // Initialize Lenis for global smooth scrolling
//     const lenis = new Lenis({
//       duration: 1.2,
//       easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
//       smoothWheel: true,
//       smoothTouch: false,
//     })

//     // Synchronize Lenis with GSAP ScrollTrigger
//     lenis.on('scroll', ScrollTrigger.update)

//     gsap.ticker.add((time) => {
//       lenis.raf(time * 1000)
//     })

//     gsap.ticker.lagSmoothing(0)

//     return () => {
//       lenis.destroy()
//     }
//   }, [])

//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <AppRoutes />
//         <Toaster
//           position="top-right"
//           toastOptions={{
//             style: {
//               background: '#1e4634',
//               color: '#faf3e4',
//               borderRadius: '12px',
//               fontFamily: 'Inter, sans-serif',
//               fontSize: '14px',
//             },
//           }}
//         />
//       </AuthProvider>
//     </BrowserRouter>
//   )
// }



import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'
import Home from './pages/Home'
import Book from './pages/Book'
import Status from './pages/Status'
import Feedback from './pages/Feedback'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import WhatsAppWidget from './components/WhatsAppWidget'

// ─── Scroll to top on every route change ─────────────────────
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/admin/login" replace />
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<Book />} />
        <Route path="/status" element={<Status />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <WhatsAppWidget />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e4634',
              color: '#faf3e4',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}