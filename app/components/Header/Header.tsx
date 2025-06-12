'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import styles from './header.module.css'

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>

        {/* levá část: logo + navigace */}
        <div className={styles.headerLeft}>
          <Link href="/" onClick={handleHomeClick} className={styles.logoLink}>
            <div className={styles.logoBg}>
              <Image
                src="/logo-white.png"
                alt="Forhaus UH"
                width={181}
                height={102}
                priority
                   />
            </div>
          </Link>

          {/* hamburger button */}
          <button
            className={styles.burger}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Zavřít menu' : 'Otevřít menu'}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
            <Link href="/" onClick={handleHomeClick} className={styles.navLink}>
              Úvod
            </Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} className={styles.navLink}>
              O nás
            </Link>
            <Link href="/our-work" onClick={() => setMenuOpen(false)} className={styles.navLink}>
              Naše služby
            </Link>
            <Link href="/references" onClick={() => setMenuOpen(false)} className={styles.navLink}>
              Naše práce
            </Link>
            <Link href="/portfolio" onClick={() => setMenuOpen(false)} className={styles.navLink}>
              Portfolio
            </Link>
            <Link href="/contacts" onClick={() => setMenuOpen(false)} className={styles.navLink}>
              Kontakt
            </Link>
          </nav>
        </div>  
      </div>
    </header>
  )
}
