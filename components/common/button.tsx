import React from "react";

interface button extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    title : string;
    otherStyle? : string;
    loading? : boolean;
}

export const CustomButton = ({ 
        title,
        otherStyle="bg-red-500 hover:bg-red-700",
        loading,
        ...otherProps
    } : button) => {
    if(loading) return <p>Loading</p>;
    return <button {...otherProps} className={`rounded-full px-4 py-1 text-white font-semibold ${otherStyle}`}>{title}</button>
}