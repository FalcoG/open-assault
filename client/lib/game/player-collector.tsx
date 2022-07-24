import { ServerPacketKeys } from 'open-assault-core/networking'
import React, { useCallback, useContext, useEffect } from 'react'

import { NetworkDataContext } from './network-data'
import { addCustomListener, NetworkContext } from './networking'

const PlayerCollector: React.FunctionComponent = () => {
  const { eventDispatch } = useContext(NetworkContext)
  const { players, setPlayers, setUUID } = useContext(NetworkDataContext)

  const populatePlayer = useCallback((playerPacket): void => {
    setPlayers((prevData) => {
      return [...prevData, ...playerPacket]
    })
  }, [players])

  useEffect(() => {
    return addCustomListener(eventDispatch, ServerPacketKeys.PLAYER_IDENTIFY_SELF, (event): void => {
      const uuid = event.detail.uuid

      setUUID(uuid) // todo: could remove listener? as this event fires once

      console.log('player uuid confirmed', uuid)
    })
  })

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
    return addCustomListener(eventDispatch, ServerPacketKeys.PLAYERS_UPDATE, (event): void => {
      const updatedPlayersData = event.detail

      setPlayers((prevData) => {
        return prevData.map(player => {
          return {
            ...player,
            ...updatedPlayersData[player.uuid]
          }
        })
      })
    })
  }, [])

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
