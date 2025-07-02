import React from "react"

const ProfileCompletion = ({
  completionPercentage
}: {
  completionPercentage: number
}) => {
  const radius = 50
  const strokeWidth = 10
  const normalizedRadius = radius - strokeWidth * 0.5
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset =
    circumference - (completionPercentage / 100) * circumference

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="w-full max-w-[100px]"
      >
        <circle
          stroke="#e6e6e6"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#5B58EB"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.5s ease 0s" }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-lg font-semibold"
          fill="#000"
        >
          {completionPercentage}%
        </text>
      </svg>
    </div>
  )
}

export default ProfileCompletion
