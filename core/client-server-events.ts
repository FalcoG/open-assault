export const enum ClientServerEventKeys {
  DISCONNECT = 'disconnect',
}

export interface ClientServerEvents {
  [ClientServerEventKeys.DISCONNECT]: { reason: number }
}
