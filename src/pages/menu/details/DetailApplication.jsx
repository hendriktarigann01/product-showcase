import React, { useRef, useEffect, useState } from "react";
import ImageHotspot from "../../../components/ImageHotspot";
import { Check } from "lucide-react";
import { useMorphTransition } from "../../../utils/MorphTransitionApp";
import { processHotspots } from "../../../utils/ResponsiveHotspot";
import { UseLockScroll } from "../../../hooks/UseLockScroll";

const DetailApplication = ({ selectedApp, onBack, isTransitioning }) => {
  const imageRef = useRef(null);
  const [showContent, setShowContent] = useState(false);
  const [responsiveHotspots, setResponsiveHotspots] = useState([]);
  const { endTransition } = useMorphTransition();

  UseLockScroll();
  useEffect(() => {
    const updateHotspots = () => {
      if (selectedApp?.hotspots) {
        const processed = processHotspots(selectedApp.hotspots);
        setResponsiveHotspots(processed);
      }
    };

    updateHotspots();

    const handleResize = () => {
      updateHotspots();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedApp]);

  useEffect(() => {
    if (selectedApp) {
      if (isTransitioning) {
        const timer = setTimeout(() => {
          setShowContent(true);

          setTimeout(() => {
            endTransition();
          }, 100);
        }, 320);

        return () => clearTimeout(timer);
      } else {
        setShowContent(true);
      }
    }
  }, [selectedApp, isTransitioning, endTransition]);

  const handleBack = () => {
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
        <div
          key={index}
          className="flex gap-2 md:gap-4 items-center justify-start"
        >
          <div className="w-4 h-4 lg:w-5 lg:h-5 bg-teal-500 rounded-full flex justify-center items-center">
            <Check size={11} className="text-white" />
          </div>
          <span className="capitalize text-left text-gray-600">
            {key.replace(/_/g, " ")}
          </span>
        </div>
      ));
  }

  return (
    <div
      className="flex flex-col bg-[#e7f4f3] overflow-hidden"
      style={{ height: "100dvh" }}
    >
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-[#e7f4f3] backdrop-blur-sm z-[9999] md:z-50">
        <div className="my-4 mx-4 md:my-6 md:mx-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-full flex justify-between items-center">
              <img
                src="/logo/mjs_logo_text.png"
                alt="MJS Logo"
                className="h-7 sm:h-10 mb-3 sm:mb-0"
              />
              <button
                onClick={handleBack}
                className="w-2 h-2 p-5 md:p-7 flex justify-center items-center text-xs md:text-sm bg-primary rounded-full text-white z-[1001] relative"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Flex grow to fill available space */}
      <div className="flex-grow flex md:items-center md:justify-center">
        <div className="max-w-7xl mx-auto w-full z-10 md:z-[9999]">
          <div className="px-4 sm:px-6 md:px-8">
            <h1 className="text-lg md:text-2xl mt-[70px] lg:mt-0 text-gray-600 text-center">
              Applications
            </h1>
          </div>

          {/* Applications Content */}
          <div className="px-4 sm:px-6 md:px-12 lg:px-20 h-auto lg:h-[500px] flex items-center justify-center">
            <div className="flex flex-col mt-10 lg:flex-row lg:items-center lg:justify-center gap-6 lg:gap-12 w-full max-w-[1600px]">
              {/* Image Section  */}
              <div className="w-full lg:flex-1 flex justify-center items-center">
                <div
                  ref={imageRef}
                  className={`w-full max-w-2xl lg:max-w-2xl transition-all duration-300 ease-out relative ${
                    showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                  data-detail-image="true"
                  style={{ zIndex: 2 }} // Higher z-index to ensure hotspot cards appear on top
                >
                  {responsiveHotspots && responsiveHotspots.length > 0 ? (
                    <div className="relative w-full">
                      <ImageHotspot
                        imageSrc={selectedApp.image}
                        hotspots={responsiveHotspots}
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

              {/* Information Panel */}
              <div
                className={`w-full lg:flex-1 flex flex-col justify-center max-w-full lg:max-w-sm text-left transition-all duration-300 ease-out delay-100           
                          ${
                            showContent
                              ? "opacity-100 translate-y-0 lg:translate-x-0"
                              : "opacity-0 translate-y-4 lg:translate-x-8"
                          }`}
                style={{ zIndex: 1 }}
              >
                {/* Title */}
                <h2 className="text-base md:text-2xl text-gray-600 uppercase mx-0 md:mx-12 lg:mx-0">
                  {selectedApp.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-xs md:text-base my-1 md:my-4 mx-0 md:mx-12 lg:mx-0">
                  {selectedApp.content}
                </p>

                {/* Type */}
                <div className="text-gray-600 text-xs/6 md:text-base mx-0 md:mx-12 lg:mx-0">
                  {renderTypes(selectedApp.type)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info - Fixed at bottom */}
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

export default DetailApplication;
