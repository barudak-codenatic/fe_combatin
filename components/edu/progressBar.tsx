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
  color = "bg-red-600",
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

export const StepProgress = ({
  steps = [],
  currentStep = 0,
  direction = 'horizontal', 
}) => {
  const isHorizontal = direction === 'horizontal';

  return (
    <div
      className={`${
        isHorizontal ? 'flex items-center justify-between px-4 w-full' : 'flex flex-col items-start pl-4'
      }`}
    >
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {/* Step Bulat */}
          <div className={`flex ${isHorizontal ? 'flex-col items-center' : 'items-start'}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white
                ${
                  index < currentStep
                    ? 'bg-green-500'
                    : index === currentStep
                    ? 'bg-blue-600'
                    : 'bg-gray-300'
                }
              `}
            >
              {index + 1}
            </div>
            <div className={`font-bold mt-2 ${isHorizontal ? 'text-center w-24' : 'ml-3 text-white'}`}>{step}</div>
          </div>

          {/* Garis separator */}
          {index !== steps.length - 1 && (
            <div
              className={`${
                isHorizontal ? 'flex-1 h-1 bg-gray-300 mx-2 relative' : 'h-8 w-1 bg-gray-300 ml-3 relative'
              }`}
            >
              <div
                className={`absolute top-0 left-0 ${
                  index < currentStep ? 'bg-green-500' : 'bg-transparent'
                } ${isHorizontal ? 'h-full w-full' : 'w-full h-full'}`}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
