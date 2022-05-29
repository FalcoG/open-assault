import React from 'react'
import Head from 'next/head'
import Header from './header'
import HeaderLogo from './header-logo'
import Footer from './footer'
import styles from './layout.module.scss'

export const siteTitle = 'Open Assault'

const Layout: React.FunctionComponent<{
  focus: boolean
  children: React.ReactNode
}> = ({ focus = false, children }) => {
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

export default Layout
