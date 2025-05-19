import React from 'react'

interface ProgressBarProps {
  value: number 
  height?: string 
  color?: string 
  backgroundColor?: string 
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
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

export const StepProgress = ({ steps = [], currentStep = 0 }) => {
  return (
    <div className="flex items-center justify-between w-full px-4">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {/* Step Bulat */}
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white
                ${
                  index < currentStep
                    ? 'bg-green-500' // completed
                    : index === currentStep
                    ? 'bg-blue-600' // current
                    : 'bg-gray-300' // upcoming
                }
              `}
            >
              {index + 1}
            </div>
            <div className="text-sm mt-2 text-center w-24">{step}</div>
          </div>

          {/* Garis separator */}
          {index !== steps.length - 1 && (
            <div className="flex-1 h-1 bg-gray-300 mx-2 relative">
              <div
                className={`h-full absolute top-0 left-0 ${
                  index < currentStep ? 'bg-green-500' : 'bg-transparent'
                }`}
                style={{ width: '100%' }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
