import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Image from 'next/image'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>ColbyDeH.art</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          <Image src="/under_construction.gif" alt="Under Construction" layout="fill" />
        </div>
      </main>

      <footer className={styles.footer}>
        Made with ♥ by Colby DeHart
      </footer>
    </div>
  )
}
