import { useContextBridge } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'

import { GameStateContext } from '../../lib/game/game-state'
import { NetworkDataContext } from '../../lib/game/network-data'
import { NetworkContext } from '../../lib/game/networking'
import Controls from './controls'
import TestCube from './mesh/test-cube'

const ContextBridge: React.FunctionComponent = () => {
  const ContextBridge = useContextBridge(NetworkContext, NetworkDataContext, GameStateContext)
  return (
    <Canvas
      style={{ position: 'fixed', top: 0 }}
    >
      <ContextBridge>
        <Controls />
        <TestCube />
      </ContextBridge>
    </Canvas>
  )
}

export default ContextBridge
