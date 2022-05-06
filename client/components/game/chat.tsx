import { useEffect, useLayoutEffect, useState, useRef, useContext } from 'react'

import styles from './chat.module.scss'
import { NetworkContext } from '../../lib/game/networking'
import keybinds from '../../lib/keybinds'

const Chat = (): JSX.Element => {
  const { ws } = useContext(NetworkContext)

  const [messages, setMessages] = useState<string[]>([])
  const [chatInputActive, setChatInputActive] = useState<boolean>(false)
  const [chatInput, setChatInput] = useState<string>('')

  const chatBox = useRef<HTMLUListElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ws == null) return

    const openConnection = (): void => {
      ws.send('Hello Server!')
      addMessage(`Connected to ${ws.url}`)
    }

    const messageEvent = (event): void => {
      const packet = event.detail

      if (packet.type !== 'chatMessage') return

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

  useEffect(() => {
    const keyPress = (e): void => {
      if (e.key === keybinds.chat_open) {
        setChatInputActive(true)
      }
    }

    document.addEventListener('keypress', keyPress)

    return () => {
      document.removeEventListener('keypress', keyPress)
    }
  })

  const addMessage = (message): void => {
    setMessages((prevState) => {
      return [...prevState, message]
    })
  }

  const sendChatMessage = (event): void => {
    event.preventDefault()
    if (ws == null) return
    ws.send(chatInput)
    setChatInputActive(false)
    setChatInput('')
  }

  typeof window !== 'undefined' && useLayoutEffect(() => {
    if ((chatBox?.current) != null) {
      chatBox.current.scrollTop = chatBox.current.scrollHeight
    }
  }, [messages])

  typeof window !== 'undefined' && useLayoutEffect(() => {
    if (chatInputActive) chatInputRef.current?.focus()
  }, [chatInputActive])

  return (
    <div className={styles.chat}>
      <ul className={styles.chatMessages} ref={chatBox}>
        {(messages.length > 0) && messages.map((message, index) => <li key={index}>{message}</li>)}
      </ul>
      {chatInputActive && (
        <form onSubmit={sendChatMessage}>
          <input
            type='text' name='chat-input' autoComplete='off'
            value={chatInput}
            onChange={(e) => { setChatInput(e.target.value) }}
            onBlur={(e) => { setChatInputActive(false) }}
            ref={chatInputRef}
            className={styles.chatInput}
          />
        </form>
      )}
    </div>
  )
}

export default Chat
