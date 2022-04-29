import Link from 'next/link'

import styles from './header.module.scss'
import Container from './container'

export default function Header (): JSX.Element {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.logo}>Open Assault</div>
        <nav className={styles.navigation}>
          <ul>
            <li><Link href='/'><a>Home</a></Link></li>
            <li><Link href='/play'><a>Play</a></Link></li>
          </ul>
        </nav>
      </Container>
    </header>
  )
}
