import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

const inputStyle = {
  width: '100%',
  background: '#2d3748',
  border: '1px solid #4a5568',
  borderRadius: 6,
  color: '#f7fafc',
  padding: '8px 12px',
  fontSize: 14,
  boxSizing: 'border-box',
}

const monoStyle = { ...inputStyle, fontFamily: 'monospace', fontSize: 13, minHeight: 120, resize: 'vertical' }

const labelStyle = { display: 'block', color: '#a0aec0', fontSize: 13, marginBottom: 6 }

const fieldStyle = { marginBottom: 20 }

const sectionStyle = {
  border: '1px solid #2d3748',
  borderRadius: 8,
  padding: '16px 16px 8px',
  marginBottom: 12,
  background: '#1a202c',
}

const addBtnStyle = {
  background: 'none',
  border: '1px dashed #4a5568',
  color: '#a0aec0',
  borderRadius: 6,
  padding: '6px 16px',
  fontSize: 13,
  cursor: 'pointer',
  width: '100%',
  marginBottom: 20,
}

const removeBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#fc8181',
  fontSize: 12,
  cursor: 'pointer',
  padding: '0 4px',
}

function emptySchema() {
  return { label: '', format: 'JSON_SCHEMA', content: '' }
}

function emptyTestCase() {
  return { description: '', inputJson: '', expectedJson: '', hidden: false }
}

export default function CreateChallengePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    difficulty: 'EASY',
    type: 'SCHEMA_MATCHING',
    starterCode: '',
    harnessCode: '',
  })
  const [schemas, setSchemas] = useState([emptySchema()])
  const [testCases, setTestCases] = useState([emptyTestCase()])
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function setField(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  function updateSchema(i, field, value) {
    setSchemas(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s))
  }

  function updateTestCase(i, field, value) {
    setTestCases(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t))
  }

  function addSchema() { setSchemas(prev => [...prev, emptySchema()]) }
  function removeSchema(i) { setSchemas(prev => prev.filter((_, idx) => idx !== i)) }

  function addTestCase() { setTestCases(prev => [...prev, emptyTestCase()]) }
  function removeTestCase(i) { setTestCases(prev => prev.filter((_, idx) => idx !== i)) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required.'); return }
    setError(null)
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        schemas: schemas.filter(s => s.label.trim() || s.content.trim()),
        testCases: testCases.filter(t => t.inputJson.trim() || t.expectedJson.trim()),
      }
      const res = await api.post('/challenges', payload)
      navigate(`/challenges/${res.data.id}`)
    } catch {
      setError('Failed to create challenge. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#f7fafc' }}>New Challenge</h1>
        <Link to="/challenges" style={{ fontSize: 13, color: '#718096' }}>Cancel</Link>
      </div>
      <p style={{ color: '#a0aec0', marginBottom: 32 }}>
        Create a new schema challenge for others to solve.
      </p>

      {error && <p style={{ color: '#fc8181', marginBottom: 16 }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* ── Basic fields ── */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Title</label>
          <input style={inputStyle} value={form.title} onChange={setField('title')} placeholder="e.g. Customer vs Person" />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Description</label>
          <textarea
            style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
            value={form.description}
            onChange={setField('description')}
            placeholder="Describe the challenge..."
          />
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Difficulty</label>
            <select style={inputStyle} value={form.difficulty} onChange={setField('difficulty')}>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Type</label>
            <select style={inputStyle} value={form.type} onChange={setField('type')}>
              <option value="SCHEMA_MATCHING">Schema Matching</option>
              <option value="SCHEMA_VERSIONING">Schema Versioning</option>
            </select>
          </div>
        </div>

        {/* ── Schemas ── */}
        <h2 style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Schema Documents</h2>
        {schemas.map((s, i) => (
          <div key={i} style={sectionStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ color: '#718096', fontSize: 13 }}>Schema {i + 1}</span>
              {schemas.length > 1 && (
                <button type="button" style={removeBtnStyle} onClick={() => removeSchema(i)}>Remove</button>
              )}
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
              <div style={{ flex: 2 }}>
                <label style={labelStyle}>Label</label>
                <input
                  style={inputStyle}
                  value={s.label}
                  onChange={e => updateSchema(i, 'label', e.target.value)}
                  placeholder="e.g. Schema A"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Format</label>
                <select style={inputStyle} value={s.format} onChange={e => updateSchema(i, 'format', e.target.value)}>
                  <option value="JSON_SCHEMA">JSON Schema</option>
                  <option value="AVRO">Avro</option>
                  <option value="SQL">SQL</option>
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Content</label>
              <textarea
                style={monoStyle}
                value={s.content}
                onChange={e => updateSchema(i, 'content', e.target.value)}
                placeholder={'{\n  "$schema": "http://json-schema.org/draft-07/schema#",\n  "type": "object",\n  "properties": {}\n}'}
              />
            </div>
          </div>
        ))}
        <button type="button" style={addBtnStyle} onClick={addSchema}>+ Add Schema</button>

        {/* ── Test Cases ── */}
        <h2 style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Test Cases</h2>
        {testCases.map((t, i) => (
          <div key={i} style={sectionStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ color: '#718096', fontSize: 13 }}>Test Case {i + 1}</span>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <label style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={t.hidden}
                    onChange={e => updateTestCase(i, 'hidden', e.target.checked)}
                  />
                  Hidden
                </label>
                {testCases.length > 1 && (
                  <button type="button" style={removeBtnStyle} onClick={() => removeTestCase(i)}>Remove</button>
                )}
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={labelStyle}>Description</label>
              <input
                style={inputStyle}
                value={t.description}
                onChange={e => updateTestCase(i, 'description', e.target.value)}
                placeholder="e.g. Maps customer name to person fullName"
              />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Input JSON</label>
                <textarea
                  style={monoStyle}
                  value={t.inputJson}
                  onChange={e => updateTestCase(i, 'inputJson', e.target.value)}
                  placeholder={'{\n  "customerName": "Alice"\n}'}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Expected JSON</label>
                <textarea
                  style={monoStyle}
                  value={t.expectedJson}
                  onChange={e => updateTestCase(i, 'expectedJson', e.target.value)}
                  placeholder={'{\n  "fullName": "Alice"\n}'}
                />
              </div>
            </div>
          </div>
        ))}
        <button type="button" style={addBtnStyle} onClick={addTestCase}>+ Add Test Case</button>

        {/* ── Code ── */}
        <h2 style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Code Templates</h2>
        <div style={fieldStyle}>
          <label style={labelStyle}>Starter Code</label>
          <textarea
            style={monoStyle}
            value={form.starterCode}
            onChange={setField('starterCode')}
            placeholder="// JavaScript starter code shown to the user"
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Harness Code</label>
          <textarea
            style={monoStyle}
            value={form.harnessCode}
            onChange={setField('harnessCode')}
            placeholder="// JavaScript harness that runs the user's code against test cases"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            background: submitting ? '#4a5568' : '#4299e1',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '10px 24px',
            fontSize: 14,
            fontWeight: 600,
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Creating...' : 'Create Challenge'}
        </button>
      </form>
    </div>
  )
}
