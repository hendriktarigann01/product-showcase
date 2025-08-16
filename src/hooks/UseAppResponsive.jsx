import { useState, useEffect } from "react";

export const UseAppResponsive = (containerRef) => {
  const [containerDimensions, setContainerDimensions] = useState({
    width: 910,
    height: 490,
  });

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
        const availableWidth = screenWidth * 0.95;
        const availableHeight = screenHeight * 0.6;

        if (availableWidth / aspectRatio <= availableHeight) {
          newWidth = availableWidth;
          newHeight = availableWidth / aspectRatio;
        } else {
          newHeight = availableHeight;
          newWidth = availableHeight * aspectRatio;
        }
      } else if (screenWidth <= 1024) {
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
  }, [containerRef]);

  return containerDimensions;
};
