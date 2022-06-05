import { useCallback, useContext, useEffect, useState } from 'react'

import { ServerPacketKeys } from 'open-assault-core/networking'

import { addCustomListener, NetworkContext } from '../../lib/game/networking'
import keybinds from '../../lib/keybinds'
import Overlay from './overlay'

const Scoreboard = (
  { disabled }: { disabled: boolean }
): JSX.Element => {
  const { eventDispatch } = useContext(NetworkContext)
  const [visible, setVisible] = useState(false)
  const [playerData, setPlayerData] = useState<Array<{
    uuid: string
    username: string
  }>>([]) // todo: maybe base this TS type on the packet data

  useEffect(() => {
    if (visible && disabled) {
      setVisible(false)
    }
  }, [disabled])

  useEffect(() => {
    const keyPress = (e): void => {
      if (!disabled && e.key === keybinds.scoreboard_open) {
        e.preventDefault()

        if (e.type === 'keydown') {
          setVisible(true)
        } else if (e.type === 'keyup') {
          setVisible(false)
        }
      }
    }

    document.addEventListener('keydown', keyPress)
    document.addEventListener('keyup', keyPress)

    return () => {
      document.removeEventListener('keydown', keyPress)
      document.removeEventListener('keyup', keyPress)
    }
  }, [disabled])

  const addPlayerToScoreboard = useCallback((playerPacket): void => {
    setPlayerData((prevData) => {
      return [...prevData, ...playerPacket]
    })
  }, [playerData])

  useEffect(() => {
    const populateListener = addCustomListener(eventDispatch, ServerPacketKeys.PLAYERS, (event): void => {
      const packet = event.detail
      addPlayerToScoreboard(packet.players)
    })

    const joinListener = addCustomListener(eventDispatch, ServerPacketKeys.PLAYER_JOIN, (event) => {
      const packet = event.detail

      addPlayerToScoreboard([packet])
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

        setPlayerData((prevState) =>
          prevState.filter(player => player.uuid !== packet.uuid)
        )
      })
  })

  return visible
    ? (
      <Overlay position={['center', 'top']}>scoreboard!
        <ul>
          {playerData.map(player =>
            <li key={player.uuid}>{player.username}, id: {player.uuid}</li>
          )}
        </ul>
      </Overlay>
      )
    : <></>
}

export default Scoreboard
