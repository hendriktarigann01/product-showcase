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

  const getCardPosition = (hotspot) => ({
    left: hotspot.x > 70 ? "auto" : `${hotspot.x + 3}%`,
    right: hotspot.x > 70 ? `${100 - hotspot.x + 3}%` : "auto",
    top: hotspot.y > 60 ? "auto" : `${hotspot.y + 5}%`,
    bottom: hotspot.y > 60 ? `${100 - hotspot.y + 5}%` : "auto",
  });

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

  const HotspotButton = ({ hotspot }) => (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
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

  const InfoCard = ({ hotspot }) => (
    <div
      className="absolute z-50 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 animate-in fade-in-0 slide-in-from-top-4 duration-300"
      style={getCardPosition(hotspot)}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={closeHotspot}
        className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-white transition-colors rounded-full bg-primary z-10 hover:bg-teal-700"
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
          <div className="w-full rounded-lg mb-4 flex items-center justify-center overflow-hidden bg-gray-50">
            <img
              src={hotspot.img}
              alt={hotspot.title}
              className="w-full max-h-32 object-contain"
            />
          </div>
        )}
        <h3 className="text-sm text-center font-semibold text-gray-600 mb-2 leading-tight">
          {hotspot.title}
        </h3>
        <p className="text-gray-600 text-xs font-thin leading-tight text-center">
          {hotspot.sub_title}
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-full" onClick={handleBackgroundClick}>
      {/* Main Image */}
      <div className="w-full h-[420px] flex items-center justify-center overflow-hidden">
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
