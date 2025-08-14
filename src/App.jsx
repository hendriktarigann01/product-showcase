import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import EntryPage from "./pages/EntryPage";
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import Application from "./pages/menu/Application";
import Specification from "./pages/menu/Specification";
import Implementation from "./pages/menu/Implementation";
import Download from "./pages/menu/Download";
import { MorphTransitionProvider } from "./utils/MorphTransition";
import { useNavigate } from "react-router-dom";

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [currentView, setCurrentView] = useState("home");
  const [isLED, setIsLED] = useState(false);
  const [shouldUseMorph, setShouldUseMorph] = useState(true);
  const navigate = useNavigate();

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

  // Detect if morph should be disabled
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

  const handleSelectProduct = (product, productIndex, isLEDValue) => {
    setSelectedProduct(product);
    setSelectedProductIndex(productIndex);
    setIsLED(isLEDValue);
    setCurrentView("product");
  };

  const handleBackToHome = (productIndex) => {
    if (productIndex !== undefined && productIndex !== null) {
      setSelectedProductIndex(productIndex);
    }
    setSelectedProduct(null);
    setCurrentView("home");
    navigate("/");
  };

  const handleBackToProduct = () => {
    setCurrentView("product");
    navigate("/");
  };

  const handleNavigateToSpec = () => {
    setCurrentView("spec");
  };

  const handleNavigateToImplementation = () => {
    setCurrentView("implementation");
  };

  const handleNavigateToDownload = () => {
    setCurrentView("download");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "product":
        return (
          <ProductDetail
            product={selectedProduct}
            productIndex={selectedProductIndex}
            isLED={isLED}
            onBack={handleBackToHome}
            onNavigateToSpec={handleNavigateToSpec}
            onNavigateToImplementation={handleNavigateToImplementation}
            onNavigateToDownload={handleNavigateToDownload}
          />
        );
      case "spec":
        return (
          <Specification
            product={selectedProduct}
            onBack={handleBackToProduct}
            onBackToHome={handleBackToHome}
          />
        );
      case "implementation":
        return (
          <Implementation
            product={selectedProduct}
            onBack={handleBackToProduct}
            onBackToHome={handleBackToHome}
          />
        );
      case "download":
        return (
          <Download
            product={selectedProduct}
            onBack={handleBackToProduct}
            onBackToHome={handleBackToHome}
          />
        );
      default:
        return (
          <HomePage
            onSelectProduct={handleSelectProduct}
            selectedProductIndex={selectedProductIndex}
            isLED={isLED}
            setIsLED={setIsLED}
          />
        );
    }
  };

  // Conditionally render with or without MorphTransitionProvider
  const AppContent = () => (
    <Routes>
      <Route path="/" element={renderCurrentView()} />
      <Route path="/entry" element={<EntryPage />} />
      <Route
        path="/application"
        element={
          <Application
            product={selectedProduct}
            productIndex={selectedProductIndex}
            onBack={handleBackToProduct}
          />
        }
      />
    </Routes>
  );

  // Only use MorphTransitionProvider on desktop with focused tab
  if (!shouldUseMorph) {
    return <AppContent />;
  }

  return (
    <MorphTransitionProvider>
      <AppContent />
    </MorphTransitionProvider>
  );
}

export default App;
