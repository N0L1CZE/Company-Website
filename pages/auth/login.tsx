import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    console.log('🔔 handleSubmit fired', { email, password })

    setError(null)
    if (!email || !password) {
      console.log('❗️ prázdný email nebo heslo')
      setError('Vyplň e-mail i heslo')
      return
    }

    let res: Response
    try {
      res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
    } catch (err) {
      console.error('🔥 fetch selhal', err)
      setError('Síťová chyba')
      return
    }

    console.log('🔔 response status', res.status)
    const data = await res.json().catch((e) => {
      console.error('⚠️ chybné JSON:', e)
      return {}
    })
    console.log('🔔 response body', data)

    if (res.ok) {
      console.log('✅ login OK, přesměruji…')
      router.push('/admin')
    } else {
      console.log('❌ login selhal', data.error)
      setError(data.error || 'Přihlášení selhalo')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: 8, fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Přihlášení</h2>
      {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column' }}>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => {
              console.log('🔤 email změněn na', e.target.value)
              setEmail(e.target.value)
            }}
            required
            style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Heslo
          <input
            type="password"
            value={password}
            onChange={(e) => {
              console.log('🔤 password změněn')
              setPassword(e.target.value)
            }}
            required
            style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }}
          />
        </label>

        <button
          type="submit"
          style={{ padding: '0.75rem', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          Přihlásit se
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <Link href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>
          ← Zpět na hlavní stránku
        </Link>
      </p>
    </div>
  )
}
