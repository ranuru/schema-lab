import { useState } from 'react'
import NavBar from '../components/NavBar'
import { Link } from 'react-router-dom'

const box = {
  background: '#1a202c',
  border: '1px solid #2d3748',
  borderRadius: 6,
  padding: '14px 16px',
}

const pre = {
  background: '#0d1117',
  border: '1px solid #2d3748',
  borderRadius: 4,
  padding: 10,
  fontSize: 12,
  color: '#e2e8f0',
  margin: 0,
  overflowX: 'auto',
  whiteSpace: 'pre',
}

const sectionTitle = {
  fontSize: 16,
  fontWeight: 600,
  color: '#e2e8f0',
  marginBottom: 12,
}

const muted = { color: '#a0aec0', lineHeight: 1.7 }
const mutedSm = { color: '#a0aec0', lineHeight: 1.7, fontSize: 14 }

function LangSwitcher({ lang, setLang }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
      {['javascript', 'python'].map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            padding: '4px 12px',
            fontSize: 12,
            background: lang === l ? '#3182ce' : 'transparent',
            color: lang === l ? '#fff' : '#718096',
            border: '1px solid #2d3748',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          {l === 'javascript' ? 'JavaScript' : 'Python'}
        </button>
      ))}
    </div>
  )
}

const matchingSolutions = {
  javascript: `function matchSchemas(schemaA, schemaB) {
  return [
    { source: 'order_id',      target: 'orderId'      },
    { source: 'client_name',   target: 'customerName' },
    { source: 'dispatch_date', target: 'shipDate'     },
    { source: 'total_cost',    target: 'amount'       },
  ]
}`,
  python: `def match_schemas(schema_a, schema_b):
    return [
        { 'source': 'order_id',      'target': 'orderId'      },
        { 'source': 'client_name',   'target': 'customerName' },
        { 'source': 'dispatch_date', 'target': 'shipDate'     },
        { 'source': 'total_cost',    'target': 'amount'       },
    ]`,
}

const versioningSolutions = {
  javascript: `function migrate(record) {
  const [username, domain] = record.displayName.split('@')
  return {
    id: record.id,
    username,
    domain,
    role: record.role,
  }
}`,
  python: `def migrate(record):
    username, domain = record['displayName'].split('@')
    return {
        'id':       record['id'],
        'username': username,
        'domain':   domain,
        'role':     record['role'],
    }`,
}

