import Head from 'next/head'
import Header from './header'
import Footer from './footer'
import styles from './layout.module.scss'

export const siteTitle = 'Open Assault'

export default function Layout ({ children, home }) {
  return (
    <div className={styles.layout}>
      <Head>
        <title>{siteTitle}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
