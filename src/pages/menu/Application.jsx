import React, { useRef } from "react";
import DetailApplication from "../menu/details/DetailApplication";
import { useMorphTransition } from "../../utils/MorphTransitionApp";
import { NavigationService } from "../../services/NavigationService";
import { UseLockScroll } from "../../hooks/UseLockScroll";

// Hooks
import { UseAppResponsive } from "../../hooks/UseAppResponsive";
import { UseAppNavigation } from "../../hooks/UseAppNavigation";
import { UseAppState } from "../../hooks/UseAppState";
import { UseAppInteraction } from "../../hooks/UseAppInteraction";

// Utils
import {
  getImageSource,
  getResponsiveStyle,
  getResponsiveHotspotPosition,
  generateCompositeHotspots,
} from "../../utils/pages/ApplicationHelpers";

const Application = ({ product: propProduct, productIndex: propIndex }) => {
  const containerRef = useRef(null);
  const { startTransition, isTransitioning, endTransition } =
    useMorphTransition();

  UseLockScroll();
  const containerDimensions = UseAppResponsive(containerRef);
  const { currentSlug, isLED, navigate } = UseAppNavigation();
  const {
    product,
    selectedApp,
    setSelectedApp,
    selectedAppId,
    setSelectedAppId,
  } = UseAppState(propProduct, propIndex);

  const {
    imageRefs,
    hotspotRefs,
    handleImageClick,
    handleBackFromDetailExternal,
  } = UseAppInteraction(
    product,
    selectedApp,
    setSelectedApp,
    selectedAppId,
    setSelectedAppId,
    startTransition,
    endTransition,
    isTransitioning
  );

  // Navigation handlers
  const NavigationHandlers = currentSlug
    ? NavigationService.buildMenuNavigationHandlers(
        navigate,
        isLED,
        currentSlug
      )
    : {
        handleBackToProductDetail: () => {
          console.warn("Cannot navigate back: slug is undefined");
          const basePath = isLED ? "/led-display" : "/lcd-display";
          navigate(basePath);
        },
      };

  if (selectedApp) {
    return (
      <DetailApplication
        selectedApp={selectedApp}
        onBack={handleBackFromDetailExternal}
        isTransitioning={isTransitioning}
      />
    );
  }

  const appImages = product.app || [];
  const appRooms = product.app_room || [];
  const compositeHotspots = generateCompositeHotspots(
    appRooms,
    appImages,
    handleImageClick
  );

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
                onClick={NavigationHandlers.handleBackToProductDetail}
                className="w-2 h-2 p-5 md:p-7 flex justify-center items-center text-xs md:text-sm bg-primary rounded-full text-white z-[1001] relative"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex md:items-center md:justify-center">
        <div className="max-w-7xl mx-auto w-full z-10 md:z-[9999]">
          <div className="px-4 sm:px-6 md:px-8">
            <h1 className="text-lg md:text-2xl mt-[70px] lg:mt-0 text-gray-600 text-center">
              Applications
            </h1>
          </div>

          {/* Applications Content */}
          <div className="px-0 sm:px-6 md:px-12 lg:px-20 h-auto lg:h-[500px] flex items-center justify-center">
            <div className="flex flex-col mt-10 lg:items-center lg:justify-center gap-6 lg:gap-12 w-full max-w-[1600px]">
              {/* Applications Display */}
              <div className="w-full flex justify-center items-center">
                <div
                  ref={containerRef}
                  className="relative flex items-center justify-center"
                  style={{
                    width: containerDimensions.width,
                    height: containerDimensions.height,
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                >
                  {/* Composite Image Layer */}
                  <div className="relative w-full h-full">
                    {compositeHotspots.map((hotspot) => {
                      const appImage = appImages.find(
                        (app) => app.id === hotspot.appId
                      );
                      if (!appImage) return null;

                      const isSelected = selectedAppId === hotspot.appId;
                      const shouldHide = isTransitioning && isSelected;
                      const imageSource = getImageSource(appImage, product);
                      const responsiveStyle = getResponsiveStyle(
                        hotspot.style,
                        containerDimensions
                      );

                      return (
                        <img
                          key={hotspot.id}
                          ref={(el) => (imageRefs.current[hotspot.appId] = el)}
                          src={imageSource}
                          alt={hotspot.title}
                          className="absolute object-contain cursor-pointer transition-all duration-300 ease-out"
                          style={{
                            ...responsiveStyle,
                            opacity: shouldHide ? 0 : 1,
                            visibility: shouldHide ? "hidden" : "visible",
                          }}
                          onClick={() => handleImageClick(hotspot.appId)}
                        />
                      );
                    })}
                  </div>

                  {/* Hotspot Layer */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ zIndex: 100 }}
                  >
                    {compositeHotspots.map((hotspot) => {
                      const isSelected = selectedAppId === hotspot.appId;
                      const shouldHide = isTransitioning && isSelected;
                      const responsivePosition = getResponsiveHotspotPosition(
                        hotspot.x,
                        hotspot.y
                      );

                      return (
                        <div key={hotspot.id}>
                          <div
                            ref={(el) =>
                              (hotspotRefs.current[hotspot.appId] = el)
                            }
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto transition-all duration-300 ease-out"
                            style={{
                              left: `${responsivePosition.x}%`,
                              top: `${responsivePosition.y}%`,
                              zIndex: 101,
                              opacity: shouldHide ? 0 : 1,
                            }}
                            onClick={hotspot.onClick}
                            data-hotspot-id={hotspot.appId}
                          >
                            <div className="relative flex items-center justify-center">
                              {/* Animated Rings */}
                              {!shouldHide && (
                                <>
                                  <div className="absolute w-4 h-4 md:w-6 md:h-6 rounded-full bg-teal-500 border opacity-40 animate-ping"></div>
                                  <div
                                    className="absolute w-6 h-6 md:w-8 md:h-8 rounded-full bg-teal-500 border opacity-30 animate-ping"
                                    style={{ animationDelay: "1.5s" }}
                                  ></div>
                                  <div
                                    className="absolute w-8 h-8 md:w-10 md:h-10 rounded-full bg-teal-500 border opacity-20 animate-ping"
                                    style={{ animationDelay: "2s" }}
                                  ></div>
                                </>
                              )}

                              <button
                                className={`relative w-3 h-3 md:w-4 md:h-4 bg-teal-600 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                                  isSelected
                                    ? "scale-125 bg-teal-700"
                                    : "hover:scale-110"
                                }`}
                                disabled={isTransitioning}
                              ></button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Overlay untuk mencegah interaksi saat transisi */}
                  {isTransitioning && (
                    <div
                      className="absolute inset-0 bg-transparent"
                      style={{ zIndex: 999 }}
                    />
                  )}
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
            <div className="flex items-start gap-2 w-auto lg:mx-0">
              <img
                src="/icons/icon-web.svg"
                alt="Website"
                className="w-4 h-4"
              />
              <span className="text-xs lg:text-sm">mjsolution.co.id</span>
            </div>
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

export default Application;
