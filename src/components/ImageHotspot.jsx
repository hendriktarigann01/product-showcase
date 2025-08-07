import { useState } from "react";

const ImageHotspot = ({
  imageSrc,
  hotspots = [],
  productName = "",
  enableZoom = false,
  zoomScale = 2,
}) => {
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  const toggleHotspot = (hotspotId, hotspotData) => {
    if (activeHotspot === hotspotId) {
      closeHotspot();
    } else {
      openHotspot(hotspotId, hotspotData);
    }
  };

  const openHotspot = (hotspotId, hotspotData) => {
    if (enableZoom) {
      setZoomOrigin({ x: hotspotData.x, y: hotspotData.y });
      setIsZooming(true);
      setTimeout(() => setActiveHotspot(hotspotId), 300);
    } else {
      setActiveHotspot(hotspotId);
    }
  };

  const closeHotspot = () => {
    if (enableZoom) {
      setIsZooming(false);
      setTimeout(() => setActiveHotspot(null), 300);
    } else {
      setActiveHotspot(null);
    }
  };

  const adjustHotspotPosition = (x, y) => {
    const width = window.innerWidth;

    if (width < 640) {
      // Mobile
      return { x: x - 0, y: y - [-12] };
    } else if (width < 768) {
      // Tablet
      return { x: x - 0, y: y - 10 };
    }

    // Desktop
    return { x, y };
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) closeHotspot();
  };

  const getImageStyle = () => {
    if (!enableZoom) return {};

    return {
      transform: `scale(${isZooming ? zoomScale : 1})`,
      transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
      transition: "transform 0.3s ease-in-out",
    };
  };

  const getCardPosition = (hotspot) => {
    const { x, y } = adjustHotspotPosition(hotspot.x, hotspot.y);
    const width = window.innerWidth;

    // Card dimensions estimation (in percentage of viewport)
    let cardWidthPercent, cardOffset;

    if (width < 640) {
      // Mobile: card is 90% width
      cardWidthPercent = 90;
      cardOffset = 5; // Small offset from hotspot
    } else if (width < 768) {
      // Tablet
      cardWidthPercent = 60;
      cardOffset = 8;
    } else if (width < 1024) {
      // Desktop small
      cardWidthPercent = 40;
      cardOffset = 10;
    } else {
      // Desktop large
      cardWidthPercent = 25;
      cardOffset = 12;
    }

    // Calculate horizontal position
    let leftPos = null;
    let rightPos = null;

    // Check if card would overflow on the right
    if (x + cardWidthPercent + cardOffset > 100) {
      // Position card to the left of hotspot
      rightPos = `${100 - x + cardOffset}%`;
    } else if (x - cardOffset < 0) {
      // Position card to the right of hotspot (if left would overflow)
      leftPos = `${cardOffset}%`;
    } else {
      // Default: position card to the right of hotspot
      leftPos = `${x + cardOffset}%`;
    }

    // Calculate vertical position
    let topPos = null;
    let bottomPos = null;

    // Estimate card height (roughly 200-250px for mobile, 180-220px for desktop)
    const cardHeightPercent = width < 640 ? 35 : 30;

    // Check if card would overflow at the bottom
    if (y + cardHeightPercent > 100) {
      // Position card above hotspot
      bottomPos = `${100 - y + 5}%`;
    } else if (y - cardHeightPercent < 0) {
      // Position card below hotspot (if top would overflow)
      topPos = `5%`;
    } else {
      // Default: position card below hotspot
      topPos = `${y + 5}%`;
    }

    return {
      left: leftPos,
      right: rightPos,
      top: topPos,
      bottom: bottomPos,
    };
  };

  const RadarEffect = () => (
    <>
      <div className="absolute w-6 h-6 rounded-full bg-teal-500 border opacity-40 animate-ping" />
      <div
        className="absolute w-8 h-8 rounded-full bg-teal-500 border opacity-30 animate-ping"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute w-10 h-10 rounded-full bg-teal-500 border opacity-20 animate-ping"
        style={{ animationDelay: "2s" }}
      />
    </>
  );

  const HotspotButton = ({ hotspot }) => {
    const { x, y } = adjustHotspotPosition(hotspot.x, hotspot.y);

    return (
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          zIndex: isZooming && activeHotspot !== hotspot.id ? 1 : 10,
        }}
        onClick={(e) => {
          e.stopPropagation();
          toggleHotspot(hotspot.id, hotspot);
        }}
      >
        <div className="relative flex items-center justify-center">
          {(!activeHotspot || activeHotspot === hotspot.id) && <RadarEffect />}
          <button
            className={`relative z-10 w-4 h-4 bg-teal-600 rounded-full hover:scale-110 transition-transform duration-200 ${
              activeHotspot && activeHotspot !== hotspot.id
                ? "opacity-0 pointer-events-none"
                : ""
            }`}
          />
        </div>
      </div>
    );
  };

  const InfoCard = ({ hotspot }) => (
    <div
      className="absolute z-[999] w-[55%] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs bg-white rounded-xl shadow-2xl animate-in fade-in-0 slide-in-from-top-4 duration-300"
      style={getCardPosition(hotspot)}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={closeHotspot}
        className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-white transition-colors rounded-full bg-primary hover:bg-teal-700"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="p-3">
        {hotspot.img && (
          <div className="w-full aspect-[16/9] flex items-center justify-center overflow-hidden">
            <img
              src={hotspot.img}
              alt={hotspot.title}
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <h3 className="my-3 md:my-2  text-xs md:text-sm text-center font-semibold md:font-semibold text-gray-600 leading-tight">
          {hotspot.title}
        </h3>
        <p className="text-gray-600 text-xs md:text-sm font-thin md:font-light leading-tight text-center">
          {hotspot.sub_title}
        </p>
      </div>
    </div>
  );

  return (
    <div
      className="relative w-full h-full z-10"
      onClick={handleBackgroundClick}
    >
      {/* Main Image */}
      <div className="w-full h-[300px] sm:h-[400px] md:5 flex items-center justify-center overflow-hidden">
        <img
          src={imageSrc}
          alt={`${productName} - Interactive View`}
          className="max-h-full object-contain"
          style={getImageStyle()}
        />
      </div>

      {/* Hotspots Overlay */}
      <div className="absolute inset-0">
        {hotspots.map((hotspot) => (
          <div key={hotspot.id}>
            <HotspotButton hotspot={hotspot} />
            {activeHotspot === hotspot.id && <InfoCard hotspot={hotspot} />}
          </div>
        ))}
      </div>

      {/* Zoom Overlay */}
      {enableZoom && isZooming && (
        <div className="absolute inset-0 transition-opacity duration-300 pointer-events-none" />
      )}
    </div>
  );
};

export default ImageHotspot;