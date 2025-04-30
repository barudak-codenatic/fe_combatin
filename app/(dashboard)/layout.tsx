import { GlobalModals, NavbarClient, SidebarClient } from "@/components/common"

const DashboardLayout = ({ children } : { children : React.ReactNode }) => { 
    return (
        <>
            <NavbarClient/>
            {/* <SidebarClient/> */}
            {children}
            <GlobalModals/>
        </>
    )
 }

export default DashboardLayout