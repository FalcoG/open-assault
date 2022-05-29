import React from 'react'
import Link from 'next/link'

import styles from './header-logo.module.scss'

const HeaderLogo: React.FunctionComponent = ()=> {
  return (
    <header className={styles.header}>
      <nav>
        <Link href='/'><a className={styles.home}>🪖 Open Assault</a></Link>
      </nav>
    </header>
  )
}

export default HeaderLogo
