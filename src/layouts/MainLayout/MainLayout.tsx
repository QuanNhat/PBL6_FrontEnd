import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ChatBot from 'src/components/ChatBot'
// import { ChatBot } from 'chatapp'
interface Props {
  children?: React.ReactNode
}
function MainLayoutInner({ children }: Props) {
  return (
    <div>
      <Header />
      {children}
      <ChatBot />
      <Outlet />
      <Footer />
    </div>
  )
}
const MainLayout = memo(MainLayoutInner)
export default MainLayout
