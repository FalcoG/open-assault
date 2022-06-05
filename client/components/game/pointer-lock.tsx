import { useContext, useEffect, useState } from 'react'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { RendererContext } from './renderer'

const PointerLock = ({ lock, lockChange }: {
  lock: boolean
  lockChange: (active: boolean) => void
}): JSX.Element => {
  const { camera } = useContext(RendererContext)

  const [pointerControls, setPointerControls] = useState<PointerLockControls | undefined>()
  const [pointerLock, setPointerLock] = useState<boolean>(false)

  const destroy = (): void => {
    if (pointerControls != null) {
      pointerControls.dispose()
    }
  }

  /**
   * Pointer lock register & handler
   */
  useEffect(() => {
    if (camera == null) {
      destroy()

      return
    }
    const controls = new PointerLockControls(camera, document.body)

    setPointerControls(controls)

    controls.addEventListener('lock', function () {
      setPointerLock(true)
      lockChange(true)
    })

    controls.addEventListener('unlock', function () {
      setPointerLock(false)
      lockChange(false)
    })

    return () => {
      destroy()
    }
  }, [camera])

  /**
   * Pointer lock request by user
   */
  useEffect(() => {
    if (!pointerLock && pointerControls != null && lock) {
      pointerControls.lock()
    }
  }, [lock])

  return <></>
}

export default PointerLock
