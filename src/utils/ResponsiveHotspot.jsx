import { useState, useEffect } from "react";

/**
 * Get responsive coordinates based on screen size
 * @param {Object} hotspot - Hotspot object containing coordinates
 * @param {number} hotspot.x - Desktop x coordinate
 * @param {number} hotspot.y - Desktop y coordinate
 * @param {number} [hotspot.x_hp] - Mobile x coordinate
 * @param {number} [hotspot.y_hp] - Mobile y coordinate
 * @param {number} [hotspot.x_tab] - Tablet x coordinate
 * @param {number} [hotspot.y_tab] - Tablet y coordinate
 * @returns {Object} Object with x and y coordinates
 */
export const getResponsiveCoordinates = (hotspot) => {
  // Detect screen size using window width
  const screenWidth = window.innerWidth;

  // Mobile: < 768px
  if (screenWidth < 768) {
    return {
      x: hotspot.x_hp !== undefined ? hotspot.x_hp : hotspot.x,
      y: hotspot.y_hp !== undefined ? hotspot.y_hp : hotspot.y,
    };
  }
  // Tablet: 768px - 1023px
  else if (screenWidth >= 768 && screenWidth < 1024) {
    return {
      x: hotspot.x_tab !== undefined ? hotspot.x_tab : hotspot.x,
      y: hotspot.y_tab !== undefined ? hotspot.y_tab : hotspot.y,
    };
  }

  // Desktop: >= 1024px
  else {
    return {
      x: hotspot.x,
      y: hotspot.y,
    };
  }
};

/**
 * Process hotspots array with responsive positioning
 * @param {Array} hotspots - Array of hotspot objects
 * @returns {Array} Processed hotspots with responsive coordinates
 */
export const processHotspots = (hotspots) => {
  if (!hotspots || !Array.isArray(hotspots)) return [];

  return hotspots.map((hotspot) => {
    const coordinates = getResponsiveCoordinates(hotspot);
    return {
      ...hotspot,
      x: coordinates.x,
      y: coordinates.y,
    };
  });
};

/**
 * Hook for responsive hotspot handling
 * @param {Array} hotspots - Array of hotspot objects
 * @returns {Array} Processed hotspots that update on window resize
 */
export const useResponsiveHotspots = (hotspots) => {
  const [processedHotspots, setProcessedHotspots] = useState([]);

  useEffect(() => {
    const updateHotspots = () => {
      setProcessedHotspots(processHotspots(hotspots));
    };

    // Initial processing
    updateHotspots();

    // Update on window resize
    window.addEventListener("resize", updateHotspots);

    return () => {
      window.removeEventListener("resize", updateHotspots);
    };
  }, [hotspots]);

  return processedHotspots;
};
