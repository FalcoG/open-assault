import React from 'react'
import Head from 'next/head'
import Header from './header'
import HeaderLogo from './header-logo'
import Footer from './footer'
import styles from './layout.module.scss'

export const siteTitle = 'Open Assault'

export default function Layout ({ focus = false, children }: { focus: boolean, children: React.ReactNode}): JSX.Element {
  return (
    <div className={styles.layout}>
      <Head>
        <title>{siteTitle}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      {!focus ? <Header /> : <HeaderLogo />}
      <main className={!focus ? styles.main : styles.mainFocus}>
        {children}
      </main>
      {!focus && <Footer />}
    </div>
  )
}
