import { ClientPacketKeys, ClientPackets, ServerPacketKeys, ServerPackets } from 'open-assault-core/networking'
import React from 'react'

export const NetworkContext = React.createContext<{
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
