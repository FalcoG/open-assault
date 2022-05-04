import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'

import Menu from './game/menu'
import Chat from './game/chat'
import PointerLock from './game/pointer-lock'

import { NetworkContext } from '../lib/game/networking'

function Game (): JSX.Element {
  const canvas = useRef<HTMLCanvasElement>(null)
  const renderRef = useRef<null | number>(null)

  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>()
  const [rendering, setRendering] = useState(false)

  const [scene, setScene] = useState<THREE.Scene>()
  const [camera, setCamera] = useState<THREE.Camera>()
  const [testCube, setTestCube] = useState<THREE.Mesh>()

  const [pointerLock, setPointerLock] = useState<boolean>(false)

  const [socket, setSocket] = useState<WebSocket>()

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

  useEffect(() => {
    setSocket(new WebSocket('ws://localhost:8080'))
  }, [])

  useEffect(() => {
    if (socket == null) return

    const packetHandler = (message: any): void => {
      try {
        const parsed = JSON.parse(message.data)
        socket.dispatchEvent(new CustomEvent('packet', { detail: parsed }))
      } catch (e) {
        console.log('Malformed server packet', message)
      }
    }

    socket.addEventListener('message', packetHandler)

    return () => {
      socket.removeEventListener('message', packetHandler)
    }
  }, [socket])

  return (
    <NetworkContext.Provider value={{ ws: socket }}>
      <canvas
        id='game' ref={canvas} onClick={() => {
          setPointerLock(true)
        }}
      />
      {camera != null &&
        <PointerLock
          lock={pointerLock}
          lockChange={(active) => {
            setPointerLock(active)
          }}
          camera={camera}
        />}
      <br />
      <button
        onClick={() => {
          setRendering(!rendering)
        }}
      >
        Toggle rendering, current: {JSON.stringify(rendering)}
      </button>
      Pointer lock: {JSON.stringify(pointerLock)}

      <Menu visible={!pointerLock} />
      <Chat />
    </NetworkContext.Provider>
  )
}

export default Game
