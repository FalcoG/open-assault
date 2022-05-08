import React from 'react'
import { PacketKeys, Packets } from 'open-assault-core/networking'

export const NetworkContext = React.createContext<{
  uuid?: string
  ws?: WebSocket
  eventDispatch: EventTarget
}>({ ws: undefined, eventDispatch: new EventTarget() })

export function addCustomListener<T extends PacketKeys> (
  eventTarget: EventTarget,
  eventName: T,
  callback: (evt: CustomEvent<Packets[T]>) => void
): () => void {
  eventTarget.addEventListener(eventName, callback)

  return () => {
    eventTarget.removeEventListener(eventName, callback)
  }
}
