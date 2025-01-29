import { Logo } from "@/components/common"

const AuthLayout = ({ children } : { children : React.ReactNode }) => { 
    return (
        <div className="grid grid-cols-2 h-screen justify-items-center items-center">
            <div>
                <h1><Logo/></h1>
            </div>
            <div className="bg-red-200 w-full h-full justify-center items-center flex">
                {children}
            </div>
        </div>
    )
 }

export default AuthLayout