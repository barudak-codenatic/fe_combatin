"use client"

import Link from "next/link"
import { useState } from "react"
import { CustomButton, CustomInput } from "../common"

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