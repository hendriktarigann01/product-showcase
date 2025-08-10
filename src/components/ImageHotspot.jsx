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

        <div className="p-3">
          {hotspot.img && (
            <div className="w-full aspect-[16/9] flex items-center justify-center overflow-hidden mb-2">
              <img
                src={hotspot.img}
                alt={hotspot.title}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <h3 className="mb-1 text-sm text-center font-semibold text-gray-600 leading-tight">
            {hotspot.title}
          </h3>
          <p className="text-gray-600 text-xs font-light leading-none text-center">
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
      <div className="w-full h-[250px] md:h-[400px] flex items-center justify-center overflow-hidden">
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