export default function HowToPage() {
  const [matchLang, setMatchLang] = useState('javascript')
  const [versionLang, setVersionLang] = useState('javascript')

  return (
        <>
          <NavBar />
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 16px' }}>   
      <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 24, marginBottom: 8, color: '#f7fafc' }}>
        How To
      </h1>
      <p style={{ ...muted, marginBottom: 40 }}>
        A quick introduction to schema matching and schema versioning, with worked examples.
      </p>

      {/* ── SCHEMA MATCHING ── */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={sectionTitle}>Schema Matching</h2>
        <p style={{ ...muted, marginBottom: 16 }}>
          Schema matching is the problem of identifying which fields in one schema correspond
          to fields in another, even when they use different names or structures. Your function
          receives both schemas and should return an array of <code style={{ color: '#e2e8f0', background: '#2d3748', padding: '1px 5px', borderRadius: 3 }}>{'{ source, target }'}</code> pairs.
        </p>

        {/* Schemas side by side */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            {
              label: 'Schema A — Warehouse',
              fields: ['order_id', 'client_name', 'dispatch_date', 'total_cost'],
            },
            {
              label: 'Schema B — Finance',
              fields: ['orderId', 'customerName', 'shipDate', 'amount'],
            },
          ].map(({ label, fields }) => (
            <div key={label} style={{ flex: 1, minWidth: 180, ...box }}>
              <div style={{ fontWeight: 600, color: '#f7fafc', marginBottom: 10, fontSize: 13 }}>{label}</div>
              {fields.map(f => (
                <div key={f} style={{
                  fontFamily: 'monospace', fontSize: 13, color: '#a0aec0',
                  padding: '3px 0', borderBottom: '1px solid #2d3748',
                }}>{f}</div>
              ))}
            </div>
          ))}
        </div>

        {/* Expected output */}
        <div style={{ ...box, marginBottom: 16 }}>
          <div style={{ fontWeight: 600, color: '#f7fafc', marginBottom: 10, fontSize: 13 }}>Expected output</div>
          {[
            ['order_id', 'orderId'],
            ['client_name', 'customerName'],
            ['dispatch_date', 'shipDate'],
            ['total_cost', 'amount'],
          ].map(([src, tgt]) => (
            <div key={src} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0', borderBottom: '1px solid #2d3748' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#a0aec0', flex: 1 }}>{src}</span>
              <span style={{ color: '#4a5568', fontSize: 12 }}>→</span>
              <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#a0aec0', flex: 1 }}>{tgt}</span>
            </div>
          ))}
        </div>

        {/* Example solution */}
        <div style={{ ...box, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontWeight: 600, color: '#f7fafc', fontSize: 13 }}>Example solution</div>
            <LangSwitcher lang={matchLang} setLang={setMatchLang} />
          </div>
          <pre style={pre}>{matchingSolutions[matchLang]}</pre>
        </div>
        <p style={mutedSm}>
          In real challenges the mapping won't be this obvious. Fields may be abbreviated,
          reordered, or use different conventions. Use the schema descriptions and field names
          to reason about which fields represent the same concept.
        </p>
      </section>

      {/* ── SCHEMA VERSIONING ── */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={sectionTitle}>Schema Versioning</h2>
        <p style={{ ...muted, marginBottom: 16 }}>
          Schema versioning is about migrating records when a schema evolves over time.
          Your function receives a single record in the old format and should return
          it transformed into the new format.
        </p>

        {/* Schemas side by side */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'Version 1', fields: ['id', 'displayName', 'role'] },
            { label: 'Version 2', fields: ['id', 'username', 'domain', 'role'] },
          ].map(({ label, fields }) => (
            <div key={label} style={{ flex: 1, minWidth: 180, ...box }}>
              <div style={{ fontWeight: 600, color: '#f7fafc', marginBottom: 10, fontSize: 13 }}>{label}</div>
              {fields.map(f => (
                <div key={f} style={{
                  fontFamily: 'monospace', fontSize: 13, color: '#a0aec0',
                  padding: '3px 0', borderBottom: '1px solid #2d3748',
                }}>{f}</div>
              ))}
            </div>
          ))}
        </div>

        {/* Input / output */}
        <div style={{ ...box, marginBottom: 16 }}>
          <div style={{ fontWeight: 600, color: '#f7fafc', marginBottom: 10, fontSize: 13 }}>Example record migration</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              {
                label: 'Input (v1)',
                code: `{
  "id": 1,
  "displayName": "johndoe@company.com",
  "role": "admin"
}`,
              },
              {
                label: 'Output (v2)',
                code: `{
  "id": 1,
  "username": "johndoe",
  "domain": "company.com",
  "role": "admin"
}`,
              },
            ].map(({ label, code }) => (
              <div key={label} style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 12, color: '#718096', marginBottom: 6 }}>{label}</div>
                <pre style={pre}>{code}</pre>
              </div>
            ))}
          </div>
        </div>

        {/* Example solution */}
        <div style={{ ...box, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontWeight: 600, color: '#f7fafc', fontSize: 13 }}>Example solution</div>
            <LangSwitcher lang={versionLang} setLang={setVersionLang} />
          </div>
          <pre style={pre}>{versioningSolutions[versionLang]}</pre>
        </div>
        <p style={mutedSm}>
          Challenges may involve multiple transformations at once, such as merging values, 
          changing data types, or deriving new fields from existing ones.
        </p>
      </section>

      {/* CTA */}
      <section>
        <h2 style={sectionTitle}>Ready to start?</h2>
        <Link
          to="/challenges"
          style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: '#3182ce',
            color: '#fff',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Browse challenges →
        </Link>
      </section>
    </div>
    </>
  )
}