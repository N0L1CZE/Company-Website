'use client'

import { useState, ChangeEvent } from 'react'
import Image from 'next/image'
import styles from './page.module.css'

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
  'Obytné a polyfunkční stavby',
  'Komerční a administrativní stavby',
  'Občanská vybavenost',
  'Zdravotnictví a školství',
  'Průmyslové a zemědělské stavby',
  'Interiér, drobná architektura',
  'Urbanismus, komunikace',
  'Ostatní',
]

export default function ClientReferences({
  projects,
  persons,
}: {
  projects: Reference[]
  persons: Person[]
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedPersons, setSelectedPersons]   = useState<string[]>([])

  const togglePerson = (id: string) =>
    setSelectedPersons(curr =>
      curr.includes(id) ? curr.filter(x => x !== id) : [...curr, id]
    )

  const filtered = projects.filter(r => {
    const okCat = !selectedCategory || r.category === selectedCategory
    const okPers =
      !selectedPersons.length ||
      selectedPersons.every(id => r.persons.some(p => p.id === id))
    return okCat && okPers
  })

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Reference</h1>

      <div className={styles.filterBar}>
        <label htmlFor="filterCategory" className={styles.filterLabel}>
          Kategorie:
        </label>
        <select
          id="filterCategory"
          className={styles.filterSelect}
          value={selectedCategory}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setSelectedCategory(e.target.value)
          }
        >
          <option value="">— Všechny kategorie —</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <fieldset className={styles.filterFieldset}>
          <legend>Autoři (zaškrtněte více):</legend>
          {persons.map(p => (
            <label key={p.id} className={styles.filterCheckboxLabel}>
              <input
                type="checkbox"
                checked={selectedPersons.includes(p.id)}
                onChange={() => togglePerson(p.id)}
              />{' '}
              {p.name}
            </label>
          ))}
        </fieldset>
      </div>

      <div className={styles.galleryBar}>
        <div className={styles.galleryInner}>
          {filtered.length === 0 && (
            <p className={styles.noResults}>Žádné projekty k zobrazení.</p>
          )}
          {filtered.map(r => (
            <div key={r.id} className={styles.card}>
              <div className={styles.cardImage}>
                <Image
                  src={r.src}
                  alt={r.label}
                  fill
                  sizes="(max-width: 600px) 100vw, 30vw"
                />
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.cardLabel}>{r.label}</h3>
                <p className={styles.cardPersons}>
                  {r.persons.map(p => p.name).join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
