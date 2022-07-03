import { PointerLockControls } from '@react-three/drei'
import React, { useContext } from 'react'

import { GameStateContext } from '../../lib/game/game-state'

const Controls: React.FunctionComponent = () => {
  const { setPointerLock } = useContext(GameStateContext)

  return (
    <PointerLockControls
      onLock={(e) => {
        setPointerLock(true)
        console.log('lock', e)
      }}
      onUnlock={(e) => {
        setPointerLock(false)
        console.log('unlock', e)
      }}
    />

  )
}

export default Controls
