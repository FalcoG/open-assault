export const enum PacketKeys {
  CHAT_MESSAGE = 'message'
}

export interface Packets {
  [PacketKeys.CHAT_MESSAGE]: {
    data: string
  }
}
