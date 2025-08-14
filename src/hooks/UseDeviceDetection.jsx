import { useState, useEffect } from "react";

export const UseDeviceDetection = () => {
  const [shouldUseMorph, setShouldUseMorph] = useState(true);

  // Improved device detection
  const detectDevice = () => {
    const userAgent = navigator.userAgent;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Detect mobile devices
    const isMobile =
      width <= 768 ||
      /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );

    // Enhanced iPad/tablet detection
    const isTablet =
      // Size-based detection for tablets
      (width > 768 && width <= 1023) ||
      (height > 768 && height <= 1023) ||
      // User agent detection
      /iPad|Tablet|PlayBook|Silk/i.test(userAgent) ||
      // Modern iPad detection (iPadOS reports as Mac)
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
      // Additional iPad detection
      (userAgent.includes("Mac") && "ontouchend" in document);

    return { isMobile, isTablet };
  };

  useEffect(() => {
    const checkShouldUseMorph = () => {
      const { isMobile, isTablet } = detectDevice();
      const isTabFocused = !document.hidden;
      setShouldUseMorph(!isMobile && !isTablet && isTabFocused);
    };

    const handleVisibilityChange = () => {
      const { isMobile, isTablet } = detectDevice();
      setShouldUseMorph(!isMobile && !isTablet && !document.hidden);
    };

    const handleResize = () => {
      const { isMobile, isTablet } = detectDevice();
      setShouldUseMorph(!isMobile && !isTablet && !document.hidden);
    };

    checkShouldUseMorph();
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return shouldUseMorph;
};
