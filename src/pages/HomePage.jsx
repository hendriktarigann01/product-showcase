import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { products } from "../data/product";
import { products_led } from "../data/product_led";
import { useMorphTransition } from "../utils/MorphTransition";

function Carousel3D({ slides, goToSlide, onSlideChange, currentIndex }) {
  const [localCurrentIndex, setLocalCurrentIndex] = useState(0);

  useEffect(() => {
    if (goToSlide !== null && goToSlide !== localCurrentIndex) {
      setLocalCurrentIndex(goToSlide);
      if (onSlideChange) {
        onSlideChange(goToSlide);
      }
    }
  }, [goToSlide, localCurrentIndex, onSlideChange]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    setLocalCurrentIndex(currentIndex);
  }, [currentIndex]);

  const getSlideStyle = (index) => {
    const diff = index - localCurrentIndex;
    const isActive = diff === 0;
    const isPrev =
      diff === -1 || (localCurrentIndex === 0 && index === slides.length - 1);
    const isNext =
      diff === 1 || (localCurrentIndex === slides.length - 1 && index === 0);

    let transform = "";
    let opacity = 0.3;
    let scale = 0.8;
    let zIndex = 1;

    if (isActive) {
      transform = "translateX(0) rotateY(0deg) translateZ(0px)";
      opacity = 1;
      scale = 1;
      zIndex = 3;
    } else if (isPrev) {
      transform = "translateX(-300px) rotateY(20deg) translateZ(-300px)";
      opacity = 0.7;
      scale = 0.8;
      zIndex = 2;
    } else if (isNext) {
      transform = "translateX(300px) rotateY(-20deg) translateZ(-250px)";
      opacity = 0.7;
      scale = 0.8;
      zIndex = 2;
    } else {
      transform = "translateX(0) rotateY(90deg) translateZ(-500px)";
      opacity = 0;
      scale = 0.6;
      zIndex = 0;
    }

    return {
      transform: `${transform} scale(${scale})`,
      opacity,
      zIndex,
      transition: "all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)",
    };
  };

  return (
    <div className="relative w-[95%] sm:w-[92%] md:w-[90%] mx-auto h-[370px] sm:h-[416px]">
      <div className="relative w-full h-full flex items-center justify-center preserve-3d">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="absolute w-[352px] h-[352px] cursor-pointer"
            style={getSlideStyle(index)}
            onClick={() => slide.onClick && slide.onClick()}
          >
            {slide.content()}
          </div>
        ))}
      </div>
    </div>
  );
}

