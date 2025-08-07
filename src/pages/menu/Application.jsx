import React, { useState, useRef, useEffect } from "react";
import DetailApplication from "../menu/details/DetailApplication";
import { useMorphTransition } from "../../utils/MorphTransitionApp";

const Application = ({
  product: propProduct,
  productIndex: propIndex,
  onBack,
}) => {
  const [product, setProduct] = useState(propProduct);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 910,
    height: 490,
  });
  const imageRefs = useRef({});
  const hotspotRefs = useRef({});
  const containerRef = useRef(null);
  const { startTransition, isTransitioning, endTransition } =
    useMorphTransition();

  // Calculate responsive dimensions
  useEffect(() => {
    const calculateDimensions = () => {
      if (!containerRef.current) return;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Base dimensions
      const baseWidth = 910;
      const baseHeight = 490;
      const aspectRatio = baseWidth / baseHeight;

      let newWidth, newHeight;

      if (screenWidth <= 768) {
        // Mobile: use most of screen width with padding
        const availableWidth = screenWidth - 32; // 16px padding on each side
        const availableHeight = screenHeight - 200; // Account for header and footer

        if (availableWidth / aspectRatio <= availableHeight) {
          newWidth = availableWidth;
          newHeight = availableWidth / aspectRatio;
        } else {
          newHeight = availableHeight;
          newWidth = availableHeight * aspectRatio;
        }
      } else if (screenWidth <= 1024) {
        // Tablet: scale down proportionally
        const scale = Math.min((screenWidth / baseWidth) * 0.8, 1);
        newWidth = baseWidth * scale;
        newHeight = baseHeight * scale;
      } else {
        // Desktop: use base dimensions
        newWidth = baseWidth;
        newHeight = baseHeight;
      }

      setContainerDimensions({
        width: Math.floor(newWidth),
        height: Math.floor(newHeight),
      });
    };

    calculateDimensions();
    window.addEventListener("resize", calculateDimensions);
    return () => window.removeEventListener("resize", calculateDimensions);
  }, []);

  useEffect(() => {
    if (!propProduct) {
      const savedProduct = localStorage.getItem("selectedProduct");
      const savedIndex = localStorage.getItem("selectedProductIndex");

      if (savedProduct) setProduct(JSON.parse(savedProduct));
    }
  }, [propProduct, propIndex]);

  useEffect(() => {
    const handleBackFromDetail = () => {
      setSelectedApp(null);
      setSelectedAppId(null);
      endTransition();

      window.history.pushState(
        { view: "application" },
        "",
        window.location.pathname
      );
    };

    const handlePopState = () => {
      if (selectedApp) {
        handleBackFromDetail();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectedApp, endTransition]);

  // Helper function to determine if this is LED Outdoor product
  const isLEDOutdoorProduct = (product) => {
    return (
      product?.name?.toLowerCase().includes("outdoor") &&
      product?.name?.toLowerCase().includes("led")
    );
  };

  // Helper function to get the correct image source
  const getImageSource = (appImage) => {
    if (isLEDOutdoorProduct(product)) {
      return appImage.image_full;
    }
    return appImage.image;
  };

  // Calculate responsive positioning and sizing
  const getResponsiveStyle = (originalStyle) => {
    const scaleX = containerDimensions.width / 910;
    const scaleY = containerDimensions.height / 490;

    return {
      left: originalStyle.left * scaleX,
      top: originalStyle.top * scaleY,
      width: originalStyle.width * scaleX,
      height: originalStyle.height * scaleY,
      zIndex: originalStyle.zIndex,
    };
  };

  // Calculate responsive hotspot positioning
  const getResponsiveHotspotPosition = (x, y) => {
    return {
      x: x, // Keep percentage-based positioning
      y: y,
    };
  };

  const handleImageClick = (appId) => {
    const appImages = product?.app || [];
    const selectedAppData = appImages.find((item) => item.id === appId);
    if (!selectedAppData || isTransitioning) return;

    const clickedImageElement = imageRefs.current[appId];
    const hotspotElement = hotspotRefs.current[appId];

    if (clickedImageElement && hotspotElement) {
      const imageSource = getImageSource(selectedAppData);

      startTransition(clickedImageElement, null, {
        direction: "forward",
        appId: appId,
        selectedApp: selectedAppData,
        startImage: imageSource,
        endImage: imageSource,
      });
    }

    setSelectedAppId(appId);

    window.history.pushState(
      { view: "detail", appId },
      "",
      window.location.pathname
    );

    setTimeout(() => {
      setSelectedApp(selectedAppData);
      window.history.pushState(
        { view: "detail", appId },
        "",
        `${window.location.pathname}?detail=${appId}`
      );
    }, 50);
  };

  const handleBackFromDetailExternal = () => {
    setSelectedApp(null);
    setSelectedAppId(null);
    endTransition();

    window.history.pushState(
      { view: "application" },
      "",
      window.location.pathname
    );
  };

  if (!product) return null;

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

  let compositeHotspots = [];

  if (appRooms.length > 0) {
    compositeHotspots = appRooms.map((room) => ({
      ...room,
      onClick: () => handleImageClick(room.appId),
    }));
  } else if (appImages.length > 0) {
    compositeHotspots = appImages.map((app, index) => ({
      id: `hotspot-${app.id}`,
      appId: app.id,
      title: app.title,
      x: 20 + index * 25,
      y: 30 + index * 20,
      onClick: () => handleImageClick(app.id),
      style: {
        width: 200,
        height: 150,
        left: 10 + index * 30,
        top: 20 + index * 25,
        zIndex: 1,
      },
    }));
  }

  return (
    <div className="max-h-screen">
      {/* Header - Responsive */}
      <div className="fixed top-0 left-0 right-0 bg-[#e7f4f3] backdrop-blur-sm z-50">
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

            <div className="w-full mt-2">
              <h1 className="text-xl md:text-2xl font-bold text-gray-600 text-center">
                Applications
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-screen pt-24 md:pt-32 pb-16 md:pb-24 bg-[#e7f4f3] px-4 lg:px-12 box-border overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          <div className="flex-grow flex items-center justify-center">
            <div className="flex items-center justify-center w-full">
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
                    const imageSource = getImageSource(appImage);

                    // Calculate responsive style
                    const responsiveStyle = getResponsiveStyle(hotspot.style);

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

                    // Use original percentage positioning for hotspots
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
                            {/* Animated Rings - responsive size */}
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

export default Application;
