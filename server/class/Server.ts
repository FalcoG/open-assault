import { WebSocketServer } from 'ws'
import { EventEmitter } from 'events'
import { ClientPacketKeys, ClientPackets } from 'open-assault-core/networking'

interface WebSocketConnection extends WebSocket {
  id: string
}

class Server {
  wss: WebSocketServer = new WebSocketServer({ port: 8080 })
  emitter: EventEmitter = new EventEmitter()

  constructor () {
    this.wss.on('connection', (ws) => {
      ws.on('message', (data) => {
        if (data instanceof Buffer) {
          try {
            const packet = JSON.parse(data.toString())
            // todo: user can mess with the packets, typing doesn't mean everything!
            this.emitter.emit(packet.type, ws, packet.data)
          } catch (e) {
            console.error('Malformed client packet')
          }
        }
      })
    })
  }

  onClientConnection (callback: (ws: WebSocketConnection) => void): () => void {
    this.wss.on('connection', callback)

    return () => this.wss.removeListener('connection', callback)
  }

  onClientPacket<T extends ClientPacketKeys> (
    eventName: T,
    callback: (ws: WebSocketConnection, evt: ClientPackets[T]) => void
  ): () => void {
    this.emitter.on(eventName, callback)

    return () => {
      this.emitter.removeListener(eventName, callback)
    }
  }
}

export default Server
