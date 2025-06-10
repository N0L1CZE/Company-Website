// pages/admin/portfolio.tsx
'use client'
import { useEffect, useState, ChangeEvent, FormEvent } from 'react'

type Person = { id: string; name: string }
type Item   = { id: number; title: string; pdfUrl: string; person: Person }

export default function AdminPortfolio() {
  const [persons, setPersons] = useState<Person[]>([])
  const [items, setItems]     = useState<Item[]>([])
  const [files, setFiles]     = useState<Record<string, File | null>>({})
  const [titles, setTitles]   = useState<Record<string, string>>({})

  useEffect(() => {
    async function load() {
      const [pRes, iRes] = await Promise.all([
        fetch('/api/persons'),
        fetch('/api/portfolio'),
      ])
      if (!pRes.ok || !iRes.ok) {
        console.error('Chyba při načítání osob nebo portfolia')
        return
      }
      const personsData: Person[] = await pRes.json()
      const itemsData: Item[]     = await iRes.json()
      setPersons(personsData)
      setItems(itemsData)
    }
    load()
  }, [])

  const handleFileChange = (pid: string) => (e: ChangeEvent<HTMLInputElement>) =>
    setFiles(f => ({ ...f, [pid]: e.target.files?.[0] || null }))

  const handleTitleChange = (pid: string) => (e: ChangeEvent<HTMLInputElement>) =>
    setTitles(t => ({ ...t, [pid]: e.target.value }))

  const handleSubmit = (pid: string) => async (e: FormEvent) => {
    e.preventDefault()
    const file  = files[pid]
    const title = titles[pid]
    if (!file || !title) {
      alert('Vyplň název i PDF.')
      return
    }

    const form = new FormData()
    form.append('personId', pid)
    form.append('title', title)
    form.append('pdf', file)

    const res = await fetch('/api/portfolio', { method: 'POST', body: form })
    if (!res.ok) {
      console.error('Chyba při ukládání položky')
      return
    }
    const newItem: Item = await res.json()
    setItems(it => [...it, newItem])
    setTitles(t => ({ ...t, [pid]: '' }))
    setFiles(f => ({ ...f, [pid]: null }))
  }

  const handleDelete = (id: number) => async () => {
    const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' })
    if (res.ok) setItems(it => it.filter(i => i.id !== id))
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Správa portfolia</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {persons.map(person => (
          <div key={person.id} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">{person.name}</h2>

            <ul className="space-y-3 mb-4">
              {items
                .filter(i => i.person.id === person.id)
                .map(i => (
                  <li key={i.id} className="flex justify-between items-center">
                    <a
                      href={i.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >{i.title}</a>
                    <button onClick={handleDelete(i.id)} className="text-red-500">
                      Smazat
                    </button>
                  </li>
                ))
              }
            </ul>

            <form onSubmit={handleSubmit(person.id)} className="space-y-2">
              <input
                type="text"
                placeholder="Název PDF"
                value={titles[person.id] || ''}
                onChange={handleTitleChange(person.id)}
                className="w-full border rounded p-1"
              />
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange(person.id)}
                className="w-full"
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
