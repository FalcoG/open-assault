import { useEffect, useState } from 'react'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import * as THREE from 'three'

const PointerLock = ({ lock, lockChange, camera }: {
  lock: boolean
  lockChange: (active: boolean) => void
  camera: THREE.Camera
}): JSX.Element => {
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
