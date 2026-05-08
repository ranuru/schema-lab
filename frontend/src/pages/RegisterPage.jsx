import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register(username, password)
      navigate('/challenges')
    } catch (err) {
      const status = err?.response?.status
      if (status === 500 || status === 409) {
        setError('Username already taken.')
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: '100%',
        maxWidth: 360,
        padding: '32px 28px',
        background: '#1a202c',
        border: '1px solid #2d3748',
        borderRadius: 8,
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f7fafc', marginBottom: 6 }}>
          Create account
        </h1>
        <p style={{ fontSize: 13, color: '#718096', marginBottom: 24 }}>
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#a0aec0', marginBottom: 6 }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#a0aec0', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <p style={{ fontSize: 13, color: '#fc8181', margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 0',
              background: loading ? '#2d3748' : '#3182ce',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 4,
            }}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  background: '#0f1117',
  border: '1px solid #2d3748',
  borderRadius: 6,
  color: '#f7fafc',
  fontSize: 14,
  outline: 'none',
}
