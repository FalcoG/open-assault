import { PlayerInfo } from 'open-assault-core/networking'
import React from 'react'
import * as THREE from 'three'

const PlayerModel = React.forwardRef(
  (props: JSX.IntrinsicElements['mesh'] & {
    self: boolean
    position?: PlayerInfo['position']
  }, ref: React.RefObject<THREE.Group>) => (
    <group
      ref={ref}
      position={props.position}
    >
      <mesh>
        {/* <boxGeometry args={[1, 2, 1]} /> */}
        <sphereGeometry args={[0.5]} />
        {props.self && <pointLight position={[0, 10, 0]} color='white' />}
        <meshPhongMaterial color={props.self ? 'red' : 'purple'} />
      </mesh>
    </group>
  ))

export default PlayerModel
