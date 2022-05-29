import { randomUUID } from 'crypto'
import { ClientPacketKeys, ServerPacketKeys } from 'open-assault-core/networking'
import Server from './class/Server'

const server = new Server()

server.onClientConnection((ws) => {
  const uuid = randomUUID()

  ws.id = uuid

  server.send(ws, ServerPacketKeys.CHAT_MESSAGE, {
    text: `Welcome ${uuid}!`,
    origin: 'SERVER'
  })

  ws.send(JSON.stringify({
    type: 'set',
    data: { id: uuid }
  }))
})

server.onClientPacket(ClientPacketKeys.CHAT_MESSAGE, (ws, data) => {
  console.log('client packet onclientpacket', data)

  server.broadcast(ServerPacketKeys.CHAT_MESSAGE, {
    text: data,
    origin: ws.id
  })
})
