export const LogoIcon = ({ width="60",height="60" } : { width? : string, height? : string }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 190 113" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M190 51.9034C184.5 2.40343 124.667 -3.59662 102.5 2.40338L122 6.40339C102.5 8.90339 76.5 34.9034 55.5 40.4034H73C39.5 65.9034 23.5 34.9034 0 46.4034C16.5 57.9034 28.5 78.9034 55.5 75.9034C55.5 75.9034 55.5 81.9034 39.5 86.4034C60.5 89.9034 67 79.4775 84 86.4034C87.5 95.4034 60.5 94.9034 60.5 112.403C72.1 95.6034 115.667 105.403 136 112.403C161 114.737 190 94 190 51.9034Z" fill="#CD2222"/>
            <path d="M89.8 91L78.8 53H106.8L111.8 43.5H144.8V91H89.8Z" fill="#DD722F"/>
            <path d="M177 31.5H114L104 54.5303L97.5 69.5L127 62V45H132.5V62H174C174 62 177 57 174 50H145V45C145 45 167.5 46.076 177 45C184.5 36.5 177 31.5 177 31.5Z" fill="#DCD637"/>
            <path d="M145 77V65.5H169.5C169.5 65.5 174 72 169.5 77H145Z" fill="#DCD637"/>
            <path d="M145 91.5V80.5H165C165 80.5 169.5 86 165 91.5H145Z" fill="#DCD637"/>
        </svg>
    )
}

export const LogoName = () => {
    return (
        <h1 className="text-2xl font-bold">CombatIn</h1>
    )
}

export const Logo = ({ otherStyle } : { otherStyle? : string }) => {
    return (
        <div className={`flex gap-3 items-center w-fit h-fit ${otherStyle}`}>
            <LogoIcon/>
            <LogoName/>
        </div>
    )
}