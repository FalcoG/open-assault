import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

import Chat from './game/chat'

function Game (): JSX.Element {
  const canvas = useRef<HTMLCanvasElement>(null)
  const renderRef = useRef<null | number>(null)

  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>()
  const [rendering, setRendering] = useState(false)

  const [scene, setScene] = useState<THREE.Scene>()
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>()
  const [testCube, setTestCube] = useState<THREE.Mesh>()

  const [pointerControls, setPointerControls] = useState<PointerLockControls | undefined>()
  const [pointerLock, setPointerLock] = useState<boolean>(false)

  useEffect(() => {
    if (canvas.current == null) return
    console.log('useEffect renderer')

    const glRenderer = new THREE.WebGLRenderer({
      canvas: canvas.current
    })

    setRenderer(glRenderer)

    const fov = 75
    const aspect = 2 // the canvas default
    const near = 0.1
    const far = 5
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

    camera.position.z = 2

    setCamera(camera)

    const scene = new THREE.Scene()
    setScene(scene)

    const boxWidth = 1
    const boxHeight = 1
    const boxDepth = 1
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)

    const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 })

    const cube = new THREE.Mesh(geometry, material)

    scene.add(cube)

    setTestCube(cube)
    setRendering(true)
  }, [canvas])

  /**
   * Pointer lock register & handler
   */
  useEffect(() => {
    if (camera == null) {
      if (pointerControls != null) {
        pointerControls.dispose()
      }

      return
    }
    const controls = new PointerLockControls(camera as THREE.Camera, document.body)

    setPointerControls(controls)

    controls.addEventListener('lock', function () {
      setPointerLock(true)
    })

    controls.addEventListener('unlock', function () {
      setPointerLock(false)
    })
  }, [camera])

  /**
   * Pointer lock request by user
   */
  const requestPointerLock = (): void => {
    if (!pointerLock && pointerControls != null) {
      pointerControls.lock()
    }
  }

  useEffect(() => {
    console.log('useEffect anim frame', renderer, rendering)

    function render (time): void {
      time *= 0.001 // convert time to seconds

      // @ts-expect-error
      testCube.rotation.x = time
      // @ts-expect-error
      testCube.rotation.y = time

      // @ts-expect-error
      renderer.render(scene, camera)

      renderRef.current = requestAnimationFrame(render)
    }

    if (renderer instanceof THREE.WebGLRenderer && rendering) {
      renderRef.current = requestAnimationFrame(render)
    }

    return () => {
      if (typeof renderRef.current === 'number') {
        cancelAnimationFrame(renderRef.current)
      }
    }
  }, [renderer, rendering, testCube])

  return (
    <div>
      <canvas
        id='game' ref={canvas} onClick={() => {
          requestPointerLock()
        }}
      />
      <br />
      <button
        onClick={() => {
          setRendering(!rendering)
        }}
      >
        Toggle rendering, current: {JSON.stringify(rendering)}
      </button>
      Pointer lock: {JSON.stringify(pointerLock)}

      <Chat />
    </div>
  )
}

export default Game