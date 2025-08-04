import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ImageHotspot from "../components/ImageHotspot";
import { useMorphTransition } from "../utils/MorphTransition";
import { Download } from "./menu/Download";

// Configuration
const PRODUCT_TITLES = {
  "KMI 7000": "Interactive Whiteboard KMI 7000 Series",
  "KMI 8000": "Video Wall KMI 8000",
  "KMI 2000": "Digital Signage KMI 2000 Series",
  "KMI 2300": "Digital Signage KMI 2300",
  "KMI 4100": "Infrared Touch Inquiry Kiosk KMI 4100 & 4200",
};

const ZOOM_ENABLED_PRODUCTS = [
  "Digital Signage KMI 2000 Series",
  "Digital Signage KMI 2300",
  "LED Poster Display",
];

const PRODUCTS_WITHOUT_IMPLEMENTATION = [
  "Digital Signage KMI 2000 Series",
  "Digital Signage KMI 2300",
  "LED Outdoor for Fixed Installation",
  "LED Indoor for Fixed Installation",
  "LED Poster Display",
];

function ProductDetail({
  product,
  productIndex = 0,
  onBack,
  onNavigateToSpec,
  onNavigateToImplementation,
}) {
  const [selectedView, setSelectedView] = useState("front");
  const [isVisible, setIsVisible] = useState(false);
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);

  const navigate = useNavigate();
  const { endTransition, isTransitioning, startTransition } =
    useMorphTransition();
  const mainImageRef = useRef(null);

  useEffect(() => {
    const delay = isTransitioning ? 900 : 0;
    setTimeout(() => {
      if (isTransitioning) endTransition();
      setIsVisible(true);
    }, delay);
  }, [isTransitioning, endTransition]);

  const handleBackToHome = () => {
    if (mainImageRef.current && startTransition) {
      const imageElement = mainImageRef.current.querySelector("img");

      if (imageElement) {
        startTransition(imageElement, null, {
          startImage: product.image_detail,
          endImage: product.image_detail,
          direction: "backward",
          productIndex: productIndex,
        });
        setTimeout(() => onBack(), 150);
      } else {
        onBack();
      }
    } else {
      onBack();
    }
  };

  const handleApplicationClick = () => {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    localStorage.setItem("selectedProductIndex", productIndex);
    navigate("/application");
  };

  const getProductTitle = (productName) => {
    return PRODUCT_TITLES[productName] || productName;
  };

  const getAvailableViews = () => {
    const viewKeys = ["front", "left", "right", "side", "back"];
    const viewLabels = {
      front: "Front View",
      left: "Left View",
      right: "Right View",
      side: "Side View",
      back: "Back View",
    };

    return viewKeys
      .filter((key) => product.images?.[key])
      .map((key) => ({
        key,
        label: viewLabels[key],
        src: product.images[key],
      }));
  };

  const getCurrentImageData = () => {
    const availableViews = getAvailableViews();
    console.log("availableViews:", availableViews);
    const currentView = availableViews.find(
      (view) => view.key === selectedView
    );

    if (!currentView && availableViews.length > 0) {
      setSelectedView(availableViews[0].key);
      return { src: availableViews[0].src, hotspots: [] };
    }

    if (!currentView) return { src: "", hotspots: [] };

    const hotspots =
      selectedView === "front"
        ? product.hotspots || []
        : selectedView === "back"
        ? product.back_hotspots || []
        : selectedView === "side"
        ? product.side_hotspots || []
        : [];
    productIndex;

    return { src: currentView.src, hotspots };
  };

  const getMenuButtons = () => {
    const baseButtons = [
      {
        id: "product",
        label: "Homepage",
        icon: "/icons/icon-home.svg",
        onClick: handleBackToHome,
      },
      {
        id: "spec",
        label: "Specification",
        icon: "/icons/icon-specification.svg",
        onClick: onNavigateToSpec,
      },
    ];

    const implementationButton = {
      id: "implementation",
      label: "Implementation",
      icon: "/icons/icon-implementation.svg",
      onClick: onNavigateToImplementation,
    };

    const endButtons = [
      {
        id: "applications",
        label: "Applications",
        icon: "/icons/icon-application.svg",
        onClick: handleApplicationClick,
      },
      {
        id: "download",
        label: "Download PDF",
        icon: "/icons/icon-download.svg",
        onClick: () => setIsDownloadPopupOpen(true),
      },
    ];

    return PRODUCTS_WITHOUT_IMPLEMENTATION.includes(product.name)
      ? [...baseButtons, ...endButtons]
      : [...baseButtons, implementationButton, ...endButtons];
  };

  if (!product) return null;

  const availableViews = getAvailableViews();
  const currentImageData = getCurrentImageData();
  const menuButtons = getMenuButtons();

  const ViewThumbnail = ({ view }) => {
    const isActive = selectedView === view.key;

    return (
      <div className="text-center h-[100px] lg:h-[150px] flex flex-col justify-center">
        <button
          onClick={() => setSelectedView(view.key)}
          className={`w-full h-full rounded-lg overflow-hidden transition-all duration-200 ${
            isActive ? "border-2 border-teal-500 shadow-md scale-105" : ""
          }`}
        >
          <div className="w-full h-full p-2 flex flex-col items-center justify-center">
            <img
              src={view.src}
              alt={view.label}
              className="h-24 w-full object-contain"
            />
            <p className="mt-5 text-xs lg:text-sm font-medium text-gray-600">
              {view.label}
            </p>
          </div>
        </button>
      </div>
    );
  };

  const MenuButton = ({ button }) => (
    <button
      key={button.id}
      className="flex items-center justify-center gap-2 w-44 px-4 py-2 rounded-md bg-primary text-white hover:bg-teal-600 transition-colors shadow-md"
      onClick={button.onClick}
    >
      <img src={button.icon} alt={button.label} className="w-5 h-5" />
      {button.label}
    </button>
  );

  return (
    <div className="h-screen">
      {/* Header - Embedded */}
      <div className="fixed top-0 left-0 right-0 bg-[#e7f4f3] backdrop-blur-sm">
        <div className="my-6 mx-7">
          <div className="flex flex-col items-center text-center">
            <div className="w-full flex justify-between items-center">
              <img
                src="/logo/mjs_logo_text.png"
                alt="MJS Logo"
                className="h-10"
              />
            </div>

            <div className="w-full">
              <h1 className="text-2xl font-medium text-gray-600 text-center">
                {getProductTitle(product.name)}
              </h1>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-20 bg-[#e7f4f3] px-4 z-50">
        <div className="max-w-7xl mx-auto flex flex-col justify-between">
          {/* Main Content */}
          <div className="flex my-8 flex-col lg:flex-row items-center justify-center flex-grow gap-8 lg:gap-16">
            {/* Main Image */}
            <div
              className={`w-[320px] h-[220px] lg:w-[650px] lg:h-[420px] flex items-center justify-center transition-all duration-700 ${
                isVisible
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-5"
              }`}
            >
              <div ref={mainImageRef} className="w-full h-full">
                <ImageHotspot
                  imageSrc={currentImageData.src}
                  hotspots={currentImageData.hotspots}
                  productName={product.name}
                  enableZoom={ZOOM_ENABLED_PRODUCTS.includes(product.name)}
                />
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="h-[220px] lg:h-[420px] flex items-center">
              <div
                className={`grid grid-cols-2 gap-14 w-[280px] lg:w-[320px] transition-all duration-700 delay-200 ${
                  isVisible
                    ? "opacity-100 transform translate-x-0"
                    : "opacity-0 transform translate-x-10"
                }`}
              >
                {availableViews.map((view) => (
                  <ViewThumbnail key={view.key} view={view} />
                ))}
              </div>
            </div>
          </div>

          {/* Menu Buttons */}
          <div
            className={`flex flex-wrap items-center justify-center gap-5 transition-all duration-700 delay-400 ${
              isVisible
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-5"
            }`}
          >
            {menuButtons.map((button) => (
              <MenuButton key={button.id} button={button} />
            ))}
          </div>
        </div>
      </div>
      {/* Contact Info - Embedded */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#e7f4f3] z-50">
        <div className="my-7 mx-7">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <img
                src="/icons/icon-web.svg"
                alt="Website"
                className="w-4 h-4"
              />
              <span>mjsolution.co.id</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/icons/icon-call.svg" alt="Call" className="w-4 h-4" />
              <span>(+62) 811-1122-492</span>
            </div>
          </div>
        </div>
      </div>
      <Download
        isOpen={isDownloadPopupOpen}
        onClose={() => setIsDownloadPopupOpen(false)}
        product={product}
      />
    </div>
  );
}

export default ProductDetail;
