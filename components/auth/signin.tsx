"use client"

import Link from "next/link"
import { FormEvent, useRef, useState } from "react"
import { CustomButton, CustomInput } from "../common"
import apiClient from "@/services/api/apiClient"
import useApiRequest from "@/hooks/useRequest"
import { SignInRes } from "@/services/types"

export const SignInForm = () => {
    const { loading, data, error, makeRequest } = useApiRequest<SignInRes, string>();

    const formRef = useRef<HTMLFormElement | null>(null);

    const [form, setForm] = useState({
        email : "",
        password : ""
    })

    const handleSubmit = async (e:FormEvent) => { 
        e.preventDefault()
        try {
            await makeRequest(() => apiClient.post('/auth/signin', { ...form }));
            if(data) {
                localStorage.setItem('accessToken', data.accessToken)
                localStorage.setItem('refreshToken', data.refreshToken)
            }
            formRef.current?.reset()
        } catch (err) {
            formRef.current?.reset()
        }
     }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3">
            <CustomInput 
                type="email" 
                title="Email" 
                handleChange={(e) => setForm({...form, email : e.target.value})}
            />
            <CustomInput 
                type="password" 
                title="Password"
                handleChange={(e) => setForm({...form, password : e.target.value})}/>
            <small className="text-red-500 text-end">{error}</small>
            <Link className="text-blue-500 hover:text-blue-600 text-end" href={`/forgot-password`}>lupa password?</Link>
            {loading?
            <p>loading</p>:
            <CustomButton 
                title="Daftar"
                type="submit"
            />}
            <span className="text-center">
                Belum punya akun? <Link className="text-blue-500 hover:text-blue-600" href={`/signup`}>Daftar</Link>
            </span>
        </form>
    )
}