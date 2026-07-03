export const dynamic = 'force-dynamic'

interface PropertySummary {
  id: number
  slug: string
  nombre: string
  ciudad: string
  pais: string
  precio: string
  activa: number
  hero_headline: string
  poster_url: string
}

export default async function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  let properties: PropertySummary[] = []
  let error = ''

  try {
    const res = await fetch(`${apiUrl}/propiedades`, {
      next: { revalidate: 0 },
    })
    if (res.ok) {
      properties = await res.json()
    } else {
      error = `Backend respondió con status ${res.status}`
    }
  } catch {
    error = 'No se pudo conectar al backend. Puede estar dormido (Render free plan) — recarga en 30 segundos.'
  }

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '3rem 2rem',
      color: '#1a1a1a',
    }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
          Larum Studio — Propiedades
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.4rem' }}>
          Panel interno · Landings en producción
        </p>
      </div>

      {error && (
        <div style={{
          padding: '1rem 1.25rem',
          background: '#fff8f8',
          border: '1px solid #f0d0d0',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: '#a33',
          marginBottom: '2rem',
          lineHeight: 1.5,
        }}>
          {error}
        </div>
      )}

      {properties.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {properties.map((p) => (
            <a
              key={p.id}
              href={`/p/${encodeURIComponent(p.slug)}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.25rem 1.5rem',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'inherit',
                background: '#fff',
              }}
            >
              <div>
                <div style={{ fontWeight: 500, fontSize: '1rem' }}>{p.nombre}</div>
                <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.3rem' }}>
                  {p.ciudad}, {p.pais}
                  <span style={{ margin: '0 0.5rem', opacity: 0.3 }}>·</span>
                  <span style={{ color: p.activa ? '#2a7' : '#b88' }}>
                    {p.activa ? '● Activa' : '○ Inactiva'}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '1rem' }}>
                {p.precio && (
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{p.precio}</div>
                )}
                <div style={{ fontSize: '0.7rem', color: '#bbb', marginTop: '0.25rem', fontFamily: 'monospace' }}>
                  /p/{p.slug}
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : !error ? (
        <p style={{ color: '#999', fontSize: '0.85rem' }}>No hay propiedades en el sistema.</p>
      ) : null}

      <div style={{
        marginTop: '3rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid #eee',
        fontSize: '0.7rem',
        color: '#ccc',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>Backend: {process.env.NEXT_PUBLIC_API_URL || 'no configurado'}</span>
        <span>{properties.length} propiedad{properties.length !== 1 ? 'es' : ''}</span>
      </div>
    </div>
  )
}
