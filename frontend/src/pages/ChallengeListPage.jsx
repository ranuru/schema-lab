import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const DIFFICULTY_COLOR = {
  EASY: '#68d391',
  MEDIUM: '#f6ad55',
  HARD: '#fc8181',
}

const TYPE_LABEL = {
  SCHEMA_MATCHING: 'Matching',
  SCHEMA_VERSIONING: 'Versioning',
}

export default function ChallengeListPage() {
  const [challenges, setChallenges] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/challenges')
      .then(res => setChallenges(res.data))
      .catch(() => setError('Failed to load challenges.'))
  }, [])

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#f7fafc' }}>
          SchemaLab
        </h1>
        <Link to="/about" style={{ fontSize: 13, color: '#718096' }}>About</Link>
      </div>
      <p style={{ color: '#a0aec0', marginBottom: 32 }}>
        Practice schema matching and schema versioning challenges.
      </p>

      {error && <p style={{ color: '#fc8181' }}>{error}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #2d3748', color: '#718096', fontSize: 13, textAlign: 'left' }}>
            <th style={{ padding: '8px 12px' }}>#</th>
            <th style={{ padding: '8px 12px' }}>Title</th>
            <th style={{ padding: '8px 12px' }}>Type</th>
            <th style={{ padding: '8px 12px' }}>Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {challenges.map((c, i) => (
            <tr
              key={c.id}
              style={{ borderBottom: '1px solid #1a202c' }}
            >
              <td style={{ padding: '12px 12px', color: '#718096', fontSize: 14 }}>{i + 1}</td>
              <td style={{ padding: '12px 12px' }}>
                <Link to={`/challenges/${c.id}`} style={{ fontWeight: 500 }}>
                  {c.title}
                </Link>
              </td>
              <td style={{ padding: '12px 12px', color: '#a0aec0', fontSize: 14 }}>
                {TYPE_LABEL[c.type] ?? c.type}
              </td>
              <td style={{ padding: '12px 12px', fontSize: 14 }}>
                <span style={{ color: DIFFICULTY_COLOR[c.difficulty] ?? '#e2e8f0' }}>
                  {c.difficulty}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
