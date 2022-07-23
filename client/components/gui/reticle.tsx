import React, { useContext } from 'react'

import { GameStateContext } from '../../lib/game/game-state'

const Reticle: React.FunctionComponent = () => {
  const { pointerLock } = useContext(GameStateContext)

  return (
    <>
      {pointerLock && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'red',
            width: '3px',
            height: '3px'
          }}
        />
      )}
    </>
  )
}

export default Reticle
