import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

const TestCube = (props: JSX.IntrinsicElements['mesh']): JSX.Element => {
  const ref = useRef<THREE.Mesh>(null)
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  useFrame((state, delta) => {
    if (ref.current != null) {
      ref.current.rotation.x += 1 * delta
      ref.current.rotation.y += 1 * delta
    }
  })

  return (
    <mesh
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
  )
}

export default TestCube
