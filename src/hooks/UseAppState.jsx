import { useState, useEffect } from "react";

export const UseAppState = (propProduct, propIndex) => {
  const [product, setProduct] = useState(propProduct);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedAppId, setSelectedAppId] = useState(null);

  useEffect(() => {
    if (!propProduct) {
      // Try to get from localStorage as fallback
      const savedProduct = localStorage.getItem("selectedProduct");
      if (savedProduct) {
        setProduct(JSON.parse(savedProduct));
      }
    }
  }, [propProduct, propIndex]);

  return {
    product,
    setProduct,
    selectedApp,
    setSelectedApp,
    selectedAppId,
    setSelectedAppId,
  };
};
