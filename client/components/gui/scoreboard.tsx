import { useContext, useEffect, useState } from 'react'

import keybinds from '../../lib/keybinds'
import Overlay from './overlay'
import { NetworkDataContext } from '../../lib/game/network-data'

const Scoreboard = (
  { disabled }: { disabled: boolean }
): JSX.Element => {
  const [visible, setVisible] = useState(false)
  const { players } = useContext(NetworkDataContext)

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

  return visible
    ? (
      <Overlay position={['center', 'top']}>scoreboard!
        <ul>
          {players.map(player =>
            <li key={player.uuid}>{player.username}, id: {player.uuid}</li>
          )}
        </ul>
      </Overlay>
      )
    : <></>
}

export default Scoreboard
