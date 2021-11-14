import styles from './footer.module.scss'

export default function Footer () {
  return (
    <footer className={styles.footer}>
      <p>Open Assault &copy; {new Date().getFullYear()}</p>
    </footer>
  )
}
