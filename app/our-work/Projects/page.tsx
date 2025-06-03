import Image from 'next/image'
import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'
import styles from './page.module.css'

export default function ProjectPage() {
  return (
    <>

      <main className={styles.container}>
        {/* Nadpis */}
        <h1 className={styles.title}>Projektová činnost</h1>

        {/* Úvodní odstavec */}
        <p className={styles.intro}>
          V ForHaus UH se věnujeme kompletní projektové činnosti ve výstavbě – od úvodní studie až po podklady pro realizaci. Naším cílem je navrhovat funkční, estetické a technicky kvalitní stavby na míru potřebám klienta.
        </p>

        {/* Sekce „Naše služby“ */}
        <section className={styles.section}>
          <h2 className={styles.heading}>Naše služby</h2>
          <ul className={styles.list}>
            <li>Architektonické studie – první návrhy, dispozice, vzhled, zapojení do okolí</li>
            <li>Dokumentace pro územní a stavební řízení – zajištění všech potřebných výkresů a vyjádření</li>
            <li>Prováděcí dokumentace – podrobný projekt pro samotnou výstavbu</li>
            <li>Autorský dozor – dohled nad správným provedením projektu na stavbě</li>
          </ul>
        </section>

        {/* Sekce „Co projektujeme?“ */}
        <section className={styles.section}>
          <h2 className={styles.heading}>Co projektujeme?</h2>
          <ul className={styles.list}>
            <li>Rodinné a bytové domy</li>
            <li>Veřejné a administrativní budovy</li>
            <li>Rekonstrukce a přestavby</li>
            <li>Pasivní a nízkoenergetické stavby</li>
          </ul>
        </section>

        {/* Obrázkový pás */}
    <section className={styles.imagesBar}>
  <div className={styles.imagesBarInner}>
    {['/projekt-cinnost-1.jpg', '/projekt-cinnost-2.jpg', '/projekt-cinnost-3.jpg'].map((src, i) => (
      <div key={i} className={styles.imageWrapper}>
        <Image
          src={src}
          alt={`Ukázka ${i + 1}`}
          fill
          className={styles.image}
        />
      </div>
    ))}
  </div>
</section>
      </main>

    </>
  )
}
