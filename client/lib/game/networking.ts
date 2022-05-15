import React from 'react'
import { ServerPacketKeys, ServerPackets, ClientPacketKeys, ClientPackets } from 'open-assault-core/networking'

export const NetworkContext = React.createContext<{
  uuid?: string
  ws?: WebSocket
  eventDispatch: EventTarget
}>({ ws: undefined, eventDispatch: new EventTarget() })

export function addCustomListener<T extends ServerPacketKeys> (
  eventTarget: EventTarget,
  eventName: T,
  callback: (evt: CustomEvent<ServerPackets[T]>) => void
): () => void {
  eventTarget.addEventListener(eventName, callback)

  return () => {
    eventTarget.removeEventListener(eventName, callback)
  }
}

export function createPacket<T extends ClientPacketKeys> (
  eventName: T,
  data: ClientPackets[T]
): string {
  return JSON.stringify({
    type: eventName,
    data
  })
}
