import Image from 'next/image'
import styles from './page.module.css'

export default function AboutPage() {
  return (
    <>

      <main className={styles.container}>
        {/* Sekce „O společnosti“ */}
        <section className={styles.section}>
          <h1 className={styles.heading}>O společnosti Forhaus UH</h1>
          <p className={styles.text}>
            ForHaus UH s.r.o. je dynamická projektová a inženýrská kancelář se sídlem v Uherském Hradišti.
            Od svého vzniku se specializuje na komplexní služby v oblasti přípravy, projektování a realizace staveb.
            Díky důrazu na kvalitu, preciznost a individuální přístup k zákazníkům se společnost vyprofilovala
            jako spolehlivý partner pro soukromé investory, obce i firmy.
          </p>
        </section>

        {/* Sekce „Naše služby“ */}
        <section className={styles.section}>
          <h2 className={styles.heading}>Naše služby</h2>
          <p className={styles.text}>
            ForHaus UH poskytuje široké spektrum služeb v oblasti projektové a inženýrské činnosti, včetně:
          </p>
          <ul className={styles.list}>
            <li>architektonických studií,</li>
            <li>vypracování dokumentace pro územní řízení a stavební povolení,</li>
            <li>prováděcí dokumentace,</li>
            <li>autorského a technického dozoru,</li>
            <li>inženýrské činnosti a zastupování klienta v řízení na stavebních úřadech.</li>
          </ul>
          <p className={styles.text}>
            Specializujeme se na rodinné domy, bytovou výstavbu, občanskou vybavenost a menší průmyslové stavby.
            Naším cílem je nejen naplnit technické požadavky klienta, ale vytvořit návrh,
            který bude esteticky hodnotný, energeticky efektivní a zároveň udržitelný.
          </p>
        </section>

        {/* Sekce „Historie a vývoj“ */}
        <section className={styles.section}>
          <h2 className={styles.heading}>Historie a vývoj</h2>
          <p className={styles.text}>
            Společnost ForHaus UH vznikla v roce 2014 jako malý ateliér dvou zakládajících inženýrů
            s vášní pro architekturu a efektivní řízení stavebních procesů. Díky vysoké odbornosti a
            poctivému přístupu k práci se firma rychle rozrostla.
          </p>
          <p className={styles.text}>
            V roce 2017 se ForHaus UH přestěhoval do nových prostor v centru Uherského Hradiště a
            rozšířil tým o další projektanty, statiky i specialisty na technická zařízení budov.
          </p>
          <p className={styles.text}>
            Dnes firma spolupracuje s řadou osvědčených externích partnerů a podílí se na desítkách
            projektů ročně po celé České republice.
          </p>
        </section>

        {/* Sekce „Naše filozofie“ */}
        <section className={styles.section}>
          <h2 className={styles.heading}>Naše filozofie</h2>
          <p className={styles.text}>
            Věříme, že kvalitní stavba začíná kvalitním projektem. Naše práce stojí na otevřené
            komunikaci, poctivém řemesle a důvěře mezi námi a klientem. Každý projekt je pro
            nás výzvou – hledáme rovnováhu mezi funkčností, estetikou, rozpočtem a respektem k okolí.
          </p>
        </section>

        {/* Dolní obrázkový pruh */}
        <section className={styles.imagesBar}>
          <div className={styles.imagesBarInner}>
            {['/img1.webp', '/img2.jpg', '/img3.jpg'].map((src, i) => (
             <div key={i} className={styles.imageWrapper}>
  <Image
    src={src}
    alt={`Naše práce ${i + 1}`}
    fill
    priority
  />
</div>
            ))}
          </div>
        </section>
      </main>

    </>
  )
}
