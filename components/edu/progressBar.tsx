import React from 'react'

interface ProgressBarProps {
  value: number 
  height?: string 
  color?: string 
  backgroundColor?: string 
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  height = "1rem",
  color = "bg-blue-500",
  backgroundColor = "bg-gray-300"
}) => {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <div className='flex gap-2 items-center'>
        <div className={`${backgroundColor} rounded-full w-full`} style={{ height }}>
            <div
                className={`${color} rounded-full transition-all duration-300 ease-out`}
                style={{ width: `${clampedValue}%`, height }}
            />
        </div>
        <h4>{`${value}%`}</h4>
    </div>
  )
}

export default ProgressBar
