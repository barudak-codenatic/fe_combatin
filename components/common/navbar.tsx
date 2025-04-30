import { content } from "@/content"
import { Logo } from "./logo"
import Link from "next/link"
import { ProfileDropdown } from "./profile"
import { SearchGlobal } from "./search"
import { NewDropdown } from "../admin/dropdown"
import { ChatbotLink } from "../chatbot/logo-chat"

export const Navbar = () => {
    return (
        <header className="flex items-center justify-between fixed top-0 left-0 right-0 bg-gray-100 px-7 z-10">
            <Logo/>
            <nav>
                {content.navLinks.map(link=>(
                    <Link key={link} href={`#${link}`}>{link}</Link>
                ))}
            </nav>
            <div className="flex gap-2">
                <Link className="rounded-full px-4 py-1 text-white font-semibold bg-red-500 hover:bg-red-700" href={`/signup`}>Daftar</Link>
                <Link className="rounded-full px-4 py-1 text-white font-semibold bg-red-500 hover:bg-red-700" href={`/signin`}>Masuk</Link>
            </div>
        </header>
    ) 
 }

export const NavbarClient = () => {
    return (
        <header className="flex items-center justify-between fixed top-0 left-0 right-0 bg-gray-100 px-7 z-10 py-1">
            <Logo/>
            <SearchGlobal/>
            <div className="flex gap-2 items-center">
                <ChatbotLink/>
                <NewDropdown/>
                <ProfileDropdown/>
            </div>
        </header>
    )
}