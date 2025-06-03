import { GetServerSideProps } from 'next'
import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { parse } from 'cookie'
import { verify } from 'jsonwebtoken'
import { prisma } from '../../lib/prisma'
import { useRouter } from 'next/router'

type Reference = {
  id: string
  label: string
  src: string
  category: string
}

const CATEGORIES = [
  { value: 'bytové domy', label: 'Bytové domy' },
  { value: 'komerční',    label: 'Komerční' },
  { value: 'revitalizace',label: 'Revitalizace' },
]

const emptyForm = { id: '', label: '', category: '', src: '' }

export default function AdminReferences({ initialRefs }: { initialRefs: Reference[] }) {
  const [refs, setRefs] = useState<Reference[]>(initialRefs)
  const [form, setForm] = useState({ ...emptyForm })
  const [file, setFile] = useState<File|null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const fetchRefs = async () => {
    setLoading(true)
    const res = await fetch('/api/references', { credentials: 'include' })
    const data = await res.json() as Reference[]
    setRefs(data)
    setLoading(false)
  }

  useEffect(() => {
    setRefs(initialRefs)
  }, [initialRefs])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleFile = (e: ChangeEvent<HTMLInputElement>) =>
    setFile(e.target.files?.[0] ?? null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const url = isEditing ? `/api/references/${form.id}` : '/api/references'
    const method = isEditing ? 'PUT' : 'POST'

    const fd = new FormData()
    fd.append('label', form.label)
    fd.append('category', form.category)
    if (file) fd.append('file', file)

    setLoading(true)
    const res = await fetch(url, {
      method,
      credentials: 'include',
      body: fd,
    })
    setLoading(false)

    if (res.ok) {
      setForm({ ...emptyForm })
      setFile(null)
      setIsEditing(false)
      fetchRefs()
    } else {
      console.error('Chyba:', await res.json())
      alert('Nepodařilo se uložit.')
    }
  }

  const startEdit = (r: Reference) => {
    setForm(r)
    setFile(null)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu smazat?')) return
    await fetch(`/api/references/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    fetchRefs()
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    router.push('/auth/login')
  }

  return (
    <main style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Admin: Reference</h1>
      <button onClick={logout} style={{ float: 'right' }}>Logout</button>

      <form onSubmit={handleSubmit} style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2>{isEditing ? 'Upravit' : 'Nová'} reference</h2>

        <label>
          Název:
          <input name="label" value={form.label} onChange={handleChange} required />
        </label>

        <label>
          Kategorie:
          <select name="category" value={form.category} onChange={handleChange} required>
            <option value="">— vyberte ―</option>
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </label>

        <label>
          Obrázek:
          <input type="file" accept="image/*" onChange={handleFile} {...(!isEditing && { required: true })} />
        </label>
        {isEditing && form.src && (
          <div style={{ fontSize: 12, color: '#666' }}>
            Aktuální obrázek: <code>{form.src}</code>
          </div>
        )}

        <button type="submit" style={{ padding: '0.75rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          {isEditing ? 'Uložit změny' : 'Vytvořit'}
        </button>
        {isEditing && (
          <button type="button" onClick={() => { setIsEditing(false); setForm({ ...emptyForm }); setFile(null) }} style={{ marginLeft: 10 }}>
            Zrušit
          </button>
        )}
      </form>

      {loading ? <p>Načítám…</p> : (
        <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Název</th><th>Obrázek</th><th>Kategorie</th><th>Akce</th>
            </tr>
          </thead>
          <tbody>
            {refs.map(r => (
              <tr key={r.id}>
                <td>{r.label}</td>
                <td><img src={r.src} alt={r.label} style={{ width: 100, objectFit: 'cover' }} /></td>
                <td>{r.category}</td>
                <td>
                  <button onClick={() => startEdit(r)}>Edit</button>{' '}
                  <button onClick={() => handleDelete(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookies = req.headers.cookie ?? ''
  const { auth_token } = parse(cookies)
  if (!auth_token) return { redirect: { destination: '/auth/login', permanent: false } }
  try { verify(auth_token, process.env.JWT_SECRET!) } catch { return { redirect: { destination: '/auth/login', permanent: false } } }

  const refs = await prisma.reference.findMany({ orderBy: { createdAt: 'desc' } })
  return {
    props: {
      initialRefs: refs.map(r => ({ id: r.id, label: r.label, src: r.src, category: r.category }))
    }
  }
}
