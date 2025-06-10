// pages/admin/references.tsx
import { GetServerSideProps } from 'next'
import { parse } from 'cookie'
import { verify } from 'jsonwebtoken'
import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/router'
import { prisma } from '@/lib/prisma'

interface Person {
  id: string
  name: string
}
interface Reference {
  id: string
  label: string
  src: string
  category: string
  persons: Person[]
}

const CATEGORIES = [
  { value: 'Obytné a polyfunkční stavby',         label: 'Obytné a polyfunkční stavby' },
  { value: 'Komerční a administrativní stavby',   label: 'Komerční a administrativní stavby' },
  { value: 'Občanská vybavenost',                 label: 'Občanská vybavenost' },
  { value: 'Zdravotnictví a školství',            label: 'Zdravotnictví a školství' },
  { value: 'Průmyslové a zemědělské stavby',       label: 'Průmyslové a zemědělské stavby' },
  { value: 'Interiér, drobná architektura',       label: 'Interiér, drobná architektura' },
  { value: 'Urbanismus, komunikace',              label: 'Urbanismus, komunikace' },
  { value: 'Ostatní',                             label: 'Ostatní' },
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
  const [refs, setRefs]             = useState<Reference[]>(initialRefs)
  const [form, setForm]             = useState<typeof emptyForm>(emptyForm)
  const [file, setFile]             = useState<File | null>(null)
  const [isEditing, setIsEditing]   = useState(false)
  const [loading, setLoading]       = useState(false)
  const router = useRouter()

  // funkce pro načtení všech referencí
  const fetchRefs = async () => {
    setLoading(true)
    const res = await fetch('/api/references', {
      credentials: 'include',
    })
    if (res.ok) {
      const data = (await res.json()) as Reference[]
      setRefs(data)
    } else {
      console.error('Chyba při načítání referencí:', await res.text())
    }
    setLoading(false)
  }

  // při prvním vykreslení nastavíme refs z initialRefs
  useEffect(() => {
    setRefs(initialRefs)
  }, [initialRefs])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const togglePerson = (id: string) => {
    setForm(f => ({
      ...f,
      personIds: f.personIds.includes(id)
        ? f.personIds.filter(x => x !== id)
        : [...f.personIds, id],
    }))
  }

  const handleFile = (e: ChangeEvent<HTMLInputElement>) =>
    setFile(e.target.files?.[0] ?? null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const url    = isEditing ? `/api/references/${form.id}` : '/api/references'
    const method = isEditing ? 'PUT' : 'POST'
    const fd     = new FormData()
    fd.append('label', form.label)
    fd.append('category', form.category)
    form.personIds.forEach(id => fd.append('personIds', id))
    if (file) fd.append('file', file)

    setLoading(true)
    const res = await fetch(url, {
      method,
      credentials: 'include',
      body: fd,
    })
    setLoading(false)

    if (res.ok) {
      // místo setRefs(updated) znovu načteme celé pole
      await fetchRefs()
      setForm(emptyForm)
      setFile(null)
      setIsEditing(false)
    } else {
      console.error('Chyba při ukládání:', await res.json())
      alert('Chyba při ukládání')
    }
  }

  const startEdit = (r: Reference) => {
    setForm({
      id:        r.id,
      label:     r.label,
      category:  r.category,
      src:       r.src,
      personIds: r.persons.map(p => p.id),
    })
    setFile(null)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu smazat?')) return
    setLoading(true)
    await fetch(`/api/references/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    await fetchRefs()
    setLoading(false)
  }

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    router.push('/auth/login')
  }

  return (
    <main style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Admin: Reference</h1>
      <button onClick={logout} style={{ float: 'right' }}>
        Logout
      </button>

      <form
        onSubmit={handleSubmit}
        style={{
          margin: '2rem 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <h2>{isEditing ? 'Upravit' : 'Nová'} reference</h2>

        <label>
          Název:
          <input
            name="label"
            value={form.label}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Kategorie:
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">— vyberte —</option>
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
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
              />{' '}
              {p.name}
            </label>
          ))}
        </fieldset>

        <label>
          Obrázek:
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            {...(!isEditing && { required: true })}
          />
        </label>
        {isEditing && form.src && (
          <small>Aktuální: {form.src}</small>
        )}

        <button
          type="submit"
          style={{
            padding: '0.75rem 1rem',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          {isEditing ? 'Uložit' : 'Vytvořit'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setForm(emptyForm)
              setFile(null)
              setIsEditing(false)
            }}
          >
            Zrušit
          </button>
        )}
      </form>

      {loading ? (
        <p>Načítám…</p>
      ) : (
        <table
          border={1}
          cellPadding={8}
          style={{ width: '100%', borderCollapse: 'collapse' }}
        >
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
                <td>
                  <img
                    src={r.src}
                    alt={r.label}
                    style={{ width: 100, objectFit: 'cover' }}
                  />
                </td>
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
  if (!cookies.auth_token) {
    return { redirect: { destination: '/auth/login', permanent: false } }
  }
  try {
    verify(cookies.auth_token, process.env.JWT_SECRET!)
  } catch {
    return { redirect: { destination: '/auth/login', permanent: false } }
  }

  const [personsList, refs] = await Promise.all([
    prisma.person.findMany({ orderBy: { name: 'asc' } }),
    prisma.reference.findMany({
      orderBy: { createdAt: 'desc' },
      include: { persons: true },
    }),
  ])

  return {
    props: {
      personsList: personsList.map(p => ({ id: p.id, name: p.name })),
      initialRefs: refs.map(r => ({
        id:       r.id,
        label:    r.label,
        src:      r.src,
        category: r.category,
        persons:  r.persons.map(p => ({ id: p.id, name: p.name })),
      })),
    },
  }
}
