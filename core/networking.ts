export interface Packets {
  chatMessage: {
    data: string
  }
  chatMessageSubmit: {
    data: string
  }
}

export type PacketNames = keyof Packets
