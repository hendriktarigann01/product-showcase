import React, { useState, useEffect } from "react";

// Morph Transition Context
const MorphTransitionContext = React.createContext();

export const MorphTransitionProvider = ({ children }) => {
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
      productIndex: options.productIndex || 0,
    });
    setIsTransitioning(true);
  };

  const endTransition = () => {
    setTimeout(() => {
      setIsTransitioning(false);
      setTransitionData(null);
    }, 100);
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
      {isTransitioning && transitionData && (
        <>
          <ColorTransitionOverlay />
          <MorphOverlay />
        </>
      )}
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

// Smooth Color Interpolation Utility
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToHex = (r, g, b) => {
  return (
    "#" +
    ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b))
      .toString(16)
      .slice(1)
  );
};

const interpolateColor = (color1, color2, factor) => {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  if (!c1 || !c2) return color1;

  const r = c1.r + (c2.r - c1.r) * factor;
  const g = c1.g + (c2.g - c1.g) * factor;
  const b = c1.b + (c2.b - c1.b) * factor;

  return rgbToHex(r, g, b);
};

// Smooth Color Transition Overlay Component
const ColorTransitionOverlay = () => {
  const { transitionData } = useMorphTransition();
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!transitionData) return;

    const { direction } = transitionData;
    const startDelay = direction === "backward" ? 100 : 150;
    const duration = direction === "backward" ? 700 : 800;

    const startTimer = setTimeout(() => {
      setIsAnimating(true);

      // Smooth animation using requestAnimationFrame
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const rawProgress = Math.min(elapsed / duration, 1);

        // Smooth easing function (ease-out-cubic)
        const easedProgress = 1 - Math.pow(1 - rawProgress, 3);

        setProgress(easedProgress);

        if (rawProgress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animate);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      setProgress(0);
      setIsAnimating(false);
    };
  }, [transitionData]);

  if (!transitionData) return null;

  const { direction } = transitionData;

  // Define colors
  const whiteColor = "#ffffff";
  const tealColor = "#e7f4f3";

  // Calculate current color based on direction and progress
  let currentColor;
  if (direction === "forward") {
    // White to teal
    currentColor = interpolateColor(whiteColor, tealColor, progress);
  } else {
    // Teal to white
    currentColor = interpolateColor(tealColor, whiteColor, progress);
  }

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998, // Below morph overlay but above content
    pointerEvents: "none",
    backgroundColor: currentColor,
  };

  return <div style={overlayStyle} />;
};

// Helper function to find active carousel image with better detection
const findActiveCarouselImage = (productIndex) => {
  // Method 1: Find by exact product index match
  const carouselImages = document.querySelectorAll(
    '[data-carousel-image="true"]'
  );

  for (let img of carouselImages) {
    const imgIndex = parseInt(img.dataset.carouselIndex);
    if (imgIndex === productIndex) {
      const rect = img.getBoundingClientRect();
      // Check if this image is reasonably visible and positioned
      if (rect.width > 100 && rect.height > 100) {
        return rect;
      }
    }
  }

  // Method 2: Find the most centered image (active carousel item)
  let bestCandidate = null;
  let bestScore = Infinity;

  for (let img of carouselImages) {
    const rect = img.getBoundingClientRect();

    // Skip if image is too small or not visible
    if (rect.width < 100 || rect.height < 100) continue;

    // Calculate distance from center of screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const imgCenterX = rect.left + rect.width / 2;
    const imgCenterY = rect.top + rect.height / 2;

    const distanceFromCenter = Math.sqrt(
      Math.pow(imgCenterX - centerX, 2) + Math.pow(imgCenterY - centerY, 2)
    );

    // Consider size as well - larger images are more likely to be active
    const sizeScore = rect.width * rect.height;
    const finalScore = distanceFromCenter - sizeScore / 10000; // Bigger images get lower score

    if (finalScore < bestScore) {
      bestScore = finalScore;
      bestCandidate = rect;
    }
  }

  return bestCandidate;
};

