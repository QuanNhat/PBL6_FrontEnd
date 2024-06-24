import React, { useState, useEffect } from 'react'
// eslint-disable-next-line import/named
import { Launcher, Message } from 'react-chat-window'
import './ChatBot.css'

interface BotMessage {
  author: 'bot'
  type: 'text'
  data: { text: string }
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const storedMessages = localStorage.getItem('chatMessages')
    return storedMessages ? JSON.parse(storedMessages) : []
  })

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    const welcomeMessage: BotMessage = {
      author: 'bot',
      type: 'text',
      data: { text: 'Xin chào! Bạn có thể gửi tin nhắn cho tôi ở đây.' }
    }
    if (messages.length === 0) {
      setMessages([welcomeMessage])
    }
  }, [])

  const handleSendMessage = async (newMessage: Message) => {
    const userMessage: Message = {
      author: 'me',
      type: 'text',
      data: { text: newMessage.data.text }
    }
    setMessages([...messages, userMessage])

    try {
      const response = await fetch('https://5000-quannhat-serverchatbot-9q32fv5ehm7.ws-eu114.gitpod.io/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: newMessage.data.text })
      })
      const responseData = await response.json()

      const botMessage: Message = {
        author: 'them',
        type: 'text',
        data: { text: responseData.response }
      }
      setMessages((prevMessages) => [...prevMessages, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <div className='chat-container'>
      <Launcher
        agentProfile={{
          teamName: 'Chat Bot',
          imageUrl: 'https://img.freepik.com/free-vector/graident-ai-robot-vectorart_78370-4114.jpg?size=626&ext=jpg'
        }}
        onMessageWasSent={handleSendMessage}
        messageList={messages}
        showEmoji={false}
      />
    </div>
  )
}
