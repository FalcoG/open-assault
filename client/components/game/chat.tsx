import { useEffect, useLayoutEffect, useState, useRef } from 'react'

import styles from './chat.module.scss'

const Chat = (): JSX.Element => {
  const [socket, setSocket] = useState<WebSocket>()
  const [messages, setMessages] = useState<string[]>([])
  const chatBox = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSocket(new WebSocket('ws://localhost:8080'))
  }, [])

  useEffect(() => {
    if (socket == null) return

    const openConnection = (event): void => {
      socket.send('Hello Server!')
    }

    const messageEvent = (event): void => {
      console.log('Message from server ', event.data)
      setMessages([...messages, event.data])
    }

    socket.addEventListener('open', openConnection)
    socket.addEventListener('message', messageEvent)

    return () => { // this will cause a re-register of event listeners with every disconnect of the effect - can this be optimized?
      socket.removeEventListener('open', openConnection)
      socket.removeEventListener('message', messageEvent)
    }
  }, [socket, messages])

  useLayoutEffect(() => {
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
