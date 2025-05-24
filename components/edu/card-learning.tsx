import { Material, Test } from "@/types";
import { PiBoxingGloveFill } from "react-icons/pi";
import Link from "next/link";
import { FaBook } from "react-icons/fa6";
import { DropDown } from "../common";
import { IoMdMore } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import useApiRequest from "@/hooks/useRequest";
import apiClient from "@/services/apiService";
import { IoCheckmark } from "react-icons/io5";

interface CardLearningProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Material | Test;
  href: string;
  type: 'materials' | 'test';
  isDone?: boolean;
}

export const CardLearning = ({
  data,
  href,
  type,
  isDone=false,
  ...props
}: CardLearningProps) => {
    const { loading : postLoading, error : postError, makeRequest, data : postData } = useApiRequest<{message : string}, string>();

    const handleDelete = async (id : string|undefined) => { 
        try {
            await makeRequest(() => apiClient.delete(`/${type}/${id}`));
        } catch (err) {
            console.log(err)
        }
     }

    return (
        <div 
        {...props}
        className="relative w-full flex border-2 border-gray-300 rounded-lg"
        >
        <Link href={href} className={`flex items-center gap-2 h-full w-full block hover:bg-gray-300 p-4 ${props.className ?? ""}`}>
            {type === 'materials' && !isDone ? (
            <FaBook size={25} />
            ) :
            type === 'test' && !isDone ?
            (
            <PiBoxingGloveFill size={25} />
            )
            :
            <IoCheckmark color="green" size={25} />
        }
            <h4 className="text-nowrap truncate max-w-[80%]">{data.title}</h4>
        </Link>

        <DropDown 
            trigger={
            <IoMdMore className="w-6 h-6 cursor-pointer absolute inline-block right-2" />
            }
        >
            <button onClick={()=>handleDelete(data.id)} className="flex w-full gap-2 hover:bg-gray-200 px-3 py-2 items-center">
                <FaRegTrashAlt color="red" size={20} />
                <p className="text-red-500">Delete</p>
            </button>
        </DropDown>
        </div>
    );
};
