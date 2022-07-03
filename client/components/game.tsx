import React, { useEffect, useState } from 'react'

import { GameStateProvider } from '../lib/game/game-state'
import { NetworkDataProvider } from '../lib/game/network-data'
import { NetworkContext } from '../lib/game/networking'
import Canvas from './game/canvas'
import Chat from './gui/chat'
import Menu from './gui/menu'
import Scoreboard from './gui/scoreboard'

const Game: React.FunctionComponent = () => {
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
      <NetworkDataProvider>
        <GameStateProvider>
          <Canvas />

          <Scoreboard />

          <Menu />
          <Chat />
        </GameStateProvider>
      </NetworkDataProvider>
    </NetworkContext.Provider>
  )
}

export default Game
