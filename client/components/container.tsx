import styles from './container.module.scss'

export default function Container ({ children }): JSX.Element {
  return (
    <div className={styles.container}>
      {children}
    </div>
  )
}
