// app/contacts/ContactClient.tsx
export const metadata = {
  title: 'Forhaus UH | Kontakt',
  description:
    'Kontaktujte Forhaus UH – architektonickou a projekční kancelář v Uherském Hradišti. Najdete nás na pobočce i online.',
  applicationName: 'Forhaus UH',
  authors: [{ name: 'Forhaus UH', url: 'https://forhaus-uh.cz' }],
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: 'Forhaus | Kontakt',
    description:
      'Potřebujete konzultaci nebo detaily o našich službách? Kontaktujte tým Forhaus UH.',
    url: 'https://forhaus-uh.cz/contacts',
    siteName: 'Forhaus UH',
    images: [
      {
        url: 'https://forhaus-uh.cz/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Forhaus UH – Kontakt'
      }
    ],
    locale: 'cs_CZ',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forhaus UH | Kontakt',
    description:
      'Kontaktujte Forhaus UH – architekti, urbanisté a projektanti v Uherském Hradišti.',
    images: ['https://forhaus-uh.cz/hero.jpg'],
    site: '@forhausuh'
  }
}

'use client'

import styles from './page.module.css'
import React, { Fragment } from 'react'

interface Texts { [key: string]: string }

export default function ContactClient({ texts }: { texts: Texts }) {
  const renderLines = (key: string) => {
    const raw = texts[key] || ''
    return raw.split('\n').map((line, i, arr) => (
      <Fragment key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </Fragment>
    ))
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>
        {texts['contact.title'] || 'Kontakt'}
      </h1>
      <div className={styles.content}>
        {/* levý sloupec s kontakty */}
        <div className={styles.info}>
          <h2 className={styles.infoHeading}>
            {texts['contact.company.name']}
          </h2>
          <address className={styles.address}>
            {renderLines('contact.company.address')}
          </address>

          {/* Osoba 1 */}
          <h3 className={styles.infoSubheading}>
            <strong>{texts['contact.person.rypal.name']}</strong>
          </h3>
          <p className={styles.contactLine}>
            <strong>{texts['contact.person.rypal.role']}</strong><br />
            {renderLines('contact.person.rypal.details')}
          </p>

          {/* Osoba 2 */}
          <h3 className={styles.infoSubheading}>
            <strong>{texts['contact.person.harazimova.name']}</strong>
          </h3>
          <p className={styles.contactLine}>
            <strong>{texts['contact.person.harazimova.role']}</strong><br />
            {renderLines('contact.person.harazimova.details')}
          </p>

          {/* Osoba 3 */}
          <h3 className={styles.infoSubheading}>
            <strong>{texts['contact.person.jaksikova.name']}</strong>
          </h3>
          <p className={styles.contactLine}>
            <strong>{texts['contact.person.jaksikova.role']}</strong><br />
            {renderLines('contact.person.jaksikova.details')}
          </p>

          {/* Osoba 4 */}
          <h3 className={styles.infoSubheading}>
            <strong>{texts['contact.person.kuzela.name']}</strong>
          </h3>
          <p className={styles.contactLine}>
            <strong>{texts['contact.person.kuzela.role']}</strong><br />
            {renderLines('contact.person.kuzela.details')}
          </p>
        </div>

        {/* pravý sloupec s mapou – **static embed**, nekontrolované CRUD */}
        <div className={styles.map}>
          <h2 className={styles.mapHeading}>Kde nás najdete</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3121.1039275261187!2d17.461499776781967!3d49.068258885914176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47131438684ce9db%3A0xc33e0d111dad6efd!2zUGFsYWNrw6lobyBuw6FtLiAyMTMsIDY4NiAwMSBVaGVyc2vDqSBIcmFkacWhdMSbIDE!5e1!3m2!1scs!2scz!4v1749492571859!5m2!1scs!2scz"
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
  )
}
