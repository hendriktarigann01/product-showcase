import React, { useRef, useEffect, useState } from "react";
import ImageHotspot from "../../../components/ImageHotspot";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useMorphTransition } from "../../../utils/MorphTransitionApp";

function Header({ title, subtitle, onBack, showBackButton }) {
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
                onClick={onBack}
                className="w-3 h-3 p-7 flex justify-center items-center text-sm bg-primary rounded-full text-white hover:bg-primary/90 transition-colors"
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

function ContactInfo() {
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

const DetailApplication = ({ selectedApp, onBack, isTransitioning }) => {
  const imageRef = useRef(null);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();
  const { transitionData, endTransition } = useMorphTransition();

  useEffect(() => {
    if (selectedApp) {
      if (isTransitioning) {
        // Delay showing content to allow morphing animation to complete
        const timer = setTimeout(() => {
          setShowContent(true);
          // End transition after content is shown
          setTimeout(() => {
            endTransition();
          }, 100);
        }, 320);

        return () => clearTimeout(timer);
      } else {
        // Show immediately if no transition
        setShowContent(true);
      }
    }
  }, [selectedApp, isTransitioning, endTransition]);

  const handleBack = () => {
    // Always call onBack callback, jangan gunakan navigate(-1)
    if (onBack) {
      onBack();
    }
  };

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
          <span className="capitalize text-lefttext-lg text-gray-600">
            {key.replace(/_/g, " ")}
          </span>
        </div>
      ));
  }

  return (
    <div className="max-h-screen">
      <Header
        title="Applications"
        className="text-secondary"
        onBack={handleBack}
        showBackButton={true}
      />

      {/* Detail View */}
      <div className="w-full h-screen pt-32 pb-24 bg-[#e7f4f3] px-4 lg:px-12 box-border overflow-hidden">
        {/* Main Content Container */}
        <div className="max-w-6xl mx-auto h-full flex items-center justify-center">
          <div className="w-full flex items-center justify-between gap-16">
            {/* Left Side - Image */}
            <div className="flex-1 flex items-center justify-center">
              <div
                ref={imageRef}
                className={`w-full max-w-2xl transition-all duration-300 ease-out ${
                  showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                data-detail-image="true"
              >
                {selectedApp.hotspots && selectedApp.hotspots.length > 0 ? (
                  <ImageHotspot
                    imageSrc={selectedApp.image}
                    hotspots={selectedApp.hotspots}
                    productName={selectedApp.title}
                    containerClass="relative w-full h-full"
                    showRadarEffect={true}
                    hotspotSize="w-4 h-4"
                    cardWidth="w-64"
                  />
                ) : (
                  <div className="w-full flex items-center justify-center">
                    <img
                      src={selectedApp.image}
                      alt={selectedApp.title}
                      className="max-w-full max-h-[400px] object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Information Panel */}
            <div
              className={`flex-1 flex flex-col justify-center max-w-sm transition-all duration-300 ease-out delay-100 ${
                showContent
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
            >
              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-600 uppercase tracking-wider">
                {selectedApp.title}
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-lg/8 my-4">
                {selectedApp.content}
              </p>

              {/* Type */}
              <div className="text-gray-600 text-lg/8">
                {renderTypes(selectedApp.type)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactInfo />
    </div>
  );
};

export default DetailApplication;