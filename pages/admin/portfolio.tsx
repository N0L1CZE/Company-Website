// pages/admin/portfolio.tsx
'use client'

import { useEffect, useState, ChangeEvent, FormEvent } from 'react'

/* ---------- typy ---------- */
type Person = { id: string; name: string }

/**
 * 2025-06: Portfolio má už novou M:N vazbu (`persons`).
 * Staré záznamy ale mohou stále obsahovat singulární `person`.
 * Proto necháváme obě vlastnosti **volitelné**.
 */
type Item = {
  id: number
  title: string
  pdfUrl: string
  persons?: Person[]  // nový formát (M:N)
  person?:  Person    // starý formát (1:N)
}

/* ---------- komponenta ---------- */
export default function AdminPortfolio() {
  const [persons, setPersons] = useState<Person[]>([])
  const [items,   setItems]   = useState<Item[]>([])
  const [files,   setFiles]   = useState<Record<string, File | null>>({})
  const [titles,  setTitles]  = useState<Record<string, string>>({})

  /* ------------ načtení dat ------------ */
  useEffect(() => {
    ;(async () => {
      const [pRes, iRes] = await Promise.all([
        fetch('/api/persons'),
        fetch('/api/portfolio'),
      ])
      if (pRes.ok) setPersons(await pRes.json())
      if (iRes.ok) setItems(await iRes.json())
    })()
  }, [])

  /* ------------ helpery ------------ */
  const handleFileChange = (pid: string) => (e: ChangeEvent<HTMLInputElement>) =>
    setFiles(f => ({ ...f, [pid]: e.target.files?.[0] || null }))

  const handleTitleChange = (pid: string) => (e: ChangeEvent<HTMLInputElement>) =>
    setTitles(t => ({ ...t, [pid]: e.target.value }))

  /* ------------ submit ------------ */
  const handleSubmit = (pid: string) => async (e: FormEvent) => {
    e.preventDefault()
    const file  = files[pid]
    const title = titles[pid]
    if (!file || !title) {
      alert('Vyplň název i PDF.')
      return
    }

    const fd = new FormData()
    fd.append('personIds', pid)    // M:N: posíláme pole ids (zde jedno)
    fd.append('title', title)
    fd.append('pdf', file)

    const res = await fetch('/api/portfolio', { method: 'POST', body: fd })
    if (!res.ok) {
      alert('Chyba při ukládání.')
      return
    }

    const newItem: Item = await res.json()
    setItems(it => [...it, newItem])
    setTitles(t => ({ ...t, [pid]: '' }))
    setFiles(f => ({ ...f, [pid]: null }))
  }

  /* ------------ delete ------------ */
  const handleDelete = (id: number) => async () => {
    if (!confirm('Opravdu smazat PDF?')) return
    const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' })
    if (res.ok) setItems(it => it.filter(i => i.id !== id))
  }

  /* ------------ render ------------ */
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Správa portfolia</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {persons.map(person => (
          <div key={person.id} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">{person.name}</h2>

            {/* seznam PDF patřících této osobě */}
            <ul className="space-y-3 mb-4">
              {items
                .filter(item =>
                  Array.isArray(item.persons)
                    ? item.persons.some(p => p.id === person.id) // nový formát
                    : item.person?.id === person.id             // starý formát
                )
                .map(item => (
                  <li key={item.id} className="flex justify-between items-center">
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {item.title}
                    </a>
                    <button
                      onClick={handleDelete(item.id)}
                      className="text-red-500"
                    >
                      Smazat
                    </button>
                  </li>
                ))}
            </ul>

            {/* formulář pro přidání PDF */}
            <form onSubmit={handleSubmit(person.id)} className="space-y-2">
  {/* název */}
  <input
    type="text"
    placeholder="Název PDF"
    value={titles[person.id] || ''}
    onChange={handleTitleChange(person.id)}
    className="w-full border rounded p-1"
  />

  {/* --- nový, viditelný file-input --- */}
  <input
    name="pdf"
    type="file"
    accept="application/pdf"
    onChange={handleFileChange(person.id)}
    /* ↓ tyto Tailwind utility zajistí, že je prvek blokový a má styl */
    className="
      block w-full text-sm
      file:mr-4 file:rounded file:border-0
      file:bg-blue-600 file:px-4 file:py-2 file:text-white
      hover:file:bg-blue-700
    "
  />
                <button
    type="submit"
    className="w-full mt-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
  >
    Přidat
  </button>
</form>
          </div>
        ))}
      </div>
    </main>
  )
}
