import React from 'react'

export const NetworkContext = React.createContext<{
  uuid?: string
  ws?: WebSocket
}>({ ws: undefined })
