import { randomUUID } from 'crypto'
import { ClientPacketKeys, ServerPacketKeys } from 'open-assault-core/networking'
import { ClientServerEventKeys } from 'open-assault-core/client-server-events'
import Server from './class/Server'

const server = new Server()

server.onClientConnection((ws) => {
  const uuid = randomUUID()

  ws.id = uuid

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

  ws.send(JSON.stringify({
    type: 'set',
    data: { id: uuid }
  }))
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
