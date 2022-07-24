export const enum ClientPacketKeys {
  CHAT_MESSAGE = 'message',
  PLAYER_CHARACTER_POSITION = 'playerCharacterPosition',
}

export const enum ServerPacketKeys {
  CHAT_MESSAGE = 'message',
  PLAYERS = 'players',
  PLAYERS_UPDATE = 'playersUpdate',
  PLAYER_IDENTIFY_SELF = 'playerIdentifySelf',
  PLAYER_JOIN = 'playerJoin',
  PLAYER_LEAVE = 'playerLeave',
}

// packets that originate from the client
export interface ClientPackets {
  [ClientPacketKeys.CHAT_MESSAGE]: string
  [ClientPacketKeys.PLAYER_CHARACTER_POSITION]: [x: number, y: number, z: number]
}

interface PlayerPacketBase {
  uuid: string
}

type PlayerPacketInitial = PlayerPacketBase & {
  username: string
}

interface PlayerPacketUpdate {
  position?: [x: number, y: number, z: number]
}

export type PlayerInfo = PlayerPacketBase & PlayerPacketInitial & PlayerPacketUpdate

// packets that originate from the server
export interface ServerPackets {
  [ServerPacketKeys.CHAT_MESSAGE]: {
    text: string
    origin: string
  }
  [ServerPacketKeys.PLAYERS]: {
    players: PlayerPacketInitial[]
  }
  [ServerPacketKeys.PLAYERS_UPDATE]: { [uuid: string]: PlayerPacketUpdate }
  [ServerPacketKeys.PLAYER_IDENTIFY_SELF]: {
    uuid: string
  }
  [ServerPacketKeys.PLAYER_JOIN]: PlayerPacketInitial
  [ServerPacketKeys.PLAYER_LEAVE]: {
    uuid: string
  }
}
