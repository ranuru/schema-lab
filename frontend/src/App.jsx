import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ChallengeListPage from './pages/ChallengeListPage'
import ChallengePage from './pages/ChallengePage'
import CreateChallengePage from './pages/CreateChallengePage'
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
      <Route path="/challenges/:id" element={<ProtectedRoute><ChallengePage /></ProtectedRoute>} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/challenges" replace />} />
        <Route path="/challenges" element={<ChallengeListPage />} />
        <Route path="/challenges/new" element={<CreateChallengePage />} />
        <Route path="/challenges/:id" element={<ChallengePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  )
}
