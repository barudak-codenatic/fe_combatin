'use client'
import { content } from "@/content"
import { Logo } from "./logo"
import Link from "next/link"
import { ProfileDropdown } from "./profile"
import { SearchGlobal } from "./search"
import { NewDropdown } from "../admin/dropdown"
import { ChatbotLink } from "../chatbot/logo-chat"
import { IoArrowBackOutline } from "react-icons/io5"
import { useRouter } from "next/navigation"
import { FaRobot } from "react-icons/fa6"

export const Navbar = () => {
    return (
        <header className="flex items-center justify-between fixed top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-red-800 px-7 py-3 z-20 shadow-md">
            <div className="flex items-center">
                <Logo/>
                <nav className="ml-10">
                    {content.navLinks.map(link=>(
                        <Link key={link} href={`#${link}`} className="text-white font-medium mx-3 hover:text-red-200 transition-colors">
                            {link}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="flex gap-3">
                <Link className="rounded-full px-5 py-2 text-red-600 font-semibold bg-white hover:bg-gray-100 transition-all shadow-sm" href={`/signin`}>Masuk</Link>
                <Link className="rounded-full px-5 py-2 text-white font-semibold border-2 border-white hover:bg-white hover:text-red-600 transition-all shadow-sm" href={`/signup`}>Daftar</Link>
            </div>
        </header>
    ) 
 }

export const NavbarClient = () => {
    return (
        <header className="flex items-center justify-between fixed top-0 left-0 right-0 bg-white px-7 z-10 py-3 shadow-md">
            <Link href={`/`} className="flex items-center">
                <Logo/>
            </Link>
            <SearchGlobal/>
            <div className="flex gap-3 items-center">
                <ChatbotLink/>
                <NewDropdown/>
                <ProfileDropdown/>
            </div>
        </header>
    )
}

export const NavbarChatbot = () => {
    const router = useRouter()
    return (
        <header className="flex items-center justify-between fixed top-0 left-0 right-0 px-7 z-10 py-1">
            <div className="flex gap-2 items-center">
                <button
                    className="p-2 hover:bg-gray-200 rounded-full flex items-center justify-center"
                    onClick={() => router.back()}
                >
                    <IoArrowBackOutline color="black" />
                </button>
                <Link href={`/`} className="flex items-center gap-2">
                    <FaRobot size={25}/>
                    <span className="font-bold text-xl">Combot</span>
                </Link>
            </div>
            <div className="flex gap-3 items-center">
                <ProfileDropdown/>
            </div>
        </header>
    )
};
