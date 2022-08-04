import { useBox } from '@react-three/cannon'
import React from 'react'
import * as THREE from 'three'

const GravityCube: React.FunctionComponent = () => {
  const [ref] = useBox(() => ({ mass: 1, position: [0, 5, 0], fixedRotation: true }))

  const test = ref as React.RefObject<THREE.Mesh>
  return (
    <mesh ref={test}>
      <boxGeometry />
      <meshBasicMaterial color='dodgerblue' />
    </mesh>
  )
}

export default GravityCube
