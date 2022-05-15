import { randomUUID } from 'crypto'
import { ClientPacketKeys, ServerPacketKeys } from 'open-assault-core/networking'
import { createPacket } from './lib/create-packet'
import Server from './class/Server'

const server = new Server()

server.onClientConnection((ws) => {
  const uuid = randomUUID()

  ws.id = uuid

  ws.send(createPacket(ServerPacketKeys.CHAT_MESSAGE, {
    text: `Welcome ${uuid}!`,
    origin: 'SERVER'
  }))

  ws.send(JSON.stringify({
    type: 'set',
    data: { id: uuid }
  }))
})

server.onClientPacket(ClientPacketKeys.CHAT_MESSAGE, (ws, data) => {
  console.log('client packet onclientpacket', data)

  ws.send(createPacket(ServerPacketKeys.CHAT_MESSAGE, {
    text: data,
    origin: ws.id
  }))
})

setInterval(() => {
  server.wss.clients.forEach((ws) => {
    ws.send(createPacket(ServerPacketKeys.CHAT_MESSAGE, {
      text: Date.now().toString(),
      origin: 'SERVER'
    }))
  })
}, 10000)
