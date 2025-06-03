'use client'

import Image from 'next/image'
import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'
import styles from './page.module.css'

export default function ContactsPage() {
  return (
    <>

      <main className={styles.container}>
        <h1 className={styles.title}>Kontakt</h1>
        <div className={styles.content}>
          {/* levý sloupec s kontakty */}
          <div className={styles.info}>
            <h2 className={styles.infoHeading}>ForHaus UH s.r.o.</h2>
            <address className={styles.address}>
              Masarykovo náměstí 87<br />
              686 01 Uherské Hradiště<br />
              <strong>IČO:</strong>09234561 • <strong>DIČ:</strong> CZ09234561<br />
              <strong>Datová schránka:</strong> fhausuh<br />
            </address>
            <p className={styles.contactLine}>
              <strong>Telefon (ústředna):</strong> +420 572 123 456
            </p>
            <p className={styles.contactLine}>
              <strong>E-mail:</strong> info@forhausuh.cz
            </p>

            <h3 className={styles.infoSubheading}>Vedení společnosti</h3>
            <p className={styles.contactLine}><strong>Ing. Tomáš Vavruša</strong></p>
            <p className={styles.contactLine}>vavrusa@forhausuh.cz • +420 724 456 789</p>

            <p className={styles.contactLine}><strong>Bc. Kristýna Holíková</strong></p>
            <p className={styles.contactLine}>holikova@forhausuh.cz • +420 732 112 903</p>

            <h3 className={styles.infoSubheading}>Projektové oddělení</h3>
            <p className={styles.contactLine}><strong>Ing. Martin Kalenda</strong></p>
            <p className={styles.contactLine}>kalenda@forhausuh.cz • +420 730 998 221</p>

            <p className={styles.contactLine}><strong>Ing. Petra Zikmundová</strong></p>
            <p className={styles.contactLine}>zikmundova@forhausuh.cz • +420 735 881 775</p>

            <p className={styles.contactLine}><strong>Bc. Adam Šimek</strong></p>
            <p className={styles.contactLine}>simek@forhausuh.cz • +420 778 320 148</p>
          </div>

          {/* pravý sloupec s mapou */}
          <div className={styles.map}>
            <h2 className={styles.mapHeading}>Kde nás najdete</h2>
            <iframe
              src="https://maps.google.com/maps?q=49.069299,17.460523&z=15&output=embed"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </main>

    </>
  )
}
