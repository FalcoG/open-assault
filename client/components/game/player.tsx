import { useSphere, VectorApi } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'
import { ClientPacketKeys } from 'open-assault-core/networking'
import React, { useContext, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Euler, Quaternion, Vector3 } from 'three'
import { degToRad, radToDeg } from 'three/src/math/MathUtils'

import { GameStateContext } from '../../lib/game/game-state'
import { createPacket, NetworkContext } from '../../lib/game/networking'
import keymap from '../../lib/keymap'
import PlayerModel from './mesh/player-model'

const Player = (): JSX.Element => {
  const [, physicsAPI] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 10, 0],
    // rotation: [10, 0, 0],
    //      friction: 0.0,
    //       restitution: 0.3,
    // friction: 0,
    // restitution: 0.3,
    fixedRotation: true
  }))
  // const ref = physicsRefObject as React.RefObject<THREE.Group>

  const axesRef = useRef<THREE.AxesHelper>(null)
  const ref = useRef<THREE.Group>(null)
  const referenceSphere = useRef<THREE.Mesh>(null)
  const [walkingForwards, setWalkingForwards] = useState(false)
  const [walkingBackwards, setWalkingBackwards] = useState(false)
  const [walkingLeft, setWalkingLeft] = useState(false)
  const [walkingRight, setWalkingRight] = useState(false)
  const [sprinting, setSprinting] = useState(false)
  const { pointerLock } = useContext(GameStateContext)
  const { ws } = useContext(NetworkContext)

  const positionRef = useRef<number[]>([0, 0, 0])
  const velocityRef = useRef<number[]>([0, 0, 0])
  const rotationRef = useRef<number[]>([0, 0, 0])

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

  useEffect(() => {
    physicsAPI.position.subscribe((position) => {
      positionRef.current = position
    })

    physicsAPI.velocity.subscribe((velocity) => {
      velocityRef.current = velocity
    })

    physicsAPI.rotation.subscribe((rotation) => {
      rotationRef.current = rotation
    })
  }, [])

  useFrame((state, delta) => {
    const canMove = ref.current != null && pointerLock
    const speed = sprinting ? 10 : 5
    // const speed = sprinting ? 4 : 2

    if (!canMove) return

    ref.current.position.set(positionRef.current[0], positionRef.current[1], positionRef.current[2])

    const rotationalVec = new Vector3()
    state.camera.getWorldDirection(rotationalVec) // this vector is relative to the camera itself
    rotationalVec.y = 0

    const rotationalVecAbsolute = rotationalVec.clone().add(ref.current.position) // make the vector absolute to the world

    ref.current.lookAt(rotationalVecAbsolute)
    // physicsAPI.rotation.copy(ref.current.rotation) // todo: shouldn't be necessary once we ditch the cube

    axesRef.current?.setRotationFromQuaternion(ref.current.quaternion)
    axesRef.current?.position.set(ref.current.position.x, ref.current.position.y - 0.75, ref.current.position.z)

    if (walkingForwards) {
      const velocityDirection = new Vector3(0, 0, speed).applyQuaternion(ref.current.quaternion)
      velocityDirection.setY(0)
      console.log('velocity direction', velocityDirection)
      referenceSphere.current?.position.set(...ref.current.position.clone().add(velocityDirection).toArray())
      physicsAPI.velocity.set(velocityDirection.x, velocityDirection.y, velocityDirection.z)
    }

    if (walkingBackwards) {
      physicsAPI.velocity.set(0, velocityRef.current[1], -speed)
    }

    if (walkingLeft) {
      physicsAPI.velocity.set(speed, velocityRef.current[1], 0)
    }

    if (walkingRight) {
      physicsAPI.velocity.set(-speed, velocityRef.current[1], 0)
    }

    const cameraPosition = ref.current.position.clone()
    cameraPosition.sub(rotationalVec)
    cameraPosition.setY(ref.current.position.y + 1.5)

    state.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
  })

  useEffect(() => {
    if (ws == null) return

    let ticker

    if (ref.current != null) {
      let lastPosition = new Vector3(0, 1000, 0) // todo: make this smarter, currently this is used to trigger the interval FN at least once
      ticker = setInterval(() => {
        if (ref.current == null) return // only added for the TS linter

        const currentPosition = ref.current.position.clone()
        const difference = currentPosition.clone().sub(lastPosition)

        if (difference.x !== 0 || difference.y !== 0 || difference.z !== 0) {
          ws.send(createPacket(ClientPacketKeys.PLAYER_CHARACTER_POSITION, currentPosition.toArray()))
          lastPosition = currentPosition
        }
      }, 1000 / 60)
    }

    return () => {
      ticker != null && clearInterval(ticker)
    }
  }, [ref.current, ws])

  return (
    <>
      <PlayerModel ref={ref} self />
      <primitive object={new THREE.AxesHelper(5)} ref={axesRef} />
      <mesh ref={referenceSphere}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshBasicMaterial color='pink' />
      </mesh>
    </>
  )
}

export default Player