// Main HomePage Component
function HomePage({ onSelectProduct, selectedProductIndex, isLED, setIsLED }) {
  const [currentIndex, setCurrentIndex] = useState(selectedProductIndex || 0);
  const [goToSlide, setGoToSlide] = useState(null);
  const [carouselVisible, setCarouselVisible] = useState(false);
  const { startTransition, endTransition, isTransitioning } =
    useMorphTransition();
  const imageRefs = useRef({});

  useEffect(() => {
    if (selectedProductIndex !== undefined && selectedProductIndex !== null) {
      setCurrentIndex(selectedProductIndex);
      setGoToSlide(selectedProductIndex);
    }
  }, [selectedProductIndex]);

  useEffect(() => {
    if (isTransitioning) {
      setCarouselVisible(false);

      setTimeout(() => {
        endTransition();
        setTimeout(() => {
          setCarouselVisible(true);
        }, 220);
      }, 900);
    } else {
      setTimeout(() => {
        setCarouselVisible(true);
      }, 100);
    }
  }, [isTransitioning, endTransition]);

  const selectedProducts = isLED ? products_led : products;
  const handleSelectProduct = (product, imageElement) => {
    const productIndex = selectedProducts.findIndex(
      (p) => p.name === product.name
    );

    if (productIndex === -1) {
      console.warn("Produk tidak ditemukan dalam selectedProducts");
      return;
    }

    if (imageElement && startTransition) {
      startTransition(imageElement, null, {
        startImage: product.image,
        endImage: product.images?.front,
        direction: "forward",
        productIndex,
      });

      setTimeout(() => {
        onSelectProduct(selectedProducts[productIndex], productIndex, isLED);
      }, 150);
    } else {
      onSelectProduct(selectedProducts[productIndex], productIndex, isLED);
    }
  };

  const slides = selectedProducts.map((product, index) => ({
    key: index,
    content: () => (
      <div className="h-full flex flex-col">
        <div className="flex-1 p-2 flex items-center justify-center">
          <img
            ref={(el) => {
              if (el) imageRefs.current[selectedProducts[index]?.name] = el;
            }}
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain transition-all duration-300"
            data-carousel-image="true"
            data-carousel-index={index}
            style={{
              opacity: carouselVisible ? 1 : 0,
              transform: carouselVisible ? "scale(1)" : "scale(0.9)",
            }}
          />
        </div>
        <div className="p-4 bg-transparent rounded-b-2xl">
          <div className="w-full h-10"></div>
        </div>
      </div>
    ),
    onClick: () => setGoToSlide(index),
  }));

  const nextSlide = () => {
    const next = (currentIndex + 1) % selectedProducts.length;
    setCurrentIndex(next);
    setGoToSlide(next);
  };

  const prevSlide = () => {
    const prev =
      (currentIndex - 1 + selectedProducts.length) % selectedProducts.length;
    setCurrentIndex(prev);
    setGoToSlide(prev);
  };

  return (
    <div
      className="flex flex-col bg-white overflow-hidden"
      style={{ height: "100dvh" }} // dynamic viewport height untuk iOS
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

            <div className="w-full">
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
          </div>
        </div>
      </div>
      {/* Main Content - Flex grow to fill available space */}
      <div className="flex-grow flex items-center justify-center pt-32 pb-24 px-8">
        <div className="max-w-7xl mx-auto w-full">
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

            {/* Carousel */}
            <div
              className="transition-all duration-500"
              style={{
                opacity: carouselVisible ? 1 : 0,
                transform: carouselVisible
                  ? "translateY(0)"
                  : "translateY(20px)",
              }}
            >
              <Carousel3D
                slides={slides}
                goToSlide={goToSlide}
                onSlideChange={setCurrentIndex}
                currentIndex={currentIndex}
              />
            </div>

            {/* Select Button - centered below carousel */}
            <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentProduct = selectedProducts[currentIndex];
                  const imageElement = imageRefs.current[currentProduct.name];
                  handleSelectProduct(currentProduct, imageElement);
                }}
                className={`bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-lg ${
                  carouselVisible
                    ? "opacity-100 scale-100"
                    : "opacity-50 scale-95"
                }`}
                disabled={!carouselVisible}
              >
                Select{" "}
                <span>
                  <ArrowUpRight size={18} />
                </span>
              </button>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className={`absolute left-0 sm:left-20 top-full transform -translate-y-1/2 w-12 h-12 bg-teal-500 hover:bg-teal-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-10 ${
                carouselVisible
                  ? "opacity-100 scale-100"
                  : "opacity-50 scale-95"
              }`}
              disabled={!carouselVisible}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextSlide}
              className={`absolute right-0 sm:right-20 top-full transform -translate-y-1/2 w-12 h-12 bg-teal-500 hover:bg-teal-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-10 ${
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
            <span className="text-sm font-medium text-gray-400">
              LED Display
            </span>

            <div className="relative inline-block w-11 h-5 mx-3">
              <input
                id="display-toggle"
                type="checkbox"
                checked={isLED}
                onChange={() => setIsLED(!isLED)}
                className="peer appearance-none w-11 h-4 bg-slate-100 border align-middle border-slate-300 rounded-full checked:bg-teal-500 checked:border-teal-500 cursor-pointer transition-colors duration-300"
              />
              <label
                htmlFor="display-toggle"
                className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-teal-500 cursor-pointer"
              ></label>
            </div>

            <span className="text-sm font-medium text-gray-400">
              LCD Display
            </span>
          </div>
          {/* Baris Website & Phone (dan toggle di desktop) */}
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
              <span className="text-sm font-medium text-gray-400">
                LED Display
              </span>

              <div className="relative inline-block w-11 h-5 mx-3">
                <input
                  id="display-toggle"
                  type="checkbox"
                  checked={isLED}
                  onChange={() => setIsLED(!isLED)}
                  className="peer appearance-none w-11 h-4 bg-slate-100 border align-middle border-slate-300 rounded-full checked:bg-teal-500 checked:border-teal-500 cursor-pointer transition-colors duration-300"
                />
                <label
                  htmlFor="display-toggle"
                  className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-teal-500 cursor-pointer"
                ></label>
              </div>

              <span className="text-sm font-medium text-gray-400">
                LCD Display
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
