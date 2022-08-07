import { usePlane } from '@react-three/cannon'
import React from 'react'

const Surface: React.FunctionComponent = () => {
  const [planeSurface] = usePlane(() => ({ material: 'ground', type: 'Static', rotation: [-Math.PI / 2, 0, 0] }))
  return (
    // @ts-expect-error - TODO: TS typing - not a good workaround, fix this
    <mesh ref={planeSurface}>
      <planeGeometry args={[100, 100]} />
    </mesh>
  )
}
export default Surface
