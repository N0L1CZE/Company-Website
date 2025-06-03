import Image from 'next/image'
import { Header } from 'app/components/Header/Header'
import { Footer } from 'app/components/Footer/Footer'
import styles from './page.module.css'

export default function PassportPage() {
  return (
    <>

      <main className={styles.container}>
        <h1 className={styles.title}>Pasportizace objektů</h1>
        <div className={styles.content}>
          <div className={styles.textBlock}>
            <p className={styles.lead}>
              Provádíme pasportizaci objektů včetně detailní dokumentace stávajícího stavu.
              Zajistíme přesné zaměření, evidenci prvků a přehledné výstupy pro další technické nebo správní využití.
            </p>
            <h2 className={styles.subheading}>Co pasportizujeme?</h2>
            <ul className={styles.list}>
              <li>Měření a digitalizace podlažních plánů</li>
              <li>Evidenci technických sítí a instalací</li>
              <li>Vyhotovení 3D modelu a bodového mračna</li>
              <li>Revizi a aktualizaci stávající dokumentace</li>
            </ul>
          </div>
          <div className={styles.imageWrapper}>
            <Image
              src="/passportisation.jpg"
              alt="Pasportizace objektů"
              width={550}
              height={367}
              className={styles.image}
            />
          </div>
        </div>
      </main>

    </>
  )
}