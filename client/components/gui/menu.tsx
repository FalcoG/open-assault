import React, { useContext } from 'react'

import { GameStateContext } from '../../lib/game/game-state'
import Overlay from './overlay'

const Menu: React.FunctionComponent = () => {
  const { pointerLock } = useContext(GameStateContext)

  return (
    <>
      {!pointerLock && (
        <Overlay position={['center', 'center']}>
          Hello menu
        </Overlay>
      )}
    </>
  )
}

export default Menu
