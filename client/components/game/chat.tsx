import { useEffect, useLayoutEffect, useState, useRef, useContext } from 'react'

import styles from './chat.module.scss'
import { NetworkContext } from '../../lib/game/networking'

const Chat = (): JSX.Element => {
  const { ws } = useContext(NetworkContext)

  const [messages, setMessages] = useState<string[]>([])
  const chatBox = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ws == null) return

    const openConnection = (): void => {
      ws.send('Hello Server!')
      addMessage(`Connected to ${ws.url}`)
    }

    const messageEvent = (event): void => {
      const packet = event.detail

      if (packet.type !== 'message') return

      console.log('Message from server ', packet.data)
      addMessage(packet.data)
    }

    ws.addEventListener('open', openConnection)
    ws.addEventListener('packet', messageEvent)

    return () => { // this will cause a re-register of event listeners with every disconnect of the effect - can this be optimized?
      console.log('unregister effect')
      ws.removeEventListener('open', openConnection)
      ws.removeEventListener('packet', messageEvent)
    }
  }, [ws])

  const addMessage = (message): void => {
    setMessages((prevState) => {
      return [...prevState, message]
    })
  }

  typeof window !== 'undefined' && useLayoutEffect(() => {
    if ((chatBox?.current) != null) {
      chatBox.current.scrollTop = chatBox.current.scrollHeight
    }
  }, [messages])

  return (
    <div className={styles.chat} ref={chatBox}>
      <ul>
        {(messages.length > 0) && messages.map((message, index) => <li key={index}>{message}</li>)}
      </ul>
    </div>
  )
}

export default Chat
