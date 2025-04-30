import Link from "next/link";
import { FaRobot } from "react-icons/fa6";

export const ChatbotLink = () => {
    return (
        <Link href={'/combot'} className="hover:bg-gray-200 rounded-full">
            <FaRobot size={25}/>
        </Link>
    )
};
