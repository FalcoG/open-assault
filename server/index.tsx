import { WebSocketServer } from 'ws'
import { randomUUID } from 'crypto'

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', (ws) => {
  const uuid = randomUUID()

  ws.id = uuid

  ws.on('message', (data) => {
    console.log('received: %s', data)
  })

  ws.send(JSON.stringify({
    type: 'message',
    data: `Welcome ${uuid}!`
  }))
  ws.send(JSON.stringify({
    type: 'set',
    data: { id: uuid }
  }))
})

setInterval(() => {
  wss.clients.forEach((ws) => {
    ws.send(JSON.stringify({
      type: 'message',
      data: `Server: ${Date.now()}`
    }))
  })
}, 10000)
