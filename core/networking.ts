export const enum ClientPacketKeys {
  CHAT_MESSAGE = 'message',
}

export const enum ServerPacketKeys {
  CHAT_MESSAGE = 'message',
  PLAYERS = 'players',
  PLAYER_JOIN = 'playerJoin',
  PLAYER_LEAVE = 'playerLeave',
}

// packets that originate from the client
export interface ClientPackets {
  [ClientPacketKeys.CHAT_MESSAGE]: string
}

interface PlayerPacket {
  uuid: string
  username: string
}

// packets that originate from the server
export interface ServerPackets {
  [ServerPacketKeys.CHAT_MESSAGE]: {
    text: string
    origin: string
  }
  [ServerPacketKeys.PLAYERS]: {
    players: PlayerPacket[]
  }
  [ServerPacketKeys.PLAYER_JOIN]: PlayerPacket
  [ServerPacketKeys.PLAYER_LEAVE]: {
    uuid: string
  }
}
