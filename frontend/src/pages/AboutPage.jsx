export default function AboutPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 16px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#f7fafc' }}>
        About SchemaLab
      </h1>
      <p style={{ color: '#a0aec0', marginBottom: 40 }}>
        A practice platform for database schema challenges.
      </p>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>
          What is SchemaLab?
        </h2>
        <p style={{ color: '#a0aec0', lineHeight: 1.7 }}>
          SchemaLab is an interactive coding environment for practising real-world database schema
          problems. Write JavaScript to parse and transform schemas, run against test cases instantly
          in your browser, and submit when all tests pass.
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#e2e8f0', marginBottom: 16 }}>
          Challenge types
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            background: '#1a202c',
            border: '1px solid #2d3748',
            borderRadius: 6,
            padding: '14px 16px',
          }}>
            <div style={{ fontWeight: 600, color: '#f7fafc', marginBottom: 4 }}>Schema Matching</div>
            <p style={{ color: '#a0aec0', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Given two schemas from different sources, write a function that maps fields from one
              to the other. Tests verify that the correct source–target pairs are identified.
            </p>
          </div>
          <div style={{
            background: '#1a202c',
            border: '1px solid #2d3748',
            borderRadius: 6,
            padding: '14px 16px',
          }}>
            <div style={{ fontWeight: 600, color: '#f7fafc', marginBottom: 4 }}>Schema Versioning</div>
            <p style={{ color: '#a0aec0', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Given an older and a newer version of a schema, write a function that computes the
              diff — added, removed, or modified fields — in the expected format.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>
          How it works
        </h2>
        <ol style={{ color: '#a0aec0', lineHeight: 1.9, paddingLeft: 20, margin: 0 }}>
          <li>Pick a challenge from the list.</li>
          <li>Read the description and inspect the schemas.</li>
          <li>Write your solution in the code editor.</li>
          <li>Click <strong style={{ color: '#e2e8f0' }}>Run</strong> — tests execute locally in your browser.</li>
          <li>When all visible tests pass, your submission is saved automatically.</li>
        </ol>
      </section>

      <section>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>
          Difficulty levels
        </h2>
        <div style={{ display: 'flex', gap: 16 }}>
          {[['EASY', '#68d391'], ['MEDIUM', '#f6ad55'], ['HARD', '#fc8181']].map(([label, color]) => (
            <span
              key={label}
              style={{
                fontSize: 12,
                color,
                border: `1px solid ${color}`,
                borderRadius: 4,
                padding: '3px 10px',
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
