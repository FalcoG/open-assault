import React, { Dispatch, SetStateAction, useState } from 'react'
import PlayerCollector from './player-collector'

interface NetworkData {
  players: Array<{
    uuid: string
    username: string
  }>
}

export const NetworkDataContext = React.createContext<{
  players: NetworkData['players']
  setPlayers: Dispatch<SetStateAction<NetworkData['players']>>
}>({ players: [], setPlayers: () => {} })

export const NetworkDataProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<NetworkData['players']>([])

  return (
    <NetworkDataContext.Provider value={{ players, setPlayers }}>
      <PlayerCollector />
      {children}
    </NetworkDataContext.Provider>
  )
}
