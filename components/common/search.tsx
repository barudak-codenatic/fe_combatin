import { FaSearch } from "react-icons/fa"

export const SearchGlobal = () => {
    return (
        <form className="bg-gray-300 flex rounded-full gap-2 overflow-hidden px-3 py-2 items-center">
            <FaSearch size={20}/>
            <input className="bg-transparent focus:outline-none text-lg" type="text" placeholder="Cari.."/>
        </form>
    )
}