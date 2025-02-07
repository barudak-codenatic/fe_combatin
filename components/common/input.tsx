"use client"

import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

interface inputType extends React.InputHTMLAttributes<HTMLInputElement> {
    title : string;
    type? : string;
    handleChange? : (e : any) => void;
    msg? : string[] | null;
    required? : boolean;
    value? : string;
}

export const CustomInput = ({
    title,
    type="text",
    msg,
    handleChange,
    required=true,
    value=''
} : inputType) => {

    const [isHide, setHide] = useState(true)

    if(type==='password') {
        return (
            <div>
                <label htmlFor={title}>{title}</label>
                <div className="flex w-full outline-2 p-2 bg-white gap-2 outline-gray-300 focus:outline-black outline rounded-md ">
                    <input 
                        id={title} 
                        placeholder={`Masukan ${title}`} 
                        type={isHide?"password":"text"}
                        className="block flex-1 focus:outline-none"
                        onChange={handleChange}
                        required={required}
                    />
                    <button type="button" onClick={()=>setHide(!isHide)}>
                        {isHide?<FaRegEyeSlash size={20}/>:<FaRegEye size={20}/>}
                    </button>
                </div>
                <small className="text-red-500">{msg?msg:' '}</small>
            </div>
        )
    }

    return (
        <div>
            <label htmlFor={title}>{title}</label>
            <input 
                id={title} 
                placeholder={`Masukan ${title}`} 
                type={type}
                className="w-full outline-2 outline-gray-300 focus:outline-black outline rounded-md block p-2"
                onChange={handleChange}
                required={required}
                value={value}
            />
            <small className="text-red-500">{msg??' '}</small>
        </div>
    )
}