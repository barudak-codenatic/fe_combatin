import { content } from "@/content"
import Link from "next/link"

const MenuPage = () => { 
    return (
        <div className="mt-20 ml-32">
            <h1>Kategori</h1>
            <div className="flex gap-6">
                {content.menuGame.map(game=>(
                    <Link href={game} key={game}>{game}</Link>
                ))}
            </div>
        </div>
    )
 }

export default MenuPage