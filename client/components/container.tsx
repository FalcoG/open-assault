import React from 'react'

import styles from './container.module.scss'

const Container: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.container}>
      {children}
    </div>
  )
}

export default Container
