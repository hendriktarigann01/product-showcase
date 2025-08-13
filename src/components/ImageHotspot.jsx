import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

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
  const [containerRect, setContainerRect] = useState(null);
  const [showHighlight, setShowHighlight] = useState(false);

  useEffect(() => {
    if (activeHotspot) {
      const container = document.querySelector("[data-hotspot-container]");
      if (container) {
        setContainerRect(container.getBoundingClientRect());
      }
    }
  }, [activeHotspot]);

  const toggleHotspot = (hotspotId, hotspotData) => {
    if (activeHotspot === hotspotId) {
      closeHotspot();
    } else {
      openHotspot(hotspotId, hotspotData);
    }
  };

  const openHotspot = (hotspotId, hotspotData) => {
    // Untuk LED products, tampilkan highlight effect
    if (
      productName === "LED Outdoor for Fixed Installation" ||
      productName === "LED Indoor for Fixed Installation"
    ) {
      setShowHighlight(true);
      setActiveHotspot(hotspotId);
    }
    // Untuk produk lain dengan zoom
    else if (enableZoom) {
      setZoomOrigin({ x: hotspotData.x, y: hotspotData.y });
      setIsZooming(true);
      setTimeout(() => setActiveHotspot(hotspotId), 300);
    } else {
      setActiveHotspot(hotspotId);
    }
  };

  const closeHotspot = () => {
    if (
      productName === "LED Outdoor for Fixed Installation" ||
      productName === "LED Indoor for Fixed Installation"
    ) {
      setShowHighlight(false);
      setActiveHotspot(null);
    } else if (enableZoom) {
      setIsZooming(false);
      setTimeout(() => setActiveHotspot(null), 300);
    } else {
      setActiveHotspot(null);
    }
  };

  const adjustHotspotPosition = (x, y) => {
    const width = window.innerWidth;

    if (width < 640) {
      return { x: x - 0, y: y - [-12] };
    } else if (width < 768) {
      return { x: x - 0, y: y - 10 };
    }
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
    if (!containerRect) return {};

    const { x, y } = adjustHotspotPosition(hotspot.x, hotspot.y);
    const width = window.innerWidth;

    // Calculate hotspot position in viewport
    const hotspotX = containerRect.left + (x / 100) * containerRect.width;
    const hotspotY = containerRect.top + (y / 100) * containerRect.height;

    // Card dimensions
    let cardWidth = width < 640 ? 250 : width < 768 ? 300 : 350;
    const cardOffset = 20;

    // Position horizontally
    let left = hotspotX + cardOffset;
    if (left + cardWidth > width) {
      left = hotspotX - cardWidth - cardOffset;
    }
    if (left < 10) left = 10;

    // Position vertically
    let top = hotspotY + cardOffset;
    const cardHeight = 200;
    if (top + cardHeight > window.innerHeight) {
      top = hotspotY - cardHeight - cardOffset;
    }
    if (top < 10) top = 10;

    return {
      position: "fixed",
      left: `${left}px`,
      top: `${top}px`,
      width: `${cardWidth}px`,
      zIndex: 99999,
    };
  };

  const getHighlightOverlay = () => {
    if (!showHighlight) return null;

    const isOutdoor = productName === "LED Outdoor for Fixed Installation";

    if (isOutdoor) {
      // Outdoor: Module area ada di kanan bawah (seperti di gambar Anda)
      return (
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] flex items-center justify-center pointer-events-none transform -translate-x-1/2 -translate-y-1/2">
          {/* Dark overlay untuk seluruh area kecuali module */}
          <div className="absolute inset-0 bg-black bg-opacity-30 transition-opacity duration-300"></div>

          {/* Area module kanan bawah tetap terang */}
          <div className="absolute bottom-10 right-25 w-1/3 h-1/5 bg-white bg-opacity-90 transition-all duration-300"></div>
        </div>
      );
    } else {
      // Indoor: Module area ada di tengah (seperti di gambar Anda)
      return (
        <div className="absolute top-1/2 left-1/2 w-[534px] h-[400px] flex items-center justify-center pointer-events-none transform -translate-x-1/2 -translate-y-1/2">
          {/* Dark overlay untuk seluruh area kecuali module */}
          <div className="absolute inset-0 bg-black bg-opacity-30 transition-opacity duration-300"></div>

          {/* Area module tengah tetap terang */}
          <div className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-[30%] bg-white bg-opacity-90 transition-all duration-300"></div>
        </div>
      );
    }
  };

  const RadarEffect = () => (
    <>
      <div className="absolute w-4 md:w-6 h-4 md:h-6 rounded-full bg-teal-500 border opacity-40 animate-ping" />
      <div
        className="absolute w-6 md:w-8 h-6 md:h-8 rounded-full bg-teal-500 border opacity-30 animate-ping"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute w-8 md:w-10 h-8 md:h-10 rounded-full bg-teal-500 border opacity-20 animate-ping"
        style={{ animationDelay: "2s" }}
      />
    </>
  );

  const HotspotButton = ({ hotspot }) => {
    const { x, y } = adjustHotspotPosition(hotspot.x, hotspot.y);

    return (
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-50"
        style={{
          left: `${x}%`,
          top: `${y}%`,
        }}
        onClick={(e) => {
          e.stopPropagation();
          toggleHotspot(hotspot.id, hotspot);
        }}
      >
        <div className="relative flex items-center justify-center">
          {(!activeHotspot || activeHotspot === hotspot.id) && <RadarEffect />}
          <button
            className={`relative z-10 w-3 h-3 md:w-4 md:h-4 bg-teal-600 rounded-full hover:scale-110 transition-transform duration-200 ${
              activeHotspot && activeHotspot !== hotspot.id
                ? "opacity-0 pointer-events-none"
                : ""
            }`}
          />
        </div>
      </div>
    );
  };

  const InfoCard = ({ hotspot }) => {
    const cardStyle = getCardPosition(hotspot);

    const cardElement = (
      <div
        className="bg-white rounded-xl shadow-2xl animate-in fade-in-0 slide-in-from-top-4 duration-300"
        style={cardStyle}
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

        <div className="p-5 space-y-1">
          {hotspot.img && (
            <div className="w-full aspect-[16/9] flex items-center justify-center overflow-hidden mx-auto">
              <img
                src={hotspot.img}
                alt={hotspot.title}
                className="w-full h-full rounded-md lg:rounded-lg object-contain object-center"
              />
            </div>
          )}
          <h3 className="text-sm lg:text-base text-center font-bold text-gray-800">
            {hotspot.title}
          </h3>

          <p className="text-gray-600 text-center text-xs lg:text-sm leading-relaxed">
            {hotspot.sub_title}
          </p>
        </div>
      </div>
    );

    // Use portal to render at document body level
    return createPortal(cardElement, document.body);
  };

  return (
    <div
      className="relative w-full h-full z-10"
      onClick={handleBackgroundClick}
      data-hotspot-container
    >
      {/* Main Image */}
      <div className="w-[320px] h-[220px] md:h-[300px] lg:w-[650px] lg:h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src={imageSrc}
          alt={`${productName}`}
          className="max-h-full object-contain"
          style={getImageStyle()}
        />
      </div>

      {/* LED Module Highlight Overlay */}
      {getHighlightOverlay()}

      {/* Hotspots Overlay */}
      <div className="absolute inset-0">
        {hotspots.map((hotspot) => (
          <HotspotButton key={hotspot.id} hotspot={hotspot} />
        ))}
      </div>

      {/* Info Cards rendered via portal */}
      {hotspots.map(
        (hotspot) =>
          activeHotspot === hotspot.id && (
            <InfoCard key={`card-${hotspot.id}`} hotspot={hotspot} />
          )
      )}

      {/* Zoom Overlay */}
      {enableZoom && isZooming && (
        <div className="absolute inset-0 transition-opacity duration-300 pointer-events-none" />
      )}
    </div>
  );
};

export default ImageHotspot;
