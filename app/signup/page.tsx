import { SignUpForm } from "@/components/auth/signup"
import { Logo } from "@/components/common/logo"

const SignUpPage = () => { 
    return (
        <div className="grid grid-cols-2 h-screen justify-items-center items-center">
            <div>
                <h1><Logo/></h1>
            </div>
            <div className="bg-red-200 w-full h-full justify-center items-center flex">
                <div className="w-[20rem] rounded-xl">
                    <h1 className="text-center font-bold text-xl">Buat Akun</h1>
                    <Logo otherStyle="mx-auto"/>
                    <SignUpForm/>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage