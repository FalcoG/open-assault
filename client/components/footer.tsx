import React from 'react'

import styles from './footer.module.scss'

const Footer: React.FunctionComponent = () => {
  return (
    <footer className={styles.footer}>
      <p>Open Assault &copy; {new Date().getFullYear()}</p>
    </footer>
  )
}

export default Footer
