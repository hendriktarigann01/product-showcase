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
    <div className="min-h-screen flex flex-col bg-[#e7f4f3] overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-[#e7f4f3] backdrop-blur-sm">
        <div className="my-4 mx-4 md:my-6 md:mx-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-full flex justify-between items-center">
              <img
                src="/logo/mjs_logo_text.png"
                alt="MJS Logo"
                className="h-7 sm:h-10 mb-3 sm:mb-0"
              />
              <button
                onClick={onBack}
                className="w-2 h-2 p-5 md:p-7 flex justify-center items-center text-xs md:text-sm bg-primary rounded-full text-white"
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
      <div className="flex-grow flex flex-col items-center justify-center px-4 lg:px-12 pt-24 pb-10 w-full">
        {/* Main Product Image */}
        <div className="w-full max-w-[600px] h-[200px] sm:h-[260px] md:h-[300px] lg:h-[320px] flex justify-center items-center">
          <img
            src={selectedOptionData?.image}
            alt={selectedOptionData?.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Implementation Options */}
        <div className="mt-8 w-full max-w-4xl">
          <div className="flex gap-4 overflow-x-auto pb-2 lg:flex-wrap lg:justify-center">
            {ImplementationOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                className={`relative p-2 rounded-lg border transition-all duration-200 flex-shrink-0 flex flex-col items-center w-28 sm:w-32 ${
                  selectedOption === option.id
                    ? "border-[#4ECDC4] bg-[#4ECDC4]/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={option.image}
                  alt={option.title}
                  className="max-h-16 sm:max-h-20 object-contain mb-2"
                />
                <h3 className="text-[10px] sm:text-xs font-medium text-gray-700 text-center">
                  {option.title}
                </h3>

                {selectedOption === option.id && (
                  <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#4ECDC4] rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#e7f4f3]">
        <div className="my-6 mx-3 sm:mx-7 text-sm text-gray-600">
          <div className="flex justify-between items-center flex-wrap">
            {/* Website */}
            <div className="flex items-start gap-2 w-auto lg:mx-0">
              <img
                src="/icons/icon-web.svg"
                alt="Website"
                className="w-4 h-4"
              />
              <span className="text-xs lg:text-sm">mjsolution.co.id</span>
            </div>

            {/* Phone */}
            <div className="flex items-end gap-2 w-auto lg:mx-0">
              <img src="/icons/icon-call.svg" alt="Call" className="w-4 h-4" />
              <span className="text-xs lg:text-sm">(+62) 811-1122-492</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Implementation;
