import ChatComponent from "@/components/chatbot/chat"
import { NavbarChatbot } from "@/components/common"

const botPage = () => { 
    return (
        <main className="flex justify-center items-center min-h-screen">
            <NavbarChatbot/>
            <ChatComponent />
        </main>
    )
 }

export default botPage