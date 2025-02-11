'use client'
import { CustomButton, CustomInput, ProfileIcon } from "@/components/common"
import useApiRequest from "@/hooks/useRequest";
import apiClient from "@/services/apiService";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react"
import { FaPencil } from "react-icons/fa6"

interface FormType {
    name : string | undefined;
    img_url : any;
    file? : File;
}

const ProfilePage = () => { 
    const { loading, makeRequest } = useApiRequest<any, string>();

    const { data, isLoading, error } = useQuery({
        queryKey : ['profile'],
        queryFn : () => apiClient.get<User>('/users/me')
    })

    const [isEdit, setEdit] = useState(false)
    const [form, setForm] = useState<FormType>({
        name : '',
        img_url : '/profile.jpg',
    })

    const handleImage = (event:React.ChangeEvent<HTMLInputElement>) => { 
        const file = event.target.files?.[0]
        if (file) {
            const imageUrl = URL.createObjectURL(file)
            setForm({...form, img_url : imageUrl, file})
            return () => URL.revokeObjectURL(imageUrl)
        }
        return
     }

     useEffect(() => {
        if (data?.data) {
          setForm({
            name: data.data.name || "",
            img_url: data.data.img_url || "/profile.jpg",
          });
        }
        console.log(data)
      }, [data]);

    const updateProfile = async () => { 
        const formData = new FormData();
        if (form.file) {
            formData.append("file", form.file);
        }
        const data = await makeRequest(()=>apiClient.put(
            '/users/update',
            formData,
            {
                headers : { "Content-Type": "multipart/form-data" }
            }
        ))
        setEdit(!isEdit)
     }

    if (isLoading) return <p>Loading</p>
    return (
        <div className="mt-20 ml-32 flex flex-col items-center gap-4">
            {
                isEdit?
                <>
                    <label htmlFor="profile" className="relative cursor-pointer">
                        <ProfileIcon src={form.img_url} type='border' otherStyles="w-32"/>
                        <FaPencil size={30} className="absolute top-2 right-0"/>
                    </label>
                    <input className="hidden" accept="image/png, image/jpg, image/jpeg" onChange={handleImage} id="profile" type="file"/>
                </>:
                <ProfileIcon src={form.img_url} type='border' otherStyles="w-32"/>
            }
            <div>
                {isEdit?
                <CustomInput value={form.name} handleChange={(e)=>setForm({...form, name : e.target.value})} title="Nama"/>:
                <>
                    <h1 className="text-center">{form.name}</h1>
                    <h2 className="text-center">dindin@gmail.com</h2>
                </>}
            </div>
            <div className="flex gap-3">
                {
                    isEdit?
                    <CustomButton loading={loading} onClick={updateProfile} title="Simpan"/>:
                    <CustomButton onClick={()=>setEdit(!isEdit)} title="Edit Profile"/>
                }
                <CustomButton title="Tantang"/>
            </div>
        </div>
    )
 }

 export default ProfilePage