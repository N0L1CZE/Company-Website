'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const services = [
    { icon: '/icons/project.svg', label: 'Projektová činnost' },
    { icon: '/icons/passport.svg', label: 'Pasportizace objektů' },
    { icon: '/icons/engineering.svg', label: 'Inženýrská činnost' },
    { icon: '/icons/satisfaction.svg', label: 'Zaručená spokojenost' },
  ];

  const projects = [
    { src: '/proj1.jpg', label: 'Základní škola Morkovice-Slížany' },
    { src: '/proj2.jpg', label: 'Městský úřad Uherské Hradiště' },
    { src: '/proj3.jpg', label: 'Sídlo firmy Luxusní Elektronika A. S.' },
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
                width={550}
                height={367}
                layout="responsive"
                priority
              />
            </div>
            <div className={styles.heroTextBoxes}>
              <div className={`${styles.heroBox} ${styles.heroBoxFirst}`}>
                <h1 className={styles.heroTitle}>
                  Projektová a inženýrská činnost pro pozemní stavby
                </h1>
              </div>
              <div className={`${styles.heroBox} ${styles.heroBoxSecond}`}>
                <h2 className={styles.heroSubtitle}>
                  Kompletní projektové služby novostaveb a rekonstrukcí
                </h2>
                <p className={styles.heroCaption}>
                  (občanské stavby, rodinné domy, halové objekty, revitalizace bytových zděných a panelových domů, technologické instalace)
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

    {/* ABOUT */}
<section id="about" className={styles.aboutSection}>
  <div className={styles.aboutInner}>
    <h2 className={styles.aboutTitle}>Něco o nás</h2>
    <div className={styles.aboutCards}>
      {[
        {
          heading: "Profesionální tým",
          text: "Naše práce je hlavně o lidech. Jsme sehraný tým odborníků s mnohaletými zkušenostmi v oblasti projektování a inženýrské činnosti. Každému projektu věnujeme maximální nasazení a individuální péči, protože dobře víme, že důvěra klientů je klíčem k úspěchu. Díky otevřené komunikaci, profesionalitě a spolehlivosti se nám daří vytvářet dlouhodobé vztahy, které přinášejí skvělé výsledky. S námi získáte nejen kvalitní službu, ale také partnera, na kterého se můžete spolehnout."
        },
        {
          heading: "Kvalita na prvním místě",
          text: "Kvalita je jádrem naší filozofie. V každém kroku od plánování přes projektovou dokumentaci až po realizaci dbáme na pečlivé zpracování každého detailu. Využíváme nejmodernější technologie a postupy, které nám umožňují efektivně řešit i velmi složité projekty. Naším cílem není pouze splnit vaše očekávání, ale překonat je a dodat vám řešení, které přinese dlouhodobou hodnotu a spokojenost. Když zvolíte nás, zvolíte kvalitu, která vydrží."
        },
        {
          heading: "Spolehlivost a zkušenosti",
          text: "Úspěšně realizované projekty a spokojení klienti jsou naší nejlepší vizitkou. Díky dlouholetým zkušenostem v projektové a inženýrské činnosti víme přesně, jak řešit výzvy, které se během projektů mohou objevit. Naši odborníci vám pomohou předcházet komplikacím a zajistí hladký průběh celého procesu od začátku až do konce. Naše stabilita, znalosti a spolehlivost jsou zárukou, že vaše projekty jsou vždy v těch nejlepších rukou. S námi získáte jistotu, že vše proběhne podle vašich představ."
        },
      ].map((card, i) => (
        <div key={i} className={styles.aboutCard}>
          <h3 className={styles.cardHeading}>{card.heading}</h3>
          <p className={styles.cardText}>
            {card.text}
          </p>
        </div>
      ))}
    </div>
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
            <h2 className={styles.projectsTitle}>Naše dokončené projekty</h2>
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
