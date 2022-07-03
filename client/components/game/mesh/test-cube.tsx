import React, { useContext, useRef, useState } from 'react'

import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

import { NetworkDataContext } from '../../../lib/game/network-data'

const TestCube = (props: JSX.IntrinsicElements['mesh']): JSX.Element => {
  const ref = useRef<THREE.Mesh>(null)
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  const { players } = useContext(NetworkDataContext)

  useFrame((state, delta) => {
    // todo: loop all boxes/players
    if (ref.current != null) {
      ref.current.rotation.x += 1 * delta
      ref.current.rotation.y += 1 * delta
    }
  })

  return (
    <group>
      {players.map((player, index) => (
        <mesh
          key={player.uuid}
          {...props}
          ref={ref}
          scale={clicked ? 1.5 : 1}
          onClick={() => click(!clicked)}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
      ))}
    </group>
  )
}

export default TestCube
