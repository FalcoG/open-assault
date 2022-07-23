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
  const { pointerLock } = useContext(GameStateContext)

  useEffect(() => {
    const keyDownHandler = (e): void => {
      if (e.key === keymap.movement_walking_forwards) {
        setWalkingForwards(true)
      } else if (e.key === keymap.movement_walking_backwards) {
        setWalkingBackwards(true)
      } else if (e.key === keymap.movement_walking_left) {
        setWalkingLeft(true)
      } else if (e.key === keymap.movement_walking_right) {
        setWalkingRight(true)
      }
    }
    const keyUpHandler = (e): void => {
      if (e.key === keymap.movement_walking_forwards) {
        setWalkingForwards(false)
      } else if (e.key === keymap.movement_walking_backwards) {
        setWalkingBackwards(false)
      } else if (e.key === keymap.movement_walking_left) {
        setWalkingLeft(false)
      } else if (e.key === keymap.movement_walking_right) {
        setWalkingRight(false)
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

    if (!canMove) return

    const rotationalVec = new Vector3()
    state.camera.getWorldDirection(rotationalVec)
    rotationalVec.y = 0
    ref.current.lookAt(rotationalVec.add(ref.current.position)) // todo: this could probably be more efficient

    // no else ifs for movement, users may press all keys at the same time!
    if (walkingForwards) {
      ref.current.translateZ(1 * delta)
    }

    if (walkingBackwards) {
      ref.current.translateZ(-1 * delta)
    }

    if (walkingLeft) {
      ref.current.translateX(1 * delta)
    }

    if (walkingRight) {
      ref.current.translateX(-1 * delta)
    }

    state.camera.position.set(ref.current.position.x, ref.current.position.y + 1.8, ref.current.position.z)
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
