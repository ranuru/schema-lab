import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import api from '../api/axios'

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

function sortBySource(arr) {
  return [...arr].sort((a, b) => String(a.source).localeCompare(String(b.source)))
}

function runWorker(harnessCode, userCode, input) {
  return new Promise((resolve) => {
    const blob = new Blob([harnessCode], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url)

    const timeout = setTimeout(() => {
      worker.terminate()
      URL.revokeObjectURL(url)
      resolve({ ok: false, error: 'Timeout (5s)' })
    }, 5000)

    worker.onmessage = (e) => {
      clearTimeout(timeout)
      worker.terminate()
      URL.revokeObjectURL(url)
      resolve(e.data)
    }

    worker.onerror = (e) => {
      clearTimeout(timeout)
      worker.terminate()
      URL.revokeObjectURL(url)
      resolve({ ok: false, error: e.message })
    }

    worker.postMessage({ userCode, input })
  })
}

function compareResult(challengeType, actual, expected) {
  if (challengeType === 'SCHEMA_MATCHING') {
    return deepEqual(sortBySource(actual), sortBySource(expected))
  }
  return deepEqual(actual, expected)
}

export default function ChallengePage() {
  const { id } = useParams()
  const [challenge, setChallenge] = useState(null)
  const [error, setError] = useState(null)
  const [activeSchema, setActiveSchema] = useState(0)
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState(null)
  const codeRef = useRef('')

  useEffect(() => {
    api.get(`/challenges/${id}`)
      .then(res => {
        setChallenge(res.data)
        codeRef.current = res.data.starterCode
      })
      .catch(() => setError('Failed to load challenge.'))
  }, [id])

  async function handleRun() {
    if (!challenge) return
    setRunning(true)
    setResults(null)

    const visibleTests = challenge.testCases.filter(tc => !tc.hidden)
    const testResults = []

    for (const tc of visibleTests) {
      const input = JSON.parse(tc.inputJson)
      const expected = JSON.parse(tc.expectedJson)
      const response = await runWorker(challenge.harnessCode, codeRef.current, input)

      if (!response.ok) {
        testResults.push({ description: tc.description, pass: false, actual: null, expected, error: response.error })
      } else {
        const pass = compareResult(challenge.type, response.result, expected)
        testResults.push({ description: tc.description, pass, actual: response.result, expected })
      }
    }

    setResults(testResults)
    setRunning(false)

    const allPass = testResults.every(r => r.pass)
    if (allPass) {
      api.post('/submissions', {
        challengeId: challenge.id,
        code: codeRef.current,
        status: 'PASS',
        testResults: JSON.stringify(testResults),
      }).catch(() => {})
    }
  }

  if (error) return <div style={{ padding: 40, color: '#fc8181' }}>{error}</div>
  if (!challenge) return <div style={{ padding: 40, color: '#a0aec0' }}>Loading…</div>

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left column */}
      <div style={{
        width: '60%',
        overflowY: 'auto',
        padding: '32px 28px',
        borderRight: '1px solid #2d3748',
      }}>
        <Link to="/challenges" style={{ fontSize: 13, color: '#718096' }}>← Back</Link>

        <div style={{ marginTop: 16, marginBottom: 4, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: difficultyColor(challenge.difficulty), border: `1px solid ${difficultyColor(challenge.difficulty)}`, borderRadius: 4, padding: '2px 8px' }}>
            {challenge.difficulty}
          </span>
          <span style={{ fontSize: 12, color: '#718096', border: '1px solid #2d3748', borderRadius: 4, padding: '2px 8px' }}>
            {typeLabel(challenge.type)}
          </span>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, marginTop: 12, marginBottom: 16, color: '#f7fafc' }}>
          {challenge.title}
        </h1>

        <p style={{ color: '#a0aec0', lineHeight: 1.7, marginBottom: 28 }}>
          {challenge.description}
        </p>

        {/* Schema viewer */}
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 0 }}>
            {challenge.schemas.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveSchema(i)}
                style={{
                  padding: '6px 16px',
                  fontSize: 13,
                  background: activeSchema === i ? '#2d3748' : 'transparent',
                  color: activeSchema === i ? '#f7fafc' : '#718096',
                  border: '1px solid #2d3748',
                  borderBottom: activeSchema === i ? '1px solid #2d3748' : '1px solid #2d3748',
                  borderRadius: '4px 4px 0 0',
                  cursor: 'pointer',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <pre style={{
            background: '#1a202c',
            border: '1px solid #2d3748',
            borderRadius: '0 4px 4px 4px',
            padding: 16,
            fontSize: 13,
            lineHeight: 1.6,
            color: '#e2e8f0',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
          }}>
            {formatJson(challenge.schemas[activeSchema]?.content)}
          </pre>
        </div>
      </div>

      {/* Right column */}
      <div style={{ width: '40%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            defaultValue={challenge.starterCode}
            theme="vs-dark"
            onChange={value => { codeRef.current = value ?? '' }}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              tabSize: 2,
            }}
          />
        </div>

        <div style={{ borderTop: '1px solid #2d3748', padding: 16 }}>
          <button
            onClick={handleRun}
            disabled={running}
            style={{
              width: '100%',
              padding: '10px 0',
              background: running ? '#2d3748' : '#3182ce',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: running ? 'not-allowed' : 'pointer',
              marginBottom: results ? 16 : 0,
            }}
          >
            {running ? 'Running…' : 'Run'}
          </button>

          {results && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
              {results.map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: r.pass ? '#1a2e1a' : '#2e1a1a',
                    border: `1px solid ${r.pass ? '#276749' : '#822727'}`,
                    borderRadius: 6,
                    padding: '10px 12px',
                    fontSize: 13,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: r.pass ? 0 : 8 }}>
                    <span style={{ color: r.pass ? '#68d391' : '#fc8181' }}>
                      {r.pass ? '✓' : '✗'}
                    </span>
                    <span style={{ color: '#e2e8f0' }}>{r.description}</span>
                  </div>
                  {!r.pass && (
                    <>
                      {r.error && (
                        <div style={{ color: '#fc8181', fontFamily: 'monospace', fontSize: 12 }}>
                          Error: {r.error}
                        </div>
                      )}
                      {!r.error && (
                        <>
                          <div style={{ color: '#718096', fontSize: 12, marginBottom: 2 }}>
                            Expected: <span style={{ color: '#a0aec0' }}>{JSON.stringify(r.expected)}</span>
                          </div>
                          <div style={{ color: '#718096', fontSize: 12 }}>
                            Got: <span style={{ color: '#a0aec0' }}>{JSON.stringify(r.actual)}</span>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
              {results.every(r => r.pass) && (
                <div style={{ color: '#68d391', fontSize: 13, textAlign: 'center', paddingTop: 4 }}>
                  All tests passed — submission saved!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function difficultyColor(d) {
  return { EASY: '#68d391', MEDIUM: '#f6ad55', HARD: '#fc8181' }[d] ?? '#e2e8f0'
}

function typeLabel(t) {
  return { SCHEMA_MATCHING: 'Matching', SCHEMA_VERSIONING: 'Versioning' }[t] ?? t
}

function formatJson(str) {
  if (!str) return ''
  try { return JSON.stringify(JSON.parse(str), null, 2) } catch { return str }
}
