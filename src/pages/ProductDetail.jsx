import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ImageHotspot from "../components/ImageHotspot";
import { useMorphTransition } from "../utils/MorphTransition";
import { Download } from "./menu/Download";
import { processHotspots } from "../utils/ResponsiveHotspot";
import {
  ZOOM_ENABLED_PRODUCTS,
  getProductTitle,
  getAvailableViews,
  getCurrentImageData,
  getMenuButtons,
} from "../utils/pages/ProductDetailHelpers";

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
  const [screenSize, setScreenSize] = useState(window.innerWidth);

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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  if (!product) return null;

  const availableViews = getAvailableViews(product);
  const currentImageData = getCurrentImageData(
    product,
    selectedView,
    processHotspots
  );

  // Handle case when selected view doesn't exist
  if (
    !availableViews.find((view) => view.key === selectedView) &&
    availableViews.length > 0
  ) {
    setSelectedView(availableViews[0].key);
  }

  const menuButtons = getMenuButtons(
    product,
    handleBackToHome,
    onNavigateToSpec,
    onNavigateToImplementation,
    handleApplicationClick,
    setIsDownloadPopupOpen
  );

  const ViewThumbnail = ({ view }) => {
    const isActive = selectedView === view.key;

    return (
      <div className="text-center p-1 flex flex-col justify-center">
        <button
          onClick={() => setSelectedView(view.key)}
          className={`w-[80px] h-[80px] md:w-auto md:h-auto rounded-lg overflow-hidden transition-all duration-200 ${
            isActive ? "border-2 border-teal-500 shadow-md scale-105" : ""
          }`}
        >
          <div className="w-full h-full p-2 flex flex-col items-center justify-center">
            <img
              src={view.src}
              alt={view.label}
              className="h-10 lg:h-24 w-full object-contain"
            />
            <p className="mt-2 lg:mt-5 text-xs lg:text-sm font-medium text-gray-600">
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
      className="flex items-center justify-center text-xs lg:text-sm gap-3 px-4 py-2 rounded-md bg-primary text-white hover:bg-teal-600 transition-colors shadow-md min-w-[140px] basis-[45%] sm:basis-auto"
      onClick={button.onClick}
    >
      <img src={button.icon} alt={button.label} className="w-5 h-5" />
      {button.label}
    </button>
  );

  return (
    <div
      className="min-h-screen flex flex-col bg-[#e7f4f3] overflow-hidden"
      style={{ height: "100dvh" }}
    >
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-[#e7f4f3] z-50 backdrop-blur-sm">
        <div className="my-4 mx-4 md:my-6 md:mx-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-full flex justify-between items-center">
              <img
                src="/logo/mjs_logo_text.png"
                alt="MJS Logo"
                className="h-7 sm:h-10 mb-3 sm:mb-0"
              />
              <button
                onClick={onBack}
                className="w-2 h-2 p-5 md:p-7 invisible flex justify-center items-center text-xs md:text-sm bg-primary rounded-full text-white"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Flex grow to fill available space */}
      <div className="flex-grow flex items-center justify-center mt-0 mx-0 md:mx-5">
        <div className="max-w-7xl mx-auto w-full">
          <div className="w-full">
            <h1 className="text-lg sm:text-2xl text-gray-600 text-center">
              {getProductTitle(product.name)}
            </h1>
          </div>
          {/* Main Content */}
          <div className="flex my-2 flex-col lg:flex-row items-center justify-center flex-grow gap-x-8 lg:gap-x-16">
            {/* Main Image */}
            <div
              className={`w-[320px] h-[220px] md:h-[280px] lg:w-[650px] lg:h-[400px] flex items-center justify-center z-[60] transition-all duration-700 ${
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
            <div className="lg:h-[400px] mt-2 lg:mt-0 flex items-center">
              <div
                className={`flex overflow-hidden gap-2 sm:gap-4 lg:grid lg:grid-cols-2 lg:gap-12 w-full max-w-[400px] transition-all duration-700 delay-200 ${
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
            className={`text-xs lg:text-sm flex flex-wrap items-center mt-0 md:mt-5 justify-center gap-2 md:gap-5 transition-all duration-700 delay-400 ${
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

      {/* Contact Info */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#e7f4f3]">
        <div className="my-6 mx-3 sm:mx-7 text-sm text-gray-600">
          <div className="flex justify-between items-center flex-wrap">
            {/* Website */}
            <div className="flex items-start gap-2 w-auto lg:mx-0">
              <img
                src="/icons/icon-web.svg"
                alt="Website"
                className="w-4 h-4"
              />
              <span className="text-xs lg:text-sm">mjsolution.co.id</span>
            </div>

            {/* Phone */}
            <div className="flex items-end gap-2 w-auto lg:mx-0">
              <img src="/icons/icon-call.svg" alt="Call" className="w-4 h-4" />
              <span className="text-xs lg:text-sm">(+62) 811-1122-492</span>
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
