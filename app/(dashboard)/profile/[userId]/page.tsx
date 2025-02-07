'use client'
import { CustomButton, CustomInput, ProfileIcon } from "@/components/common"
import { useState } from "react"
import { FaPencil } from "react-icons/fa6"

interface FormType {
    name : string;
    img_url : any;
}

const ProfilePage = () => { 
    const [isEdit, setEdit] = useState(false)
    const [profile, setProfile] = useState<string|null>(null)
    const [form, setForm] = useState<FormType>({
        name : '',
        img_url : '/profile.jpg'
    })

    const handleImage = (event:any) => { 
        const file = event.target.files[0]
        console.log(form)
        if (file) {
            setForm({...form, img_url : URL.createObjectURL(form.img_url)})
        }
     }
    return (
        <div className="mt-20 ml-32 flex flex-col items-center gap-4">
            {
                isEdit?
                <>
                    <label htmlFor="profile" className="relative cursor-pointer">
                        <ProfileIcon src={form.img_url} type='border' otherStyles="w-32"/>
                        <FaPencil size={30} className="absolute top-2 right-0"/>
                    </label>
                    <input className="hidden" accept="image/*" onChange={handleImage} id="profile" type="file"/>
                </>:
                <ProfileIcon type='border' otherStyles="w-32"/>
            }
            <div>
                {isEdit?
                <CustomInput title="Nama"/>:
                <>
                    <h1 className="text-center">Dindin Imanudin</h1>
                    <h2 className="text-center">dindin@gmail.com</h2>
                </>}
            </div>
            <div className="flex gap-3">
                {
                    isEdit?
                    <CustomButton onClick={()=>setEdit(!isEdit)} title="Simpan"/>:
                    <CustomButton onClick={()=>setEdit(!isEdit)} title="Edit Profile"/>
                }
                <CustomButton title="Tantang"/>
            </div>
        </div>
    )
 }

 export default ProfilePage