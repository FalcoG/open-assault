import React, { useCallback, useContext, useEffect } from 'react'

import { ServerPacketKeys } from 'open-assault-core/networking'

import { addCustomListener, NetworkContext } from './networking'
import { NetworkDataContext } from './network-data'

const PlayerCollector: React.FunctionComponent = () => {
  const { eventDispatch } = useContext(NetworkContext)
  const { players, setPlayers } = useContext(NetworkDataContext)

  const populatePlayer = useCallback((playerPacket): void => {
    setPlayers((prevData) => {
      return [...prevData, ...playerPacket]
    })
  }, [players])

  useEffect(() => {
    const populateListener = addCustomListener(eventDispatch, ServerPacketKeys.PLAYERS, (event): void => {
      const packet = event.detail
      populatePlayer(packet.players)
    })

    const joinListener = addCustomListener(eventDispatch, ServerPacketKeys.PLAYER_JOIN, (event) => {
      const packet = event.detail

      populatePlayer([packet])
    })

    return () => {
      populateListener()
      joinListener()
    }
  })

  useEffect(() => {
    return addCustomListener(
      eventDispatch,
      ServerPacketKeys.PLAYER_LEAVE,
      (event) => {
        const packet = event.detail

        setPlayers((prevState) =>
          prevState.filter(player => player.uuid !== packet.uuid)
        )
      })
  })

  return <></>
}

export default PlayerCollector
