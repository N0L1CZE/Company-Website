'use client'

import Image from 'next/image'
import styles from './page.module.css'

export default function ForProjectPage() {
  return (
    <>

      <main className={styles.container}>
        <h1 className={styles.title}>Projekt pro provedení stavby</h1>

        <div className={styles.content}>
          <div className={styles.textBlock}>
            <p className={styles.lead}>
              <p>
                Projekt je zpracován v takových podrobnostech, aby bylo možné stavbu realizovat.
              </p>
              <p>
                Stanovuje standard, kvalitu materiálů a způsoby provedení. Prováděcí projekt je nyní povinný a již musí obsahovat řešení technického zařízení budovy (vytápění, zásobování vodou, elektřinou, teplem apod.)
              </p>

              Zpracovává se jednotlivě pro pozemní objekty (budovy), inženýrské objekty (např. komunikace, studna) a technologická zařízení (zpravidla průmyslová zařízení). 
              Projekt pro provádění stavby je podkladem pro realizační dokumentaci zhotovitele stavby, tzn. výrobní a dílenskou dokumentaci.
              Dokumentaci vytiskneme i předáme digitálně.
            </p>
          </div>

          <div className={styles.imageWrapper}>
            <Image
              src="/engineer-cinnost.jpg"
              alt="Projektová činnost"
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
