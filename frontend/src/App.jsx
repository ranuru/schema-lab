import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ChallengeListPage from './pages/ChallengeListPage'
import ChallengePage from './pages/ChallengePage'
import CreateChallengePage from './pages/CreateChallengePage'
import EditChallengePage from './pages/EditChallengePage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/challenges" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/challenges" element={<ProtectedRoute><ChallengeListPage /></ProtectedRoute>} />
      <Route path="/challenges/new" element={<ProtectedRoute><CreateChallengePage /></ProtectedRoute>} />
      <Route path="/challenges/:id/edit" element={<ProtectedRoute><EditChallengePage /></ProtectedRoute>} />
      <Route path="/challenges/:id" element={<ProtectedRoute><ChallengePage /></ProtectedRoute>} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
