import { useContextBridge } from '@react-three/drei'
import React from 'react'

import { NetworkDataContext } from '../../lib/game/network-data'
import { NetworkContext } from '../../lib/game/networking'

const ContextBridge: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const Bridge = useContextBridge(NetworkContext, NetworkDataContext)
  return (
    <Bridge>
      {children}
    </Bridge>
  )
}

export default ContextBridge
