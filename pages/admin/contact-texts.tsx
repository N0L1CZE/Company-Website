import { GetServerSideProps } from 'next'
import { useState, ChangeEvent, FormEvent } from 'react'
import { parse } from 'cookie'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { useRouter } from 'next/router'

interface ContactText { id: string; key: string; content: string }

export default function AdminContactTexts({ initial }: { initial: ContactText[] }) {
  const [items, setItems] = useState<ContactText[]>(initial)
  const [editing, setEditing] = useState<ContactText | null>(null)
  const [form, setForm] = useState({ key: '', content: '' })
  const router = useRouter()

  const handleChange = (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const isNew = !editing
    const url = isNew ? '/api/contact-texts' : `/api/contact-texts/${editing!.id}`
    const method = isNew ? 'POST' : 'PUT'
    const payload = isNew ? form : { content: form.content }
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      alert('Chyba při ukládání')
      return
    }
    const data = await res.json()
    setItems(isNew
      ? [...items, data]
      : items.map(i => i.id === data.id ? data : i))
    setEditing(null)
    setForm({ key: '', content: '' })
  }

  const onEdit = (item: ContactText) => {
    setEditing(item)
    setForm({ key: item.key, content: item.content })
  }

  const onDelete = async (id: string) => {
    if (!confirm('Opravdu smazat?')) return
    await fetch(`/api/contact-texts/${id}`, { method: 'DELETE' })
    setItems(items.filter(i => i.id !== id))
  }

  const logout = async () => {
    await fetch('/api/auth/logout',{ method:'POST', credentials:'include' })
    router.push('/auth/login')
  }

  return (
    <main style={{ padding:20 }}>
      <h1>Admin: Texty Kontakty</h1>
      <button onClick={logout} style={{ float:'right' }}>Logout</button>

      <form onSubmit={onSubmit} style={{ margin:'1rem 0', display:'flex', gap:'1rem' }}>
        <input
          name="key"
          placeholder="Key"
          value={form.key}
          onChange={handleChange}
          disabled={!!editing}
          required={!editing}
        />
        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          required
        />
        <button type="submit">{editing ? 'Uložit' : 'Přidat'}</button>
        {editing && <button type="button" onClick={() => {
          setEditing(null)
          setForm({ key:'', content:'' })
        }}>Zrušit</button>}
      </form>

      <table border={1} cellPadding={8} style={{ width:'100%' }}>
        <thead>
          <tr><th>Key</th><th>Content</th><th>Akce</th></tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td>{i.key}</td>
              <td>{i.content}</td>
              <td>
                <button onClick={() => onEdit(i)}>Edit</button>{' '}
                <button onClick={() => onDelete(i.id)}>Del</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookies = parse(req.headers.cookie ?? '')
  if (!cookies.auth_token) return { redirect:{ destination:'/auth/login', permanent:false } }
  try { verify(cookies.auth_token, process.env.JWT_SECRET!) }
  catch { return { redirect:{ destination:'/auth/login', permanent:false } } }

  const initial = await prisma.contactText.findMany({ orderBy: { key:'asc' } })
  return { props: { initial } }
}
