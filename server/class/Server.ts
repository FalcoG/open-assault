import { EventEmitter } from 'events'
import { ClientServerEventKeys, ClientServerEvents } from 'open-assault-core/client-server-events'
import { ClientPacketKeys, ClientPackets, ServerPacketKeys, ServerPackets } from 'open-assault-core/networking'
import { WebSocket, WebSocketServer } from 'ws'

import { createPacket } from '../lib/create-packet'

interface WebSocketConnection extends WebSocket {
  id: string
}

class Server {
  wss: WebSocketServer = new WebSocketServer({ port: 8080 })
  emitter: EventEmitter = new EventEmitter()
  clientEventEmitter: EventEmitter = new EventEmitter()

  constructor () {
    this.wss.on('connection', (connection) => {
      const ws = connection as WebSocketConnection

      ws.on('message', (data) => {
        if (data instanceof Buffer) {
          try {
            const packet = JSON.parse(data.toString())
            // todo: user can mess with the packets, TS typing doesn't mean everything!
            this.emitter.emit(packet.type, ws, packet.data)
          } catch (e) {
            console.error('Malformed client packet')
          }
        }
      })

      ws.on('close', (data) => {
        this.emitClientEvent(ClientServerEventKeys.DISCONNECT, ws, { reason: data })
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

  emitClientEvent<T extends ClientServerEventKeys> (
    eventName: T,
    ws: WebSocketConnection,
    data: ClientServerEvents[T]
  ): void {
    this.clientEventEmitter.emit(eventName, ws, data)
  }

  onClientEvent<T extends ClientServerEventKeys> (
    eventName: T,
    callback: (ws: WebSocketConnection, evt: ClientServerEvents[T]) => void
  ): () => void {
    this.clientEventEmitter.on(eventName, callback)

    return () => {
      this.clientEventEmitter.removeListener(eventName, callback)
    }
  }

  broadcast<T extends ServerPacketKeys> (
    eventName: T,
    data: ServerPackets[T],
    exclude: WebSocketConnection[] = []
  ): void {
    this.filterClients(exclude)
      .forEach((ws) => {
        ws.send(createPacket(eventName, data))
      })
  }

  send<T extends ServerPacketKeys>(
    ws: WebSocketConnection,
    eventName: T,
    data: ServerPackets[T]
  ): void {
    ws.send(createPacket(eventName, data))
  }

  get clients (): WebSocketConnection[] {
    // todo: this seems very funky - find a way to remove 'unknown'
    const clients = this.wss.clients as unknown as Set<WebSocketConnection>
    return Array.from(clients)
  }

  filterClients (blacklist: WebSocketConnection[]): WebSocketConnection[] {
    return this.clients.filter(ws => !blacklist.includes(ws))
  }
}

export default Server
