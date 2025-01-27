"use client"

import Link from "next/link"
import { CustomInput } from "../common/input"
import { CustomButton } from "../common/button"
import { useState } from "react"

export const SignUpForm = () => {
    const [form, setForm] = useState({
        name : "",
        email : "",
        password : ""
    })

    const handleSubmit = (e:any) => { 
        e.preventDefault()
        console.log(form)
     }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <CustomInput 
                title="Nama" 
                handleChange={(e) => setForm({...form, name : e.target.value})}
            />
            <CustomInput 
                type="email" 
                title="Email" 
                handleChange={(e) => setForm({...form, email : e.target.value})}
            />
            <CustomInput 
                type="password" 
                title="Password" 
                handleChange={(e) => setForm({...form, password : e.target.value})}/>
            <Link className="text-blue-500 hover:text-blue-600 text-end" href={`/forgot-password`}>lupa password?</Link>
            <CustomButton 
                title="Daftar"
                type="submit"
            />
            <span className="text-center">
                Sudah punya akun? <Link className="text-blue-500 hover:text-blue-600" href={`/signin`}>Masuk</Link>
            </span>
        </form>
    )
}