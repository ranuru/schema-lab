import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ChallengeListPage from './pages/ChallengeListPage'
import ChallengePage from './pages/ChallengePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/challenges" replace />} />
        <Route path="/challenges" element={<ChallengeListPage />} />
        <Route path="/challenges/:id" element={<ChallengePage />} />
      </Routes>
    </BrowserRouter>
  )
}
