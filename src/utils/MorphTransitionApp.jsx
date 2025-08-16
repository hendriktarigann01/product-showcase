import React, { useState, useEffect } from "react";

// Morph Transition Context
const MorphTransitionContext = React.createContext();

export const MorphTransitionApp = ({ children }) => {
  const [transitionData, setTransitionData] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = (fromElement, toElement, options = {}) => {
    if (!fromElement) return;

    const fromRect = fromElement.getBoundingClientRect();
    let toRect = null;

    // If toElement is provided, get its position
    if (toElement) {
      // If toElement contains an image, try to get the image element
      const imgElement = toElement.querySelector("img") || toElement;
      toRect = imgElement.getBoundingClientRect();
    }

    setTransitionData({
      startRect: fromRect,
      endRect: toRect,
      startImage: options.startImage || fromElement.src,
      endImage: options.endImage || fromElement.src,
      direction: options.direction || "forward",
      appId: options.appId || null,
      selectedApp: options.selectedApp || null,
    });
    setIsTransitioning(true);
  };

  const endTransition = () => {
    setTimeout(() => {
      setIsTransitioning(false);
      setTransitionData(null);
    }, 50);
  };

  return (
    <MorphTransitionContext.Provider
      value={{
        transitionData,
        isTransitioning,
        startTransition,
        endTransition,
      }}
    >
      {children}
      {isTransitioning && transitionData && <MorphOverlay />}
    </MorphTransitionContext.Provider>
  );
};

export const useMorphTransition = () => {
  const context = React.useContext(MorphTransitionContext);
  if (!context) {
    return {
      transitionData: null,
      isTransitioning: false,
      startTransition: () => {},
      endTransition: () => {},
    };
  }
  return context;
};

// Helper function to find target image in DetailApplication
const findDetailApplicationTarget = () => {
  // Look for the detail image container
  const detailContainer = document.querySelector('[data-detail-image="true"]');
  if (detailContainer) {
    const imgElement = detailContainer.querySelector("img");
    if (imgElement) {
      return imgElement.getBoundingClientRect();
    }
  }

  // Fallback: calculate expected position for detail page
  const centerX = window.innerWidth / 2;
  const headerHeight = 128; // pt-32
  const availableHeight = window.innerHeight - headerHeight - 96; // pb-24
  const detailCenterY = headerHeight + availableHeight / 2;

  return {
    left: centerX * 0.25, // Left side of the detail layout (25% from left)
    top: detailCenterY - 200, // Center vertically in available space
    width: centerX * 0.4, // 40% of screen width (matches max-w-2xl)
    height: 400, // max-h-[400px]
  };
};

// Calculate target position based on direction
const calculateTargetPosition = (direction, appId) => {
  if (direction === "backward") {
    // Try to find the actual hotspot position for backward transition
    const hotspotElement = document.querySelector(
      `[data-hotspot-id="${appId}"]`
    );
    if (hotspotElement) {
      const rect = hotspotElement.getBoundingClientRect();
      // Get the button inside the hotspot for more precise positioning
      const button = hotspotElement.querySelector("button");
      if (button) {
        const buttonRect = button.getBoundingClientRect();
        return {
          left: buttonRect.left,
          top: buttonRect.top,
          width: buttonRect.width,
          height: buttonRect.height,
        };
      }
      return rect;
    }

    // Fallback: approximate hotspot position in center of application area
    const centerX = window.innerWidth / 2;
    const headerHeight = 128;
    const availableHeight = window.innerHeight - headerHeight - 96;
    const applicationCenterY = headerHeight + availableHeight / 2;

    // Return to small hotspot size
    return {
      left: centerX - 8, // Small hotspot size (w-4 = 16px)
      top: applicationCenterY - 8,
      width: 16,
      height: 16,
    };
  } else {
    // Going to detail page
    return findDetailApplicationTarget();
  }
};

// Enhanced Morph Overlay Component
const MorphOverlay = () => {
  const { transitionData } = useMorphTransition();
  const [phase, setPhase] = useState("start");
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (transitionData?.direction === "backward") {
      // For backward transition, start immediately but fade out
      const startTimer = setTimeout(() => {
        setPhase("transition");
      }, 20);

      const fadeTimer = setTimeout(() => {
        setOpacity(0);
      }, 200);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(fadeTimer);
      };
    } else {
      // Forward transition - start and complete normally
      const startTimer = setTimeout(() => {
        setPhase("transition");
      }, 20);

      const endTimer = setTimeout(() => {
        setOpacity(0);
      }, 300);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(endTimer);
      };
    }
  }, [transitionData]);

  if (!transitionData) return null;

  const { startRect, endRect, startImage, endImage, direction, appId } =
    transitionData;

  // Calculate target position
  let targetRect = endRect;
  if (!targetRect) {
    targetRect = calculateTargetPosition(direction, appId);
  }

  // Get transition style based on phase
  const getTransitionStyle = () => {
    const baseStyle = {
      position: "fixed",
      zIndex: 9999,
      overflow: "hidden",
      pointerEvents: "none",
      borderRadius: direction === "backward" ? "50%" : "8px", // Round for hotspot, square for detail
    };

    if (phase === "start") {
      return {
        ...baseStyle,
        top: startRect.top,
        left: startRect.left,
        width: startRect.width,
        height: startRect.height,
        opacity: 1,
        transform: "scale(1)",
        transition: "none",
      };
    }

    // Transition phase
    return {
      ...baseStyle,
      top: targetRect.top,
      left: targetRect.left,
      width: targetRect.width,
      height: targetRect.height,
      opacity: opacity,
      transform:
        direction === "backward" ? `scale(${opacity * 0.8 + 0.2})` : "scale(1)",
      transition:
        direction === "backward"
          ? "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.2s ease-out"
          : "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    };
  };

  return (
    <div style={getTransitionStyle()}>
      <img
        src={
          phase === "transition" && endImage !== startImage
            ? endImage
            : startImage
        }
        alt="Transitioning"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transition: "opacity 0.3s ease-in-out",
        }}
      />
    </div>
  );
};
