import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EntryPage = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/lcd-display");
  };

  return (
    <div className="h-screen bg-white relative overflow-hidden">
      {/* Top Left Flowing Lines */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px]">
        <img src="/entry-top.webp" className="w-full h-full" alt="top" />
      </div>

      {/* Bottom Right Flowing Lines */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px]">
        <img src="/entry-bottom.webp" className="w-full h-full" alt="bottom" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-4">
        {/* Logo Section */}
        <div className="text-center">
          <img src="/logo/mjs_logo_text.png" className="w-44 h-auto" alt="" />
        </div>

        {/* Title */}
        <h1 className="text-lg md:text-xl my-8 font-light text-gray-700 text-center max-w-2xl leading-tight">
          LED & LCD Digital Signage Solutions
        </h1>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="bg-teal-500 hover:bg-teal-600 text-white text-lg md:text-xl px-8 py-4 rounded-full transition-all duration-300 font-medium flex items-center justify-center gap-2"
        >
          <span>Continue</span>
          <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default EntryPage;
