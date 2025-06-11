// pages/admin/references.tsx
import { GetServerSideProps } from 'next'
import { parse } from 'cookie'
import { verify } from 'jsonwebtoken'
import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/router'
import { prisma } from '@/lib/prisma'

interface Person   { id: string; name: string }
interface Reference{
  id: string
  label: string
  src: string
  category: string
  persons: Person[]
}

const CATEGORIES = [
  'Obytné a polyfunkční stavby',
  'Komerční a administrativní stavby',
  'Občanská vybavenost',
  'Zdravotnictví a školství',
  'Průmyslové a zemědělské stavby',
  'Interiér, drobná architektura',
  'Urbanismus, komunikace',
  'Ostatní',
]

const emptyForm = {
  id: '',
  label: '',
  category: '',
  src: '',
  personIds: [] as string[],
}

export default function AdminReferences({
  personsList,
  initialRefs,
}: {
  personsList: Person[]
  initialRefs: Reference[]
}) {
  const [refs, setRefs]           = useState<Reference[]>(initialRefs)
  const [form, setForm]           = useState<typeof emptyForm>(emptyForm)
  const [file, setFile]           = useState<File | null>(null)
  const [pickedSrc, setPickedSrc] = useState<string>('')  // ← nový stav
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading]     = useState(false)
  const router = useRouter()

  // Cloudinary
  const CLOUD_NAME    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

  const fetchRefs = async () => {
    setLoading(true)
    const res = await fetch('/api/references', { credentials: 'include' })
    if (res.ok) setRefs(await res.json())
    setLoading(false)
  }

  useEffect(() => setRefs(initialRefs), [initialRefs])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const togglePerson = (id: string) =>
    setForm(f => ({
      ...f,
      personIds: f.personIds.includes(id)
        ? f.personIds.filter(x => x !== id)
        : [...f.personIds, id],
    }))

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    setPickedSrc('')                      // reset volby exist. fotky
    setFile(e.target.files?.[0] ?? null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const hasImg = !!file || !!pickedSrc || isEditing
    if (!form.label || !form.category || form.personIds.length === 0 || !hasImg) {
      alert('Vyplň název, kategorii, osoby a vyber nebo nahraj obrázek')
      return
    }

    setLoading(true)

    // 1) Pokud je zvolen nový soubor, nahrajeme ho
    let src = form.src
    if (file) {
      const data = new FormData()
      data.append('file', file)
      data.append('upload_preset', UPLOAD_PRESET)

      const up = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        { method: 'POST', body: data }
      )
      if (!up.ok) {
        setLoading(false)
        alert('Chyba při nahrávání obrázku')
        return
      }
      const { secure_url } = await up.json()
      src = secure_url
    } else if (pickedSrc) {
      src = pickedSrc     // použij vybraný existující obrázek
    }

    // 2) JSON payload
    const payload = { label: form.label, category: form.category, personIds: form.personIds, src }
    const url     = isEditing ? `/api/references/${form.id}` : '/api/references'
    const method  = isEditing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setLoading(false)

    if (res.ok) {
      await fetchRefs()
      setForm(emptyForm)
      setFile(null)
      setPickedSrc('')
      setIsEditing(false)
    } else {
      console.error('Chyba při ukládání:', await res.json())
      alert('Chyba při ukládání')
    }
  }

  const startEdit = (r: Reference) => {
    setForm({
      id: r.id,
      label: r.label,
      category: r.category,
      src: r.src,
      personIds: r.persons.map(p => p.id),
    })
    setFile(null)
    setPickedSrc('')
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu smazat?')) return
    setLoading(true)
    await fetch(`/api/references/${id}`, { method: 'DELETE', credentials: 'include' })
    await fetchRefs()
    setLoading(false)
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
            <option value="">— vyberte —</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <fieldset>
          <legend>Osoby (1–4):</legend>
          {personsList.map(p => (
            <label key={p.id} style={{ display: 'block' }}>
              <input
                type="checkbox"
                checked={form.personIds.includes(p.id)}
                onChange={() => togglePerson(p.id)}
              /> {p.name}
            </label>
          ))}
        </fieldset>

        {/* Upload nového souboru */}
        <label>
          Nový obrázek:
          <input type="file" accept="image/*" onChange={handleFile} />
        </label>

        {/* Výběr existující fotky */}
        <label>
          Existující fotka:
          <select
            value={pickedSrc}
            onChange={e => { setPickedSrc(e.target.value); setFile(null) }}
          >
            <option value="">— žádná (nahraj nový) —</option>
            {refs.map(r => (
              <option key={r.id} value={r.src}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        {pickedSrc && (
          <small style={{ display: 'block' }}>
            Náhled:&nbsp;
            <img src={pickedSrc} alt="náhled" style={{ width: 120, objectFit: 'cover' }} />
          </small>
        )}

        {isEditing && form.src && !file && !pickedSrc && (
          <small>Aktuální: {form.src}</small>
        )}

        <button type="submit" style={{ padding: '0.75rem 1rem', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          {isEditing ? 'Uložit' : 'Vytvořit'}
        </button>

        {isEditing && (
          <button type="button" onClick={() => { setForm(emptyForm); setFile(null); setPickedSrc(''); setIsEditing(false) }}>
            Zrušit
          </button>
        )}
      </form>

      {loading ? (
        <p>Načítám…</p>
      ) : (
        <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Název</th>
              <th>Obrázek</th>
              <th>Kategorie</th>
              <th>Osoby</th>
              <th>Akce</th>
            </tr>
          </thead>
          <tbody>
            {refs.map(r => (
              <tr key={r.id}>
                <td>{r.label}</td>
                <td><img src={r.src} alt={r.label} style={{ width: 100, objectFit: 'cover' }} /></td>
                <td>{r.category}</td>
                <td>{r.persons.map(p => p.name).join(', ')}</td>
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
  const cookies = parse(req.headers.cookie ?? '')
  if (!cookies.auth_token) return { redirect: { destination: '/auth/login', permanent: false } }

  try {
    verify(cookies.auth_token, process.env.JWT_SECRET!)
  } catch {
    return { redirect: { destination: '/auth/login', permanent: false } }
  }

  const [personsList, refs] = await Promise.all([
    prisma.person.findMany({ orderBy: { name: 'asc' } }),
    prisma.reference.findMany({ orderBy: { createdAt: 'desc' }, include: { persons: true } }),
  ])

  return {
    props: {
      personsList: personsList.map(p => ({ id: p.id, name: p.name })),
      initialRefs : refs.map(r => ({
        id:       r.id,
        label:    r.label,
        src:      r.src,
        category: r.category,
        persons:  r.persons.map(p => ({ id: p.id, name: p.name })),
      })),
    },
  }
}
