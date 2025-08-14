// App.jsx - Simplified version
import React from "react";
import { Routes, Route } from "react-router-dom";

import EntryPage from "./pages/EntryPage";
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import Application from "./pages/menu/Application";
import Specification from "./pages/menu/Specification";
import Implementation from "./pages/menu/Implementation";
import { MorphTransitionProvider } from "./utils/MorphTransition";
import { UseDeviceDetection } from "./hooks/UseDeviceDetection";
import { ProductService } from "./services/ProductService";

function App() {
  const shouldUseMorph = UseDeviceDetection();

  // Helper function to create routes dynamically
  const createProductRoutes = (isLED) => {
    const slugs = isLED
      ? ["led-outdoor", "led-indoor", "led-poster"]
      : [
          "kmi-7000-series",
          "kmi-8000",
          "kmi-2000-series",
          "kmi-2300-series",
          "kmi-4100-and-4200",
        ];

    const basePath = isLED ? "/led-display" : "/lcd-display";

    return slugs.flatMap((slug) => {
      const productData = ProductService.getProductBySlug(slug, isLED);

      return [
        <Route
          key={`${basePath}/${slug}`}
          path={`${basePath}/${slug}`}
          element={<ProductDetail {...productData} isLED={isLED} />}
        />,
        <Route
          key={`${basePath}/${slug}/specification`}
          path={`${basePath}/${slug}/specification`}
          element={<Specification product={productData.product} />}
        />,
        <Route
          key={`${basePath}/${slug}/implementation`}
          path={`${basePath}/${slug}/implementation`}
          element={<Implementation product={productData.product} />}
        />,
        <Route
          key={`${basePath}/${slug}/application`}
          path={`${basePath}/${slug}/application`}
          element={<Application {...productData} />}
        />,
      ];
    });
  };

  const AppContent = () => (
    <Routes>
      {/* Entry Page */}
      <Route path="/" element={<EntryPage />} />

      {/* Home Pages */}
      <Route path="/lcd-display" element={<HomePage isLED={false} />} />
      <Route path="/led-display" element={<HomePage isLED={true} />} />

      {/* LCD Display Routes */}
      {createProductRoutes(false)}

      {/* LED Display Routes */}
      {createProductRoutes(true)}
    </Routes>
  );

  // Conditionally render with or without MorphTransitionProvider
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
