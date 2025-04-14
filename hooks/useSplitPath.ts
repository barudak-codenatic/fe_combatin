import { usePathname } from "next/navigation"


export const useSplitPath = (idx : number) => {
    const pathname = usePathname()
    
    const pathSplit = pathname.split('/')
    return pathSplit[idx]
}