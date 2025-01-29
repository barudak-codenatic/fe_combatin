import Link from "next/link"

export const SidebarClient = () => {
    return (
        <aside className="fixed top-0 bottom-0 left-0 bg-purple-300 pt-24 px-3">
            <Link className="block" href={'#'}>Modul</Link>
            <Link className="block" href={'/dashboard/tantangan'}>Tantangan</Link>
        </aside>
    )
}