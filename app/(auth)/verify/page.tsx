"use client"
import { CustomButton, MessageRes } from "@/components/common"
import useApiRequest from "@/hooks/useRequest"
import apiClient from "@/services/api/apiClient"
import { MessageType } from "@/services/types/common"
import { useRouter } from "next/navigation"
import { FormEvent, useRef, useState } from "react"
import OTPInput from "react-otp-input"

const VerifyPage = () => { 
    const [otp, setOtp] = useState('')

    const { loading, error, data, makeRequest } = useApiRequest<MessageType, string>();

    const router = useRouter()

    const formRef = useRef<HTMLFormElement | null>(null);

    const handleSubmit = async (e:FormEvent) => { 
        e.preventDefault()
        try {
            await makeRequest(() => apiClient.post('/auth/verify', {
                otp,
                userId : localStorage.getItem('userId'),
                email : localStorage.getItem('email')
            }));
            formRef.current?.reset()
            await router.push('/dashboard')
        } catch (err) {
            formRef.current?.reset()
        }
     }

    const sendOtp = async (e:FormEvent) => { 
        e.preventDefault()
        try {
            await makeRequest(() => apiClient.post('/auth/sendotp', {
                otp,
                userId : localStorage.getItem('userId'),
            }));
            formRef.current?.reset()
        } catch (err) {
            formRef.current?.reset()
        }
     }

    return (
        <form onSubmit={handleSubmit} ref={formRef} className="w-[25rem] rounded-xl">
            <h1 className="text-center font-bold text-xl">Verifikasi Email</h1>
            <p className="text-center my-4">Kami sudah mengirimkan kode verifikasi ke </p>
            <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                containerStyle={'gap-2 h-[4rem] my-8'}
                inputStyle={'text-2xl h-full flex-1 w-full mx-auto rounded-md outline-2'}
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} />}                                                                                       
            />
            <MessageRes isSuccess error={data?.message}/>
            <MessageRes error={error}/>
            <p className="my-2">belum menerima kode? <button onClick={sendOtp} className="text-blue-500 hover:text-blue-600">Kirim ulang</button></p>
            <CustomButton loading={loading} type="submit" title="Kirim"/>
        </form>
    )
}

export default VerifyPage