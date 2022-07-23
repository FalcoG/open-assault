import { PointerLockControls } from '@react-three/drei'
import React, { useContext, useMemo } from 'react'

import { GameStateContext } from '../../lib/game/game-state'

const Controls: React.FunctionComponent = () => {
  const { setPointerLock } = useContext(GameStateContext)

  // memo to prevent multiplying listeners
  return useMemo(() => {
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
  }, [])
}

export default Controls
