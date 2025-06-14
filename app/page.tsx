export const metadata = {
  title: 'Forhaus UH | Architektura, urbanismus a interiéry',
  description:
    'Forhaus UH – specializovaná architektonická a projekční kancelář v Uherském Hradišti. Kompletní návrhy novostaveb, rekonstrukcí i interiérů.',
  keywords: [
    'Forhaus',
    'architekt Uherské Hradiště',
    'urbanismus',
    'interiéry',
    'projekční kancelář',
    'novostavby',
    'rekonstrukce',
    'Uherské Hradiště',
    'projektant',
    'stavař',
    'návrh domu',
    'návrh rodinného domu',
    'stavební inženýr',
    'architektonický návrh',
    'architektonická studie',
    'studie interiéru',
    'návrh interiéru',
    'projektová dokumentace',
    'statické posouzení',
    'statik',
    'rozpočet stavby',
    'návrh zateplení',
    'architektonická kancelář',
    'projekční kancelář',
    'urbanistická studie',
    'architektonické řešení',
  ],
  applicationName: 'Forhaus UH',
  authors: [{ name: 'Forhaus UH', url: 'https://forhaus-uh.cz' }],
  robots: {
    index: true,
    follow: true,
    nocache: true
  },
  openGraph: {
    title: 'Forhaus UH | Architektura, urbanismus a interiéry',
    description:
      'Forhaus UH – architektonická a projekční kancelář poskytující kompletní služby od studie po realizaci.',
    url: 'https://forhaus-uh.cz',
    siteName: 'Forhaus UH',
    images: [
      {
        url: 'https://forhaus-uh.cz/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Moderní budova – Forhaus UH'
      }
    ],
    locale: 'cs_CZ',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forhaus | Architektura, urbanismus a interiéry',
    description:
      'Forhaus UH – architektonická a projekční kancelář poskytující komplexní návrhy novostaveb, rekonstrukcí a interiérů.',
    images: ['https://forhaus-uh.cz/hero.jpg'],
    site: '@forhausuh'
  }
}

import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const services = [
    { icon: '/icons/house-icon.svg', label: 'Architektonické návrhy' },
    { icon: '/icons/project.svg', label: 'Projektová činnost' },
    { icon: '/icons/passport.svg', label: 'Pasportizace objektů' },
    { icon: '/icons/engineering.svg', label: 'Inženýrská činnost' },
  ];

  const projects = [
    { src: '/proj1.jpg', label: 'Centrální objekty Uherskohradištské nemocnice' },
    { src: '/proj2.jpg', label: 'Podnikatelský inkubátor - Kunovice' },
    { src: '/proj3.jpg', label: 'Výrobní areál EVPU - Uherské Hradiště' },
  ];

  return (
    <>

      <main className={styles.viewport}>
        {/* HERO */}
        <section id="hero" className={styles.hero}>
          <div className={styles.heroWrapper}>
            <div className={styles.heroImage}>
              <Image
                src="/hero.jpg"
                alt="Moderní budova"
                fill
                style={{ objectFit: 'cover' }}
                priority
                  />
            </div>
            <div className={styles.heroTextBoxes}>
              <div className={`${styles.heroBox} ${styles.heroBoxFirst}`}>
                <h1 className={styles.heroTitle}>
                  Architektura, urbanismus, interiéry
                </h1>
                <p className={styles.heroCaption}>
                  projektová a inženýrská činnost ve výstavbě
                </p>
              </div>
              <div className={`${styles.heroBox} ${styles.heroBoxSecond}`}>
                <h2 className={styles.heroSubtitle}>
                  Kompletní návrhy a projektové služby novostaveb, rekonstrukcí a interiérů
                </h2>
                <p className={styles.heroCaption}>
                  stavby obytné, občanské, komerční, průmyslové, zdravotnické aj.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className={styles.services}>
          <div className={styles.servicesContainer}>
            {services.map((s, i) => (
              <div key={i} className={styles.serviceItem}>
                <Image src={s.icon} alt={s.label} width={130} height={130} />
                <p className={styles.serviceCaption}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Zajímá Vás naše práce?</h2>
            <div className={styles.ctaButtons}>
              <Link href="/contacts" className={styles.ctaButtonContact}>Kontakt</Link>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className={styles.projectsSection}>
          <div className={styles.viewport}>
            <h2 className={styles.projectsTitle}>Naše dokončené stavby</h2>
            <div className={styles.projectsBar}>
              <div className={styles.projectsBarInner}>
                <div className={styles.projectList}>
                  {projects.map((p, i) => (
                    <div key={i} className={styles.projectCard}>
                      <Image
                        src={p.src}
                        alt={p.label}
                        width={360}
                        height={375}
                        layout="responsive"
                      />
                      <div className={styles.projectCaption}>{p.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.moreWrapper}>
              <Link href="/references" className={styles.moreButton}>Další reference</Link>
            </div>
          </div>
        </section>
      </main>

    </>
  );
}
