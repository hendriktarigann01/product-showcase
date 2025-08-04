import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

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
  const navigate = useNavigate();
  const [isLED, setIsLED] = useState(false);

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
    navigate("/"); // Navigate back to main app
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

  return (
    <MorphTransitionProvider>
      <Routes>
        <Route path="/" element={renderCurrentView()} />
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
    </MorphTransitionProvider>
  );
}

export default App;
