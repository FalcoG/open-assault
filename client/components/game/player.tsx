import { useSphere } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'
import { ClientPacketKeys } from 'open-assault-core/networking'
import React, { useContext, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Vector3 } from 'three'

import { GameStateContext } from '../../lib/game/game-state'
import { createPacket, NetworkContext } from '../../lib/game/networking'
import keymap from '../../lib/keymap'
import PlayerModel from './mesh/player-model'

const Player = (): JSX.Element => {
  const ref = useRef<THREE.Group>(null)
  const [walkingForwards, setWalkingForwards] = useState(false)
  const [walkingBackwards, setWalkingBackwards] = useState(false)
  const [walkingLeft, setWalkingLeft] = useState(false)
  const [walkingRight, setWalkingRight] = useState(false)
  const [sprinting, setSprinting] = useState(false)
  const { pointerLock } = useContext(GameStateContext)
  const { ws } = useContext(NetworkContext)
  const [physicsRef, physicsAPI] = useSphere(() => ({
    mass: 1,
    args: [0.5],
    position: [0, 2, 0],
    fixedRotation: true
  }))

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
    physicsAPI.position.subscribe((v) => {
      ref.current?.position.set(...v)
    })
  }, [ref.current])

  useFrame((state, delta) => {
    const canMove = ref.current != null && physicsRef.current != null && pointerLock
    const speed = sprinting ? 8 : 5

    if (!canMove) return

    if (walkingForwards) {
      physicsAPI.velocity.set(0, 0, speed)
    }

    if (walkingBackwards) {
      physicsAPI.velocity.set(0, 0, -speed)
    }

    if (walkingLeft) {
      physicsAPI.velocity.set(speed, 0, 0)
    }

    if (walkingRight) {
      physicsAPI.velocity.set(-speed, 0, 0)
    }
  })

  /**
   * Camera updater
   */
  useFrame((state, delta) => {
    const canUpdate = ref.current != null && physicsRef.current != null

    if (!canUpdate) return

    const rotationalVec = new Vector3()
    state.camera.getWorldDirection(rotationalVec) // this vector is relative to the camera itself
    rotationalVec.y = 0
    ref.current.lookAt(rotationalVec.clone().add(ref.current.position)) // make the vector absolute to the world

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
          console.log('tick, update position', currentPosition, difference)
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
    <PlayerModel ref={ref} self />
  )
}

export default Player
