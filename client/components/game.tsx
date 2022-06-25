import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'

import Menu from './gui/menu'
import Chat from './gui/chat'
import Scoreboard from './gui/scoreboard'

import { NetworkContext } from '../lib/game/networking'

import TestCube from './game/mesh/test-cube'

const Game: React.FunctionComponent = () => {
  const [pointerLock, setPointerLock] = useState<boolean>(false)

  const [socket, setSocket] = useState<WebSocket>()
  const [networkEventDispatch] = useState(new EventTarget())

  useEffect(() => {
    setSocket(new WebSocket('ws://localhost:8080'))
  }, [])

  useEffect(() => {
    if (socket == null) return

    const packetHandler = (message: any): void => {
      try {
        const parsed = JSON.parse(message.data)

        networkEventDispatch.dispatchEvent(new CustomEvent(parsed.type, { detail: parsed.data }))
      } catch (e) {
        console.log('Malformed server packet', message)
      }
    }

    socket.addEventListener('message', packetHandler)

    return () => {
      socket.removeEventListener('message', packetHandler)
    }
  }, [socket])

  return (
    <NetworkContext.Provider value={{ ws: socket, eventDispatch: networkEventDispatch }}>
      <Canvas
        style={{ position: 'fixed', top: 0 }}
      >
        <TestCube />
        <PointerLockControls
          onLock={(e) => {
            setPointerLock(true)
            console.log('lock', e)
          }}
          onUnlock={(e) => {
            setPointerLock(false)
            console.log('unlock', e)
          }}
        />
      </Canvas>

      <Menu visible={!pointerLock} />
      <Scoreboard disabled={!pointerLock} />
      <Chat />
    </NetworkContext.Provider>
  )
}

export default Game
