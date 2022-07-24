import { randomUUID } from 'crypto'
import { ClientServerEventKeys } from 'open-assault-core/client-server-events'
import { ClientPacketKeys, ServerPacketKeys } from 'open-assault-core/networking'

import Server from './class/Server'

const server = new Server()

server.onClientConnection((ws) => {
  const uuid = randomUUID()

  ws.id = uuid

  server.send(ws, ServerPacketKeys.PLAYER_IDENTIFY_SELF, {
    uuid
  })

  server.send(ws, ServerPacketKeys.CHAT_MESSAGE, {
    text: `Welcome ${uuid}!`,
    origin: 'SERVER'
  })

  server.broadcast(ServerPacketKeys.PLAYER_JOIN, {
    uuid: ws.id,
    username: ws.id
  }, [ws])

  const playersData = server.clients.map(ws => {
    return {
      uuid: ws.id,
      username: ws.id
    }
  })

  server.send(ws, ServerPacketKeys.PLAYERS, { players: playersData })
})

server.onClientEvent(ClientServerEventKeys.DISCONNECT, (ws, data) => {
  server.broadcast(ServerPacketKeys.PLAYER_LEAVE, {
    uuid: ws.id
  })
})

server.onClientPacket(ClientPacketKeys.CHAT_MESSAGE, (ws, data) => {
  console.log('server:OnClientPacket', data)

  server.broadcast(ServerPacketKeys.CHAT_MESSAGE, {
    text: data,
    origin: ws.id
  })
})

server.onClientPacket(ClientPacketKeys.PLAYER_CHARACTER_POSITION, (ws, data) => {
  console.log('player sent his position', data)
  // todo: accumulate and send according to tick-rate
  // todo: send initial positioning when a new player joins
  server.broadcast(ServerPacketKeys.PLAYERS_UPDATE, {
    [ws.id]: { position: data }
  })
})
