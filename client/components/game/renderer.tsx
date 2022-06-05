import React, { useState, useEffect, useRef, RefObject } from 'react'
import * as THREE from 'three'
import styles from './renderer.module.scss'

export const RendererContext = React.createContext<{
  canvas: null | RefObject<HTMLCanvasElement>
  renderer?: THREE.WebGLRenderer
  rendering: boolean
  scene?: THREE.Scene
  camera?: THREE.Camera | THREE.PerspectiveCamera
  setCamera?: (camera: THREE.Camera | THREE.PerspectiveCamera) => void
}>({ canvas: null, rendering: false })

const Renderer: React.FunctionComponent<{
  children?: React.ReactNode
  onClick?: () => void
}> = ({ children, onClick: onClickHandler }) => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const renderRef = useRef<null | number>(null)

  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>()
  const [rendering, setRendering] = useState<boolean>(false)
  const [camera, setCamera] = useState<THREE.Camera | THREE.PerspectiveCamera>()
  const [scene] = useState<THREE.Scene>(new THREE.Scene())

  useEffect(() => {
    if (canvas.current !== null) {
      const glRenderer = new THREE.WebGLRenderer({
        canvas: canvas.current
      })

      setRenderer(glRenderer)
    }
  }, [canvas])

  const [testCube, setTestCube] = useState<THREE.Mesh>()

  useEffect(() => {
    if (renderer == null || testCube !== undefined) return

    const boxWidth = 1
    const boxHeight = 1
    const boxDepth = 1
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)

    const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 })

    const cube = new THREE.Mesh(geometry, material)

    scene.add(cube)

    setTestCube(cube)
    setRendering(true)
  }, [canvas, renderer])

  // lead frame renderer
  useEffect(() => {
    console.log('useEffect anim frame', renderer, rendering)

    function render (time): void {
      // todo: add array of render hooks, for example to remove the rotating test cube logic from the renderer file
      time *= 0.001 // convert time to seconds

      if (testCube !== undefined) {
        testCube.rotation.x = time
        testCube.rotation.y = time
      }
      if (renderer != null && camera != null) renderer.render(scene, camera)

      renderRef.current = requestAnimationFrame(render)
    }

    if (renderer !== undefined && rendering) {
      renderRef.current = requestAnimationFrame(render)
    }

    return () => {
      if (typeof renderRef.current === 'number') {
        cancelAnimationFrame(renderRef.current)
      }
    }
  }, [renderer, rendering, scene, camera, testCube])

  return (
    <RendererContext.Provider value={{ canvas: canvas, renderer, rendering, camera, setCamera, scene }}>
      <canvas
        id='game'
        ref={canvas}
        className={styles.canvas}
        onClick={onClickHandler}
      />
      {children}
    </RendererContext.Provider>
  )
}

export default Renderer
