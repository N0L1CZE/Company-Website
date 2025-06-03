'use client'
import { useState, ChangeEvent } from 'react'
import Image from 'next/image'
import styles from './page.module.css'

type Reference = {
  id: string
  label: string
  src: string
  category: string
}

export default function ClientReferences({
  projects,
}: {
  projects: Reference[]
}) {
  const [category, setCategory] = useState<string>('all')

  const filtered = projects.filter(
    (p) => category === 'all' || p.category.toLowerCase() === category
  )

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Reference</h1>

      <div className={styles.filterBar}>
        <label htmlFor="category" className={styles.filterLabel}>
          Filtrovat podle:
        </label>
        <select
          id="category"
          className={styles.filterSelect}
          value={category}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setCategory(e.target.value)
          }
        >
          <option value="all">Vše</option>
          <option value="bytové domy">Bytové domy</option>
          <option value="komerční">Komerční</option>
          <option value="revitalizace">Revitalizace</option>
        </select>
      </div>

      <div className={styles.galleryBar}>
        <div className={styles.galleryInner}>
          {filtered.map((p) => (
            <div key={p.id} className={styles.card}>
              <div className={styles.cardImage}>
                <Image
                  src={p.src}
                  alt={p.label}
                  fill
                  sizes="(max-width: 600px) 100vw, 30vw"
                />
              </div>
              <button className={styles.cardButton}>{p.label}</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
