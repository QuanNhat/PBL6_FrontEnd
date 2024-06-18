declare module 'react-chat-window' {
  import { Component } from 'react'

  export interface MessageData {
    text: string
  }

  export interface Message {
    author: 'me' | 'them' | 'bot'
    type: 'text'
    data: MessageData
  }

  export interface LauncherProps {
    agentProfile: {
      teamName: string
      imageUrl: string
    }
    onMessageWasSent: (message: Message) => void
    messageList: Message[]
    showEmoji?: boolean
  }

  export class Launcher extends Component<LauncherProps> {}
}
