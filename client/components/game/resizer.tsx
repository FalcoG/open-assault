import React, { useContext, useCallback, useEffect, useLayoutEffect } from 'react'
import * as THREE from 'three'

import { RendererContext } from './renderer'

const Resizer: React.FunctionComponent = () => {
  const { camera, renderer } = useContext(RendererContext)

  const updateCanvasSize = useCallback((): void => {
    if (renderer != null && camera != null) {
      renderer.setSize(window.innerWidth, window.innerHeight)

      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
      }
    }
  }, [renderer, camera])

  // canvas size updater
  useEffect(() => {
    updateCanvasSize()
  }, [renderer, camera])

  typeof window !== 'undefined' && useLayoutEffect(() => {
    if (renderer != null) {
      window.addEventListener('resize', updateCanvasSize)
    }

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [renderer])

  return <></>
}

export default Resizer
