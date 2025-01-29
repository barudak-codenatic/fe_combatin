import { SignInForm } from "@/components/auth/index"
import { Logo } from "@/components/common/index"

const SignInPage = () => { 
    return (
        <div className="w-[20rem] rounded-xl">
            <h1 className="text-center font-bold text-xl">Masuk</h1>
            <Logo otherStyle="mx-auto"/>
            <SignInForm/>
        </div>
    )
}

export default SignInPage