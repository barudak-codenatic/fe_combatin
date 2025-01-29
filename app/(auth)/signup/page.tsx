import { SignUpForm } from "@/components/auth/index"
import { Logo } from "@/components/common/index"

const SignUpPage = () => { 
    return (
        <div className="w-[20rem] rounded-xl">
            <h1 className="text-center font-bold text-xl">Buat Akun</h1>
            <Logo otherStyle="mx-auto"/>
            <SignUpForm/>
        </div>
    )
}

export default SignUpPage