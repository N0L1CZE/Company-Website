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
            <Image
              src="/logo-white.png"
              alt="Forhaus UH"
              width={181}
              height={102}
              priority
            />
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
            <Link href="/references" onClick={() => setMenuOpen(false)} className={styles.navLink}>
              Reference
            </Link>
            <div className={styles.navDropdown}>
              <Link href="/our-work" onClick={() => setMenuOpen(false)} className={styles.navLink}>
                Naše práce
              </Link>
              
            </div>
            <Link href="/contacts" onClick={() => setMenuOpen(false)} className={styles.navLink}>
              Kontakt
            </Link>
            <Link
              href="tel:+420737377321"
              onClick={() => setMenuOpen(false)}
              className={`${styles.navLink} ${styles.phoneInNav}`}
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 
                         011.05-.24 11.72 11.72 0 003.66.58 1 1 0 011 1v3.5a1 1 
                         0 01-1 1A17.93 17.93 0 012 6a1 1 0 011-1h3.5a1 1 0 011 
                         1 11.72 11.72 0 00.58 3.66 1 1 0 01-.24 1.05l-2.2 2.2z"/>
              </svg>
              +420 737 377 321
            </Link>
          </nav>
        </div>  
        {/* telefon tlačítko pro desktop */}
        <Link href="tel:+420737377321" className={styles.phoneButton}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 
                     011.05-.24 11.72 11.72 0 003.66.58 1 1 0 011 1v3.5a1 1 
                     0 01-1 1A17.93 17.93 0 012 6a1 1 0 011-1h3.5a1 1 0 011 
                     1 11.72 11.72 0 00.58 3.66 1 1 0 01-.24 1.05l-2.2 2.2z"/>
          </svg>
          +420 737 377 321
        </Link>
      </div>
    </header>
  )
}
