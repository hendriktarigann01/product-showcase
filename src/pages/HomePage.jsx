import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { products } from "../data/product";
import { products_led } from "../data/product_led";
import { useMorphTransition } from "../utils/MorphTransition";
import { UseCarousel } from "../hooks/UseCarousel";
import { Carousel3D } from "../components/Carousel3D";
import { UseLockScroll } from "../hooks/UseLockScroll";

// Helper function to get product slug from name
const getProductSlug = (productName) => {
  const nameToSlug = {
    // LCD Products
    "Interactive Whiteboard KMI 7000 Series": "kmi-7000-series",
    "Video Wall KMI 8000": "kmi-8000",
    "Digital Signage KMI 2000 Series": "kmi-2000-series",
    "Digital Signage KMI 2300": "kmi-2300-series",
    "Digital Kiosk Signage KMI 4100 & 4200": "kmi-4100-and-4200",
    // LED Products
    "LED Outdoor for Fixed Installation": "led-outdoor",
    "LED Indoor for Fixed Installation": "led-indoor",
    "LED Poster Display": "led-poster",
  };

  return (
    nameToSlug[productName] || productName.toLowerCase().replace(/\s+/g, "-")
  );
};

function HomePage({ isLED = false }) {
  const { startTransition, endTransition, isTransitioning } =
    useMorphTransition();
  const imageRefs = useRef({});
  const navigate = useNavigate();
  const location = useLocation();

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const carouselRef = useRef(null);

  const selectedProducts = isLED ? products_led : products;

  const {
    currentIndex,
    carouselVisible,
    nextSlide,
    prevSlide,
    goToIndex,
    showCarousel,
    hideCarousel,
  } = UseCarousel(selectedProducts.length, 0);

  useEffect(() => {
    if (isTransitioning) {
      hideCarousel();
      setTimeout(() => {
        endTransition();
        setTimeout(() => {
          showCarousel();
        }, 220);
      }, 900);
    } else {
      showCarousel();
    }
  }, [isTransitioning, endTransition, showCarousel, hideCarousel]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const selectedSlug = searchParams.get("selected");

    if (selectedSlug) {
      const slugToName = {
        "kmi-7000-series": "Interactive Whiteboard KMI 7000 Series",
        "kmi-8000": "Video Wall KMI 8000",
        "kmi-2000-series": "Digital Signage KMI 2000 Series",
        "kmi-2300-series": "Digital Signage KMI 2300",
        "kmi-4100-and-4200": "Digital Kiosk Signage KMI 4100 & 4200",
        "led-outdoor": "LED Outdoor for Fixed Installation",
        "led-indoor": "LED Indoor for Fixed Installation",
        "led-poster": "LED Poster Display",
      };

      const productName = slugToName[selectedSlug];
      const productIndex = selectedProducts.findIndex(
        (p) => p.name === productName
      );

      if (productIndex !== -1) {
        goToIndex(productIndex);
        const newUrl = isLED ? "/led-display" : "/lcd-display";
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, [location.search, selectedProducts, isLED, goToIndex]);

  UseLockScroll();

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && carouselVisible) {
      nextSlide();
    }
    if (isRightSwipe && carouselVisible) {
      prevSlide();
    }
  };

  const handleSelectProduct = (product, imageElement) => {
    const productIndex = selectedProducts.findIndex(
      (p) => p.name === product.name
    );

    if (productIndex === -1) {
      console.warn("Produk tidak ditemukan dalam selectedProducts");
      return;
    }

    const productSlug = getProductSlug(product.name);
    const basePath = isLED ? "/led-display" : "/lcd-display";
    const targetPath = `${basePath}/${productSlug}`;

    console.log("Navigating to:", targetPath);
    console.log("Product:", product.name);
    console.log("Slug:", productSlug);

    if (imageElement && startTransition) {
      startTransition(imageElement, null, {
        startImage: product.image,
        endImage: product.images?.front,
        direction: "forward",
        productIndex,
      });

      setTimeout(() => {
        navigate(targetPath);
      }, 150);
    } else {
      navigate(targetPath);
    }
  };

  const handleImageClick = (product, index) => {
    // Hanya gambar yang di tengah (currentIndex) yang bisa diklik
    if (index === currentIndex) {
      const imageElement = imageRefs.current[index] || null;
      handleSelectProduct(product, imageElement);
    }
  };

  const slides = selectedProducts.map((product, index) => ({
    key: index,
    content: (
      <div className="h-full flex flex-col">
        <div className="flex-1 p-2 flex items-center justify-center">
          <img
            ref={(el) => {
              if (el) imageRefs.current[index] = el;
            }}
            src={product.image}
            alt={product.name}
            className={`w-full max-h-full object-contain transition-all duration-300 ${
              index === currentIndex ? "cursor-pointer" : "cursor-default"
            }`}
            data-carousel-image="true"
            data-carousel-index={index}
            style={{
              opacity: carouselVisible ? 1 : 0,
              transform: carouselVisible ? "scale(1)" : "scale(0.4)",
            }}
            onClick={() => handleImageClick(product, index)}
          />
        </div>
        <div className="p-4 bg-transparent rounded-b-2xl">
          <div className="w-full h-10"></div>
        </div>
      </div>
    ),
  }));

  const handleToggleDisplay = () => {
    const newPath = isLED ? "/lcd-display" : "/led-display";
    navigate(newPath);
  };

  return (
    <div
      className="flex flex-col bg-white overflow-hidden"
      style={{ height: "100dvh" }}
    >
      {/* Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 bg-white backdrop-blur-sm z-50">
        <div className="my-6 mx-3 sm:mx-7">
          <div className="flex flex-col items-center text-center">
            <div className="w-full flex items-start">
              <img
                src="/logo/mjs_logo_text.png"
                alt="MJS Logo"
                className="h-7 sm:h-10 mb-3 sm:mb-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Flex grow to fill available space */}
      <div className="flex-grow flex md:items-center md:justify-center px-8 mb-0 lg:mb-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="w-full relative z-50 mt-14 lg:mt-0">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-600 text-center">
              Our Product
            </h1>
            <p
              key={currentIndex}
              className="text-gray-600 text-sm sm:text-lg text-center animate-fade-in-up"
            >
              {selectedProducts[currentIndex]?.name || ""}
            </p>
          </div>

          {/* Background Circle */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-80 h-80 rounded-full border-[6px] border-[#e7f4f3] flex items-center justify-center transition-opacity duration-500"
                style={{ opacity: carouselVisible ? 1 : 0.3 }}
              >
                <div className="w-56 h-56 rounded-full bg-[#e7f4f3]"></div>
              </div>
            </div>

            {/* Carousel with touch handlers */}
            <div
              ref={carouselRef}
              className="transition-all duration-500"
              style={{
                opacity: carouselVisible ? 1 : 0,
                transform: carouselVisible
                  ? "translateY(0)"
                  : "translateY(20px)",
              }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <Carousel3D
                slides={slides}
                currentIndex={currentIndex}
                variant="home"
              />
            </div>

            {/* Select Button - centered below carousel */}
            <div className="absolute bottom-[-100px] lg:bottom-[-30px] left-1/2 transform -translate-x-1/2 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentProduct = selectedProducts[currentIndex];
                  const imageElement = imageRefs.current[currentIndex] || null;
                  handleSelectProduct(currentProduct, imageElement);
                }}
                className={`bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg transition-all duration-300 font-medium flex items-center justify-center gap-2 ${
                  carouselVisible
                    ? "opacity-100 scale-100"
                    : "opacity-50 scale-95"
                }`}
                disabled={!carouselVisible}
              >
                Select
                <span>
                  <ArrowUpRight size={18} />
                </span>
              </button>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className={`absolute left-0 sm:left-20 md:left-40 lg:left-80 top-[115%] lg:top-full transform -translate-y-1/2 w-12 h-12 bg-teal-500 hover:bg-teal-600 text-white rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                carouselVisible
                  ? "opacity-100 scale-100"
                  : "opacity-50 scale-95"
              }`}
              disabled={!carouselVisible}
            >
              <ChevronLeft size={24} className="mr-1" />
            </button>

            <button
              onClick={nextSlide}
              className={`absolute right-0 sm:right-20 md:right-40 lg:right-80 top-[115%] lg:top-full transform -translate-y-1/2 w-12 h-12 bg-teal-500 hover:bg-teal-600 text-white rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                carouselVisible
                  ? "opacity-100 scale-100"
                  : "opacity-50 scale-95"
              }`}
              disabled={!carouselVisible}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Contact Info - Embedded */}
      <div className="fixed bottom-0 left-0 right-0 bg-white z-50">
        <div className="my-6 mx-3 sm:mx-7 text-sm text-gray-600">
          {/* Toggle Mobile */}
          <div className="flex justify-center mb-2 lg:hidden">
            {/* LCD Display Label */}
            <span
              className={`text-sm font-medium ${
                !isLED ? "text-gray-600" : "text-gray-300"
              }`}
            >
              LCD Display
            </span>

            {/* Toggle Switch */}
            <div className="relative inline-block w-9 h-4 mx-3 my-auto">
              <input
                id="display-toggle"
                type="checkbox"
                checked={isLED}
                onChange={handleToggleDisplay}
                className="peer appearance-none w-9 h-4 bg-gray-100 rounded-full checked:bg-gray-100 cursor-pointer transition-colors duration-300"
              />
              <label
                htmlFor="display-toggle"
                className="absolute top-0 left-0 w-4 h-4 bg-teal-500 rounded-full transition-transform duration-300 peer-checked:translate-x-5 peer-checked:border-teal-500 cursor-pointer"
              ></label>
            </div>

            {/* LED Display Label */}
            <span
              className={`text-sm font-medium ${
                isLED ? "text-gray-600" : "text-gray-300"
              }`}
            >
              LED Display
            </span>
          </div>

          {/* Toggle Desktop */}
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

            {/* Toggle Desktop */}
            <div className="hidden lg:flex items-center gap-2">
              <span
                className={`text-sm font-medium ${
                  !isLED ? "text-gray-600" : "text-gray-300"
                }`}
              >
                LCD Display
              </span>
              <div className="relative inline-block w-11 h-5 mx-3">
                <input
                  id="display-toggle-desktop"
                  type="checkbox"
                  checked={isLED}
                  onChange={handleToggleDisplay}
                  className="peer appearance-none w-11 h-4 bg-gray-100 align-middle rounded-full checked:bg-gray-100 cursor-pointer transition-colors duration-300"
                />
                <label
                  htmlFor="display-toggle-desktop"
                  className="absolute top-0 left-0 w-5 h-5 bg-teal-500 rounded-full transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-teal-500 cursor-pointer"
                ></label>
              </div>
              <span
                className={`text-sm font-medium ${
                  isLED ? "text-gray-600" : "text-gray-300"
                }`}
              >
                LED Display
              </span>
            </div>

            {/* Phone */}
            <div className="flex items-end gap-2 w-auto lg:mx-0">
              <img src="/icons/icon-call.svg" alt="Call" className="w-4 h-4" />
              <span className="text-xs lg:text-sm">(+62) 811-1122-492</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