// Calculate target position with better accuracy for Application pages
const calculateTargetPosition = (direction, productIndex) => {
  if (direction === "backward") {
    // Try to find the actual active image first for Application page
    const targetRect = findActiveCarouselImage(productIndex);
    if (targetRect) {
      return targetRect;
    }

    // Fallback calculation for Application page layout
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Account for header and Application page specific positioning
    const headerHeight = 128; // pt-32 = 8rem = 128px
    const availableHeight = window.innerHeight - headerHeight - 96; // pb-24 = 96px
    const applicationCenterY = headerHeight + availableHeight / 2;

    // Application page has a specific container size (900px x 500px)
    const containerWidth = 900;
    const containerHeight = 500;

    // Calculate position based on productIndex for Application layout
    let targetLeft, targetTop, targetWidth, targetHeight;

    switch (productIndex) {
      case 0: // Smart Learning Class
        targetWidth = containerWidth * 0.6; // 60% width
        targetHeight = containerHeight * 0.8; // 80% height
        targetLeft = centerX - containerWidth / 2 + containerWidth * 0.05; // 5% from left
        targetTop =
          applicationCenterY -
          containerHeight / 2 +
          containerHeight * 0.8 -
          targetHeight; // bottom 5%
        break;
      case 1: // Smart Meeting Room
        targetWidth = containerWidth * 0.55; // 55% width
        targetHeight = containerHeight * 0.75; // 75% height
        targetLeft = centerX - containerWidth / 2 + containerWidth * 0.25; // 25% from left
        targetTop =
          applicationCenterY - containerHeight / 2 + containerHeight * 0.05; // top 5%
        break;
      case 2: // Smart Conference Room
        targetWidth = containerWidth * 0.55; // 55% width
        targetHeight = containerHeight * 0.75; // 75% height
        targetLeft =
          centerX + containerWidth / 2 - containerWidth * 0.05 - targetWidth; // right 5%
        targetTop =
          applicationCenterY - containerHeight / 2 + containerHeight * 0.2; // top 20%
        break;
      default:
        targetWidth = 352;
        targetHeight = 300;
        targetLeft = centerX - 176;
        targetTop = applicationCenterY - 150;
    }

    return {
      left: targetLeft,
      top: targetTop,
      width: targetWidth,
      height: targetHeight,
    };
  } else {
    // Going to detail page - more precise positioning
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Account for header in detail page
    const headerHeight = 128; // pt-32
    const availableHeight = window.innerHeight - headerHeight - 96; // pb-24 = 96px
    const detailCenterY = headerHeight + availableHeight / 2;

    return {
      left: centerX - 530, // Adjust for detail image size
      top: detailCenterY - 210, // 420/2 = 210
      width: 650, // Larger width for detail view
      height: 420,
    };
  }
};

// Enhanced Morph Overlay Component
const MorphOverlay = () => {
  const { transitionData } = useMorphTransition();
  const [phase, setPhase] = useState("start");
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (transitionData?.direction === "backward") {
      // For backward transition, wait longer to ensure carousel is positioned correctly
      const startTimer = setTimeout(() => {
        setPhase("transition");
      }, 200); // Longer delay for backward transition

      const fadeTimer = setTimeout(() => {
        setOpacity(0);
      }, 700); // Start fading later for smoother effect

      return () => {
        clearTimeout(startTimer);
        clearTimeout(fadeTimer);
      };
    } else {
      // Forward transition - start immediately
      const startTimer = setTimeout(() => {
        setPhase("transition");
      }, 50);

      return () => clearTimeout(startTimer);
    }
  }, [transitionData]);

  if (!transitionData) return null;

  const { startRect, endRect, startImage, endImage, direction, productIndex } =
    transitionData;

  // Calculate target position with retry for backward direction
  let targetRect = endRect;
  if (!targetRect) {
    if (direction === "backward") {
      // Try to find target again after a short delay for better accuracy
      setTimeout(() => {
        const retryRect = findActiveCarouselImage(productIndex);
        if (retryRect) {
          targetRect = retryRect;
        }
      }, 100);
    }
    targetRect = targetRect || calculateTargetPosition(direction, productIndex);
  }

  // Enhanced easing for smoother transition
  const getTransitionStyle = () => {
    const baseStyle = {
      position: "fixed",
      zIndex: 9999, // Above color overlay
      overflow: "hidden",
      pointerEvents: "none",
      borderRadius: direction === "backward" ? "12px" : "8px",
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

    // Transition phase with enhanced easing
    return {
      ...baseStyle,
      top: targetRect.top,
      left: targetRect.left,
      width: targetRect.width,
      height: targetRect.height,
      opacity: direction === "backward" ? opacity : 1,
      transform:
        direction === "backward" ? `scale(${opacity * 0.9 + 0.1})` : "scale(1)",
      transition:
        direction === "backward"
          ? "all 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s ease-out, transform 0.5s ease-out"
          : "all 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
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
          opacity: phase === "transition" && endImage !== startImage ? 1 : 1,
        }}
      />
    </div>
  );
};
