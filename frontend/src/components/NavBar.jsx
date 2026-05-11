import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      height: 48,
      borderBottom: '1px solid #2d3748',
      flexShrink: 0,
    }}>
      <Link to="/challenges" style={{ fontWeight: 700, fontSize: 15, color: '#f7fafc' }}>
        SchemaLab
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <Link to="/how-to" style={{ fontSize: 13, color: '#718096' }}>How To</Link>
        <Link to="/about" style={{ fontSize: 13, color: '#718096' }}>About</Link>
        {user && (
          <>
            <span style={{ fontSize: 13, color: '#a0aec0' }}>{user.username}</span>
            <button
              onClick={handleLogout}
              style={{
                fontSize: 13,
                color: '#718096',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
