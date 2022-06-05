import React, { useState, useEffect } from 'react'

import Menu from './gui/menu'
import Chat from './gui/chat'
import Scoreboard from './gui/scoreboard'
import Renderer from './game/renderer'

import { NetworkContext } from '../lib/game/networking'

import Camera from './game/camera'
import Resizer from './game/resizer'
import PointerLock from './game/pointer-lock'

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
      <Renderer
        onClick={() => {
          setPointerLock(true)
        }}
      >
        <PointerLock
          lock={pointerLock}
          lockChange={(active) => { setPointerLock(active) }}
        />
        <Camera />
        <Resizer />
      </Renderer>
      <br />
      Pointer lock: {JSON.stringify(pointerLock)}

      <Menu visible={!pointerLock} />
      <Scoreboard disabled={!pointerLock} />
      <Chat />
    </NetworkContext.Provider>
  )
}

export default Game
