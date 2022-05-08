import { PacketKeys, Packets } from 'open-assault-core/networking'

export function createPacket<T extends PacketKeys> (
  eventName: T,
  data: Packets[T]
): string {
  return JSON.stringify({
    type: eventName,
    data
  })
}
