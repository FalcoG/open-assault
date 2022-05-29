import { useEffect, useState } from 'react'
import keybinds from '../../lib/keybinds'
import Overlay from '../gui/overlay'

const Scoreboard = (
  { disabled }: { disabled: boolean }
): JSX.Element => {
  const [visible, setVisible] = useState(false)

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

  return visible ? <Overlay position={['center', 'top']}>scoreboard!</Overlay> : <></>
}

export default Scoreboard
