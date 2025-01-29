import { NavbarClient, SidebarClient } from "@/components/common"

const DashboardLayout = ({ children } : { children : React.ReactNode }) => { 
    return (
        <>
            <NavbarClient/>
            <SidebarClient/>
            {children}
        </>
    )
 }

export default DashboardLayout