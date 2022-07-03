import { useContext, useEffect, useState } from 'react'

import { GameStateContext } from '../../lib/game/game-state'
import { NetworkDataContext } from '../../lib/game/network-data'
import keybinds from '../../lib/keybinds'
import Overlay from './overlay'
import styles from './scoreboard.module.scss'

const Scoreboard = (): JSX.Element => {
  const [visible, setVisible] = useState(false)
  const { players } = useContext(NetworkDataContext)
  const { pointerLock } = useContext(GameStateContext)

  useEffect(() => {
    if (visible && !pointerLock) {
      setVisible(false)
    }
  }, [pointerLock])

  useEffect(() => {
    const keyPress = (e): void => {
      if (pointerLock && e.key === keybinds.scoreboard_open) {
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
  }, [pointerLock])

  return visible
    ? (
      <Overlay position={['center', 'center']}>
        <div className={styles.scoreboard}>
          scoreboard!
          <ul>
            {players.map(player =>
              <li key={player.uuid}>{player.username}, id: {player.uuid}</li>
            )}
          </ul>
        </div>
      </Overlay>
      )
    : <></>
}

export default Scoreboard
