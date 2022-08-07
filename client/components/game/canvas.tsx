import { Physics } from '@react-three/cannon'
import { GizmoHelper, GizmoViewport, Stats, useContextBridge } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'
import * as THREE from 'three'

import { GameStateContext } from '../../lib/game/game-state'
import { NetworkDataContext } from '../../lib/game/network-data'
import { NetworkContext } from '../../lib/game/networking'
import styles from './canvas.module.scss'
import Controls from './controls'
import GravityCube from './mesh/gravity-cube'
import Surface from './mesh/surface'
import TestCube from './mesh/test-cube'
import Player from './player'
import Players from './players'

const ContextBridge: React.FunctionComponent = () => {
  const ContextBridge = useContextBridge(NetworkContext, NetworkDataContext, GameStateContext)
  return (
    <Canvas
      style={{ position: 'fixed', top: 0 }}
    >
      <ContextBridge>
        <Controls />
        <ambientLight color='#404040' />
        <primitive object={new THREE.AxesHelper(10)} />
        <GizmoHelper
          alignment='bottom-right'
          margin={[80, 80]}
        >
          <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor='black' />
        </GizmoHelper>
        <Stats className={styles.stats} />
        <Players />
        <TestCube />
        <gridHelper />

        <Physics>
          <Surface />
          <Player />
          <GravityCube />
        </Physics>
      </ContextBridge>
    </Canvas>
  )
}

export default ContextBridge
