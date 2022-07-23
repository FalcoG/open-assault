import { useFrame } from '@react-three/fiber'
import React, { useContext, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Vector3 } from 'three'

import { GameStateContext } from '../../lib/game/game-state'
import keymap from '../../lib/keymap'

const Player = (props: JSX.IntrinsicElements['mesh']): JSX.Element => {
  const ref = useRef<THREE.Mesh>(null)
  const [walkingForwards, setWalkingForwards] = useState(false)
  const [walkingBackwards, setWalkingBackwards] = useState(false)
  const [walkingLeft, setWalkingLeft] = useState(false)
  const [walkingRight, setWalkingRight] = useState(false)
  const [sprinting, setSprinting] = useState(false)
  const { pointerLock } = useContext(GameStateContext)

  useEffect(() => {
    const keyDownHandler = (e): void => {
      switch (e.code) {
        case keymap.movement_walking_forwards:
          setWalkingForwards(true)
          break
        case keymap.movement_walking_backwards:
          setWalkingBackwards(true)
          break
        case keymap.movement_walking_left:
          setWalkingLeft(true)
          break
        case keymap.movement_walking_right:
          setWalkingRight(true)
          break
        case keymap.movement_walking_sprint:
          setSprinting(true)
          break
      }
    }
    const keyUpHandler = (e): void => {
      switch (e.code) {
        case keymap.movement_walking_forwards:
          setWalkingForwards(false)
          break
        case keymap.movement_walking_backwards:
          setWalkingBackwards(false)
          break
        case keymap.movement_walking_left:
          setWalkingLeft(false)
          break
        case keymap.movement_walking_right:
          setWalkingRight(false)
          break
        case keymap.movement_walking_sprint:
          setSprinting(false)
          break
      }
    }

    document.addEventListener('keydown', keyDownHandler, { passive: true })
    document.addEventListener('keyup', keyUpHandler, { passive: true })

    return () => {
      document.removeEventListener('keydown', keyDownHandler)
      document.removeEventListener('keyup', keyUpHandler)
    }
  })

  useFrame((state, delta) => {
    const canMove = ref.current != null && pointerLock
    const speed = sprinting ? 2 : 1

    if (!canMove) return

    const rotationalVec = new Vector3()
    state.camera.getWorldDirection(rotationalVec) // this vector is relative to the camera itself
    rotationalVec.y = 0
    ref.current.lookAt(rotationalVec.clone().add(ref.current.position)) // make the vector absolute to the world

    // no else ifs for movement, users may press all keys at the same time!
    if (walkingForwards) {
      ref.current.translateZ(speed * delta)
    }

    if (walkingBackwards) {
      ref.current.translateZ(-speed * delta)
    }

    if (walkingLeft) {
      ref.current.translateX(speed * delta)
    }

    if (walkingRight) {
      ref.current.translateX(-speed * delta)
    }

    const cameraPosition = ref.current.position.clone()
    cameraPosition.sub(rotationalVec)
    cameraPosition.setY(ref.current.position.y + 1.5)

    state.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
  })

  return (
    <group>
      <mesh
        ref={ref}
        {...props}
      >
        <boxGeometry args={[1, 2, 1]} />
        <pointLight position={[0, 10, 0]} color='white' />
        <meshPhongMaterial color='red' />
      </mesh>
    </group>
  )
}

export default Player
