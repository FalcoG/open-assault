import { WebSocketServer } from 'ws'
import { randomUUID } from 'crypto'
import { PacketKeys } from 'open-assault-core/networking'
import { createPacket } from './lib/create-packet'

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', (ws) => {
  const uuid = randomUUID()

  ws.id = uuid

  ws.on('message', (data) => {
    console.log('received: %s', data)
  })

  ws.send(createPacket(PacketKeys.CHAT_MESSAGE, `Welcome ${uuid}!`))

  ws.send(JSON.stringify({
    type: 'set',
    data: { id: uuid }
  }))
})

setInterval(() => {
  wss.clients.forEach((ws) => {
    ws.send(createPacket(PacketKeys.CHAT_MESSAGE, `Server: ${Date.now()}`))
  })
}, 10000)
