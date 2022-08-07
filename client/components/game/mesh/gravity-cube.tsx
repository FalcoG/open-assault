import { useBox, useSphere } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'
import React/*, { useEffect } */ from 'react'
import * as THREE from 'three'

const GravityCube: React.FunctionComponent = () => {
  const [ref/*, api */] = useBox(() => ({ mass: 1, position: [0.7, 1, 0], fixedRotation: true }))
  const [ref2, api2] = useSphere(() => ({
    mass: 1,
    position: [0, 2, 0],
    fixedRotation: true,
    type: 'Dynamic'
  }))

  useFrame(({ clock }) => {
    // api.position.set(Math.sin(clock.getElapsedTime()) * 5, 0, 0)
    const velocity = Math.sin(clock.getElapsedTime())
    // console.log('velocity', velocity)
    api2.velocity.set(velocity * 5, 0, 0)
  })

  // useEffect(() => {
  //   api.position.subscribe((v) => {
  //     console.log('psotion', v)
  //   })
  // }, [])

  const test = ref as React.RefObject<THREE.Mesh>
  const test2 = ref2 as React.RefObject<THREE.Mesh>
  return (
    <>
      <mesh ref={test}>
        <boxGeometry />
        <meshBasicMaterial color='dodgerblue' />
      </mesh>
      <mesh ref={test2}>
        <sphereGeometry />
        <meshBasicMaterial color='darkcyan' />
      </mesh>
    </>
  )
}

export default GravityCube
