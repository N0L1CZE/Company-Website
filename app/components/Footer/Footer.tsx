import Link from 'next/link'
import Image from 'next/image'
import styles from './footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <Link href="/" className={styles.footerLogoLink}>
          <Image src="/logo-black.png" alt="Forhaus UH" width={181} height={102} priority />
        </Link>
        <div className={styles.footerCopy}>
          copyright © 2025 Forhaus-UH
        </div>
        <nav className={styles.footerNav}>
          <Link href="/auth/login" className={styles.footerLink}>Přihlásit se</Link>
        </nav>
      </div>
    </footer>
  )
}
