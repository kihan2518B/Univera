import React from "react"

const UniveraLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        {/* Logo Container with Animated Border */}
        <div className="relative">
          {/* Pulsing Circle */}
          <div className="absolute inset-0 rounded-full bg-[#5B58EB] opacity-20 animate-ping"></div>

          {/* Rotating Border */}
          <div className="w-24 h-24 rounded-full border-t-4 border-b-4 border-[#5B58EB] animate-spin"></div>

          {/* Logo Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[#112C71] font-bold text-2xl tracking-widest">
              <span className="text-[#5B58EB]">U</span>NIVERA
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="mt-6 text-[#0A2353] font-medium">
          <div className="flex items-center">
            <span>Loading</span>
            <span className="ml-1 inline-flex">
              <span className="animate-bounce mx-0.5 delay-100">.</span>
              <span className="animate-bounce mx-0.5 delay-200">.</span>
              <span className="animate-bounce mx-0.5 delay-300">.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UniveraLoader
