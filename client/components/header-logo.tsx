import Link from 'next/link'

import styles from './header-logo.module.scss'

export default function HeaderLogo (): JSX.Element {
  return (
    <header className={styles.header}>
      <nav>
        <Link href='/'><a className={styles.home}>🪖 Open Assault</a></Link>
      </nav>
    </header>
  )
}
