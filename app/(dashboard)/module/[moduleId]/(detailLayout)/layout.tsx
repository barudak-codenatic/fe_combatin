
import {SideBar} from "@/components/edu/sidebar"
import React from "react"

const DetailLayout = ({
    children
}:{
    children : React.ReactNode
}) => {    
    return(
        <div className="grid grid-cols-[1fr_300px] gap-4 h-screen pt-28 max-w-7xl mx-auto">
            {/* Main content scrollable */}
            <main className="overflow-y-auto pr-4 h-[80rem]">
                {children}
            </main>

            {/* Sticky Sidebar */}
            <aside className="sticky top-20 self-start h-fit">
                <SideBar />
            </aside>
        </div>

    )
}

export default DetailLayout