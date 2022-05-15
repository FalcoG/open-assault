import { ServerPacketKeys, ServerPackets } from 'open-assault-core/networking'

export function createPacket<T extends ServerPacketKeys> (
  eventName: T,
  data: ServerPackets[T]
): string {
  return JSON.stringify({
    type: eventName,
    data
  })
}
