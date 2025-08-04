import React, { useEffect, useState } from "react";
import { X, Check } from "lucide-react";

const ZoomModal = ({ selectedApp, onClose, isTransitioning }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (selectedApp) {
      if (isTransitioning) {
        // Delay showing content to allow morphing animation to complete
        const timer = setTimeout(() => {
          setShowContent(true);
        }, 320);
        return () => clearTimeout(timer);
      } else {
        // Show immediately if no transition
        setShowContent(true);
      }
    }
  }, [selectedApp, isTransitioning]);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    // Handle ESC key
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function renderTypes(typeArray) {
    if (!typeArray || !typeArray[0]) return null;

    const typeObject = typeArray[0];
    return Object.entries(typeObject)
      .filter(([, value]) => value === true)
      .map(([key], index) => (
        <div key={index} className="flex gap-4 items-center justify-start">
          <div className="w-5 h-5 bg-teal-500 rounded-full flex justify-center items-center">
            <Check size={12} className="text-white" />
          </div>
          <span className="capitalize text-left text-lg text-gray-600">
            {key.replace(/_/g, " ")}
          </span>
        </div>
      ));
  }

  if (!selectedApp) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative bg-[#e7f4f3] rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden transition-all duration-300 ease-out ${
          showContent
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Content */}
        <div className="p-8 flex items-center justify-between gap-12 min-h-[500px]">
          {/* Left Side - Image */}
          <div className="flex-1 flex items-center justify-center">
            <div
              className={`w-full max-w-2xl transition-all duration-300 ease-out delay-100 ${
                showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <img
                src="/products_led/outdoor/application/app_1.svg"
                alt={selectedApp.title}
                className="w-full h-auto object-contain max-h-[400px]"
              />
            </div>
          </div>

          {/* Right Side - Information Panel */}
          <div
            className={`flex-1 flex flex-col justify-center max-w-lg transition-all duration-300 ease-out delay-200 ${
              showContent
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-600 uppercase tracking-wider mb-6">
              {selectedApp.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {selectedApp.content}
            </p>

            {/* Type */}
            <div className="space-y-3">{renderTypes(selectedApp.type)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoomModal;
