import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ClientPacketKeys, ServerPacketKeys } from 'open-assault-core/networking'

import styles from './chat.module.scss'
import { addCustomListener, createPacket, NetworkContext } from '../../lib/game/networking'
import keybinds from '../../lib/keybinds'
import Overlay from '../gui/overlay'

const Chat: React.FunctionComponent = () => {
  const { ws, eventDispatch } = useContext(NetworkContext)

  const [messages, setMessages] = useState<string[]>([])
  const [chatInputActive, setChatInputActive] = useState<boolean>(false)
  const [chatInput, setChatInput] = useState<string>('')

  const chatBox = useRef<HTMLUListElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ws == null) return

    const openConnection = (): void => {
      ws.send(createPacket(ClientPacketKeys.CHAT_MESSAGE, 'Hello Server!'))
      addMessage(`Connected to ${ws.url}`)
    }

    const messageEvent = addCustomListener(
      eventDispatch,
      ServerPacketKeys.CHAT_MESSAGE,
      (event): void => {
        const packet = event.detail

        console.log('Message from server ', packet)
        addMessage(`[${packet.origin}] ${packet.text}`)
      }
    )

    ws.addEventListener('open', openConnection)

    return () => { // this will cause a re-register of event listeners with every disconnect of the effect - can this be optimized?
      console.log('unregister effect')
      messageEvent()
    }
  }, [ws, eventDispatch])

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
    ws.send(createPacket(ClientPacketKeys.CHAT_MESSAGE, chatInput))
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
    <Overlay position={['left', 'bottom']}>
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
    </Overlay>
  )
}

export default Chat
