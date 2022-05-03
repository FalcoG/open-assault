import React from 'react'

export const NetworkContext = React.createContext<{
  connected: boolean
  ws?: WebSocket
}>({ connected: false, ws: undefined })
