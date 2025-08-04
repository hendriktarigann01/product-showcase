import React from "react";
import { useNavigate } from "react-router-dom";

export function Header({ title, subtitle, onBack, showBackButton }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#e7f4f3] backdrop-blur-sm z-50">
      <div className="my-6 mx-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-full flex justify-between items-center">
            <img
              src="/logo/mjs_logo_text.png"
              alt="MJS Logo"
              className="h-10"
            />
            {showBackButton && (
              <button
                onClick={handleBack}
                className="w-3 h-3 p-7 flex justify-center items-center text-sm bg-primary rounded-full text-white"
              >
                Back
              </button>
            )}
          </div>

          <div className="w-full">
            <h1 className="text-2xl font-bold text-gray-600 text-center">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 text-lg text-center">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContactInfo() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#e7f4f3] z-50">
      <div className="my-6 mx-6">
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <img src="/icons/icon-web.svg" alt="Website" className="w-4 h-4" />
            <span>mjsolution.co.id</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="/icons/icon-call.svg" alt="Call" className="w-4 h-4" />
            <span>(+62) 811-1122-492</span>
          </div>
        </div>
      </div>
    </div>
  );
}
