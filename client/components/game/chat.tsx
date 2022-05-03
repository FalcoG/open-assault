import { useEffect, useLayoutEffect, useState, useRef, useContext } from 'react'

import styles from './chat.module.scss'
import { NetworkContext } from '../../lib/game/networking'

const Chat = (): JSX.Element => {
  const { ws } = useContext(NetworkContext)

  const [messages, setMessages] = useState<string[]>([])
  const chatBox = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ws == null) return

    const openConnection = (event): void => {
      ws.send('Hello Server!')
      addMessage(`Connected to ${ws.url}`)
    }

    const messageEvent = (event): void => {
      console.log('Message from server ', event.data)
      addMessage(event.data)
    }

    ws.addEventListener('open', openConnection)
    ws.addEventListener('message', messageEvent)

    // TODO: fix timing issue!
    return () => { // this will cause a re-register of event listeners with every disconnect of the effect - can this be optimized?
      console.log('unregister effect')
      ws.removeEventListener('open', openConnection)
      ws.removeEventListener('message', messageEvent)
    }
  }, [ws, messages])

  const addMessage = (message): void => {
    console.log('prev messages state', messages)
    setMessages([...messages, message])
  }

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
