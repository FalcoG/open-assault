import React from 'react'

import styles from './overlay.module.scss'

type OverlayPositionX = 'left' | 'center' | 'right'
type OverlayPositionY = 'top' | 'center' | 'bottom'

const Overlay: React.FunctionComponent<{
  position: [OverlayPositionX, OverlayPositionY]
  children: React.ReactNode
}> = (
  { position, children }
) => {
  return (
    <div
      className={styles.overlay}
      style={{
        top: position[1] === 'top' ? 0 : (position[1] === 'center' ? '50%' : 'initial'),
        right: position[0] === 'right' ? 0 : 'initial',
        bottom: position[1] === 'bottom' ? 0 : 'initial',
        left: position[0] === 'left' ? 0 : (position[0] === 'center' ? '50%' : 'initial'),
        transform: `translate(
          ${position[0] === 'center' ? '-50%' : '0'},
          ${position[1] === 'center' ? '-50%' : '0'}
        )`
      }}
    >
      {children}
    </div>
  )
}

export default Overlay
