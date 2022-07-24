import React, { useContext } from 'react'

import { NetworkDataContext } from '../../lib/game/network-data'
import PlayerModel from './mesh/player-model'

const Players = (): JSX.Element => {
  const { players, uuid } = useContext(NetworkDataContext)

  return (
    <>
      {players.filter(player => player.uuid !== uuid).map(player => {
        return <PlayerModel key={player.uuid} self={false} position={player.position} />
      })}
    </>
  )
}

export default Players
