export const enum ClientPacketKeys {
  CHAT_MESSAGE = 'message',
}

export const enum ServerPacketKeys {
  CHAT_MESSAGE = 'message',
}

// packets that originate from the client
export interface ClientPackets {
  [ClientPacketKeys.CHAT_MESSAGE]: string
}

// packets that originate from the server
export interface ServerPackets {
  [ServerPacketKeys.CHAT_MESSAGE]: {
    text: string
    origin: string
  }
}
