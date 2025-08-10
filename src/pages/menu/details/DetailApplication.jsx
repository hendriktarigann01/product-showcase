import React, { useRef, useEffect, useState } from "react";
import ImageHotspot from "../../../components/ImageHotspot";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useMorphTransition } from "../../../utils/MorphTransitionApp";

function Header({ title, subtitle, onBack, showBackButton }) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-[#e7f4f3] backdrop-blur-sm z-50">
      <div className="my-4 mx-4 md:my-6 md:mx-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-full flex justify-between items-center">
            <img
              src="/logo/mjs_logo_text.png"
              alt="MJS Logo"
              className="h-7 sm:h-10 mb-3 sm:mb-0"
            />
            {showBackButton && (
              <button
                onClick={onBack}
                className="w-2 h-2 p-5 md:p-7 flex justify-center items-center text-xs md:text-sm bg-primary rounded-full text-white"
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
    <div className="fixed bottom-0 left-0 right-0 bg-[#e7f4f3] z-40">
      <div className="my-6 mx-3 sm:mx-7 text-sm text-gray-600">
        <div className="flex justify-between items-center flex-wrap">
          {/* Website */}
          <div className="flex items-start gap-2 w-auto lg:mx-0">
            <img src="/icons/icon-web.svg" alt="Website" className="w-4 h-4" />
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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

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
          <span className="capitalize text-left text-lg text-gray-600">
            {key.replace(/_/g, " ")}
          </span>
        </div>
      ));
  }

  return (
    <div className="max-h-screen relative">
      <Header
        title="Applications"
        className="text-secondary"
        onBack={handleBack}
        showBackButton={true}
      />

      {/* Detail View - Removed overflow-hidden and adjusted for mobile */}
      <div className="w-full h-screen pt-32 pb-24 bg-[#e7f4f3] px-4 lg:px-12 box-border">
        {/* Main Content Container */}
        <div className="max-w-6xl m-auto h-full flex lg:items-center justify-center py-4 lg:py-0">
          <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-0 lg:gap-16">
            {/* Image Section  */}
            <div className="flex-1 max-h-full flex items-center justify-center order-1 lg:order:1 relative">
              <div
                ref={imageRef}
                className={`w-full max-w-2xl lg:max-w-2xl transition-all duration-300 ease-out relative ${
                  showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                data-detail-image="true"
                style={{ zIndex: 2 }} // Higher z-index to ensure hotspot cards appear on top
              >
                {selectedApp.hotspots && selectedApp.hotspots.length > 0 ? (
                  <div className="relative w-full">
                    <ImageHotspot
                      imageSrc={selectedApp.image}
                      hotspots={selectedApp.hotspots}
                      productName={selectedApp.title}
                      containerClass="relative w-full h-full"
                      showRadarEffect={true}
                      hotspotSize="w-4 h-4"
                      cardWidth="w-64"
                      // Pass additional props to ensure proper z-index handling
                      cardZIndex="z-[100]"
                      overlayZIndex="z-[99]"
                    />
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-center">
                    <img
                      src={selectedApp.image}
                      alt={selectedApp.title}
                      className="max-w-full max-h-[300px] md:max-h-[350px] lg:max-h-[400px] object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Information Panel - Moved to top on mobile */}
            <div
              className={`flex-1 flex h-[250px] flex-col justify-center w-full max-w-full lg:max-w-sm order-2 lg:order-2 text-center lg:text-left transition-all duration-300 ease-out delay-100 ${
                showContent
                  ? "opacity-100 translate-y-0 lg:translate-x-0"
                  : "opacity-0 translate-y-4 lg:translate-x-8"
              }`}
              style={{ zIndex: 1 }} // Lower z-index than hotspot cards
            >
              {/* Title */}
              <h2 className="text-xl md:text-2xl font-bold text-gray-600 uppercase tracking-wider">
                {selectedApp.title}
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-base md:text-lg/8 my-3 md:my-4">
                {selectedApp.content}
              </p>

              {/* Type */}
              <div className="text-gray-600 text-base md:text-lg/8">
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
