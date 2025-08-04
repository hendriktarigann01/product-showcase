import React, { useState } from "react";

const Implementation = ({ product, onBack }) => {
  const [selectedOption, setSelectedOption] = useState("none");

  // Gunakan langsung image_implement dari product
  const ImplementationOptions = product?.image_implement || [];

  // Temukan data dari opsi terpilih
  const selectedOptionData =
    ImplementationOptions.find((opt) => opt.id === selectedOption) ||
    ImplementationOptions[0];

  return (
    <div className="max-h-screen flex flex-col bg-[#e7f4f3]">
      {/* Header - Embedded */}
      <div className="fixed top-0 left-0 right-0 bg-[#e7f4f3] backdrop-blur-sm z-50">
        <div className="my-6 mx-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-full flex justify-between items-center">
              <img
                src="/logo/mjs_logo_text.png"
                alt="MJS Logo"
                className="h-10"
              />
              <button
                onClick={onBack}
                className="w-3 h-3 p-7 flex justify-center items-center text-sm bg-primary rounded-full text-white"
              >
                Back
              </button>
            </div>

            <div className="w-full">
              <h1 className="text-2xl font-bold text-gray-600 text-center">
                {selectedOptionData?.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main section */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 lg:px-12 pt-24 pb-10">
        {/* Title */}
        <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">
          {selectedOptionData?.title}
        </h2>

        {/* Main Product Image */}
        <div className="w-[600px] h-[320px] flex justify-center items-center">
          <img
            src={selectedOptionData?.image}
            alt={selectedOptionData?.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Implementation Options */}
        <div className="flex flex-wrap justify-center gap-5 mt-8 max-w-4xl">
          {ImplementationOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={`relative p-2 rounded-lg border transition-all duration-200 flex flex-col items-center w-32 ${
                selectedOption === option.id
                  ? "border-[#4ECDC4] bg-[#4ECDC4]/10"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={option.image}
                alt={option.title}
                className="max-h-20 object-contain mb-2"
              />
              <h3 className="text-xs font-medium text-gray-700 text-center">
                {option.title}
              </h3>

              {selectedOption === option.id && (
                <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#4ECDC4] rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Contact Info - Embedded */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#e7f4f3] z-50">
        <div className="my-7 mx-6">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <img
                src="/icons/icon-web.svg"
                alt="Website"
                className="w-4 h-4"
              />
              <span>mjsolution.co.id</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/icons/icon-call.svg" alt="Call" className="w-4 h-4" />
              <span>(+62) 811-1122-492</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Implementation;
