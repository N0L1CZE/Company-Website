import Image from 'next/image'
import styles from './page.module.css'

export default function PassportPage() {
  return (
    <>

      <main className={styles.container}>
        <h1 className={styles.title}>Projekt pro povolení stavby</h1>
        <div className={styles.content}>
          <div className={styles.textBlock}>
            <p className={styles.lead}>
              Dokumentace obsahuje průvodní a technickou zprávu, situace, půdorysy, řezy, pohledy. Dále je možné zpracovat řešení technického zařízení budovy (vytápění, zásobování vodou, elektřinou, teplem apod.), i když podle nového stavebního zákona to není povinné.
            </p>
            <p className={styles.lead}>
              Přikládá se i statický výpočet, hydrogeologický posudek na vsakování a na základě požadavku hygieny např. i akustická studie. Zpracováváme rovněž požárně bezpečnostní řešení, průkaz energetické náročnosti budov, vynětí ze zemědělského půdního fondu, povolení kácení dřevin, návrh sadových úprav, aj.
              Zařídíme jednání s úřady, správci sítí, dotčenými orgány a ostatními účastníky řízení.
            </p>
            <p className={styles.lead}>
              Nově není třeba dokumentaci tisknout, jelikož digitalizace procesu vyžaduje pouze pdf, ale dle domluvy poskytujeme i výtisky. 
            </p>
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