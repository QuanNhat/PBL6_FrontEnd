import React, { useState, useEffect } from 'react'
import { Launcher } from 'react-chat-window'
import 'D:/MonHocKy7/PL6/VTechStore/VTechStore/src/components/ChatBot/ChatBot.css'

// declare module 'chatapp' {
export default function ChatBot() {
  // const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState(() => {
    const storedMessages = localStorage.getItem('chatMessages')
    return storedMessages ? JSON.parse(storedMessages) : []
  })

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    const welcomeMessage = {
      author: 'bot',
      type: 'text',
      data: { text: 'Xin chào! Bạn có thể gửi tin nhắn cho tôi ở đây.' }
    }
    if (messages.length === 0) {
      setMessages([welcomeMessage])
    }
  }, [])

  const handleSendMessage = async (newMessage) => {
    const userMessage = {
      author: 'me',
      type: 'text',
      data: { text: newMessage.data.text }
    }
    setMessages([...messages, userMessage])

    try {
      const response = await fetch('http://localhost:5000/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: newMessage.data.text })
      })
      const responseData = await response.json()

      const botMessage = {
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
// }
