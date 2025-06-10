'use client'

import Image from 'next/image'
import styles from './page.module.css'

export default function DocumentationPage() {
  return (
    <>

      <main className={styles.container}>
        <h1 className={styles.title}>Dokumentace skutečného provedení stavby</h1>

        <div className={styles.content}>
          <div className={styles.textBlock}>
            <p className={styles.lead}>
              Tato dokumentace odráží skutečnou podobu stavby po jejím dokončení a jsou zde zapracovány všechny změny. 
              Je prakticky shodná s prováděcí dokumentací. Vlastník stavby je nově povinen ji pořídit a uchovávat po celou dobu trvání stavby.
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
