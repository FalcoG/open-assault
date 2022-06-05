import React, { useContext, useEffect } from 'react'
import { RendererContext } from './renderer'
import * as THREE from 'three'

const Camera: React.FunctionComponent = () => {
  const { canvas, setCamera } = useContext(RendererContext)

  useEffect(() => {
    const fov = 75
    const aspect = 2 // the canvas default
    const near = 0.1
    const far = 5
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

    camera.position.z = 2

    setCamera?.(camera)
  }, [canvas, setCamera])

  return <></>
}

export default Camera
