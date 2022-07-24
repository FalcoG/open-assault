import { PlayerInfo } from 'open-assault-core/networking'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import PlayerCollector from './player-collector'

interface NetworkData {
  uuid: string // uuid of current client
  self: PlayerInfo
  players: PlayerInfo[]
}

export const NetworkDataContext = React.createContext<{
  self?: PlayerInfo
  players: PlayerInfo[]
  setPlayers: Dispatch<SetStateAction<NetworkData['players']>>
  uuid?: NetworkData['uuid']
  setUUID: Dispatch<SetStateAction<NetworkData['uuid']>>
}>({
  players: [],
  setPlayers: () => {},
  setUUID: () => {}
})

export const NetworkDataProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<NetworkData['players']>([])
  const [uuid, setUUID] = useState<NetworkData['uuid']>()
  const [reference, setReference] = useState<PlayerInfo>()

  useEffect(() => {
    // todo: can effects be run-once and discarded?
    if (reference != null) return
    const player = players.find(player => player.uuid === uuid) // is this a copy or reference?
    setReference(player)
  }, [players, reference])

  return (
    <NetworkDataContext.Provider value={{ players, setPlayers, uuid, setUUID, self: reference }}>
      <PlayerCollector />
      {children}
    </NetworkDataContext.Provider>
  )
}
