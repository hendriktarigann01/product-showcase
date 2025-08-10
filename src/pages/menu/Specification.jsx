import React, { useState, useEffect } from "react";
import { MoveLeft, MoveRight } from "lucide-react";
import { Spec1 } from "../../components/specs/lcd/Spec1";
import { Spec2 } from "../../components/specs/lcd/Spec2";
import { Spec3 } from "../../components/specs/lcd/Spec3";
import { Spec4 } from "../../components/specs/lcd/Spec4";
import { Spec5 } from "../../components/specs/lcd/Spec5";
import { Spec1_LED } from "../../components/specs/led/Spec1";
import { Spec2_LED } from "../../components/specs/led/Spec2";

function Carousel3D({ slides, goToSlide, onSlideChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (goToSlide !== null && goToSlide !== currentIndex) {
      setCurrentIndex(goToSlide);
      onSlideChange?.(goToSlide);
    }
  }, [goToSlide, currentIndex, onSlideChange]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  const getSlideStyle = (index) => {
    const diff = index - currentIndex;
    const isActive = diff === 0;
    const isPrev =
      diff === -1 || (currentIndex === 0 && index === slides.length - 1);
    const isNext =
      diff === 1 || (currentIndex === slides.length - 1 && index === 0);

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
      // Responsive transforms - smaller offsets for mobile
      transform = "translateX(100px) rotateY(-35deg) translateZ(-100px)";
      opacity = 0.7;
      zIndex = 2;
    } else if (isNext) {
      transform = "translateX(-100px) rotateY(35deg) translateZ(-100px)";
      opacity = 0.7;
      zIndex = 2;
    } else {
      transform = "translateX(0) rotateY(90deg) translateZ(-200px)";
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

  // Responsive slide styles for desktop
  const getDesktopSlideStyle = (index) => {
    const diff = index - currentIndex;
    const isActive = diff === 0;
    const isPrev =
      diff === -1 || (currentIndex === 0 && index === slides.length - 1);
    const isNext =
      diff === 1 || (currentIndex === slides.length - 1 && index === 0);

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
      transform = "translateX(200px) rotateY(-35deg) translateZ(-200px)";
      opacity = 0.7;
      zIndex = 2;
    } else if (isNext) {
      transform = "translateX(-200px) rotateY(35deg) translateZ(-200px)";
      opacity = 0.7;
      zIndex = 2;
    } else {
      transform = "translateX(0) rotateY(90deg) translateZ(-400px)";
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
    <div className="relative w-full sm:w-4/5 md:w-3/4 lg:w-[72%] mx-auto h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
      <div className="relative w-full h-full flex items-center justify-center preserve-3d">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="absolute w-[280px] h-[200px] sm:w-[400px] sm:h-[250px] md:w-[500px] md:h-[280px] lg:w-[600px] lg:h-[335px] cursor-pointer"
            style={
              window.innerWidth >= 1024
                ? getDesktopSlideStyle(index)
                : getSlideStyle(index)
            }
            onClick={() => slide.onClick?.()}
          >
            {slide.content}
          </div>
        ))}
      </div>
    </div>
  );
}

// Component untuk single image display
function SingleImageDisplay({ image, productName }) {
  return (
    <div className="flex justify-center">
      <div className="max-w-full lg:max-w-6xl">
        <img
          src={image}
          alt={`${productName} specification`}
          className="w-full h-48 sm:h-64 md:h-80 lg:h-96 mt-4 md:mt-8 lg:mt-10 object-contain"
        />
      </div>
    </div>
  );
}

const Specification = ({ product, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [goToSlide, setGoToSlide] = useState(null);
  const [currentSpec, setCurrentSpec] = useState(product.specs?.[0] || {});

  const productImages = [
    product.image_spec1,
    product.image_spec2,
    product.image_spec3,
    product.image_spec4,
    product.image_spec5,
  ].filter(Boolean);

  const hasMultipleImages = productImages.length > 1;

  useEffect(() => {
    const newSpec = product.specs?.[currentIndex] || product.specs?.[0] || {};
    setCurrentSpec(newSpec);
  }, [currentIndex, product.specs]);

  const slides = productImages.map((image, index) => ({
    key: index,
    content: (
      <div className="h-full flex flex-col mt-1 md:mt-3">
        <div className="flex-1 m-3 md:m-7 flex items-center justify-center">
          <img
            src={image}
            alt={`${product.name} view ${index + 1}`}
            className="max-w-full max-h-60 md:max-h-64 lg:max-h-72 object-contain"
          />
        </div>
      </div>
    ),
    onClick: () => setGoToSlide(index),
  }));

  const nextSlide = () => {
    const next = (currentIndex + 1) % productImages.length;
    setCurrentIndex(next);
    setGoToSlide(next);
  };

  const prevSlide = () => {
    const prev =
      (currentIndex - 1 + productImages.length) % productImages.length;
    setCurrentIndex(prev);
    setGoToSlide(prev);
  };

  const handleSlideChange = (index) => setCurrentIndex(index);

  const getTitle = () => {
    if (currentSpec.type) return currentSpec.type;
    if (currentSpec.size) return `${currentSpec.size}`;
    return "Specification";
  };

  const renderSpec = () => {
    console.log("currentSpec:", currentSpec); // Debug data

    const layoutType = hasMultipleImages ? "default" : "side";

    // Fix: Ganti pengecekan dari options ke variants
    if (Array.isArray(currentSpec?.variants)) {
      console.log("Using Spec2");
      return <Spec2 spec={currentSpec} layout={layoutType} />;
    }

    // Kondisi lama untuk options (jika masih ada data dengan struktur lama)
    if (Array.isArray(currentSpec?.options)) {
      console.log("Using Spec2 (old structure)");
      return <Spec2 spec={currentSpec} layout={layoutType} />;
    }

    if (
      currentSpec?.size ||
      currentSpec?.os ||
      currentSpec?.android ||
      currentSpec?.windows ||
      currentSpec?.cpu ||
      currentSpec?.ram ||
      currentSpec?.cam ||
      currentSpec?.mic ||
      currentSpec?.nfc ||
      currentSpec?.fp ||
      currentSpec?.noise ||
      currentSpec?.touchscreen ||
      currentSpec?.maxres ||
      currentSpec?.storage
    ) {
      console.log("Using Spec1 (default)");
      return <Spec1 spec={currentSpec} layout={layoutType} />;
    }

    if (
      currentSpec?.size &&
      currentSpec?.os &&
      currentSpec?.android &&
      currentSpec?.windows &&
      (currentSpec?.ram || currentSpec?.storage)
    ) {
      console.log("Using Spec3");
      return <Spec3 specs={[currentSpec]} layout={layoutType} />;
    }

    // Spec1 LED
    if (
      currentSpec?.refresh_rate &&
      currentSpec?.brightness &&
      currentSpec?.modul_size &&
      currentSpec?.pixel_resolution
    ) {
      console.log("Using Spec1 LED");
      return <Spec1_LED specs={[currentSpec]} layout={layoutType} />;
    }

    // Spec2 LED
    if (currentSpec?.module_pixels && currentSpec?.weight) {
      console.log("Using Spec2 LED");
      return <Spec2_LED specs={[currentSpec]} layout={layoutType} />;
    }

    // Spec5
    if (
      currentSpec?.size &&
      currentSpec?.power &&
      currentSpec?.display_ratio &&
      currentSpec?.application
    ) {
      console.log("Using Spec5");
      return <Spec5 spec={currentSpec} layout={layoutType} />;
    }

    // Spec4
    if (
      currentSpec?.table ||
      currentSpec?.brightness ||
      currentSpec?.resolution ||
      currentSpec?.display
    ) {
      console.log("Using Spec4");
      return <Spec4 spec={currentSpec} layout={layoutType} />;
    }

    // Fallback — kalau nggak match semua
    console.log("Using Spec1 (fallback)");
    return <Spec1 spec={currentSpec} layout={layoutType} />;
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e7f4f3] overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-[#e7f4f3] backdrop-blur-sm z-50">
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
                className="w-2 h-2 p-5 md:p-7 flex justify-center items-center text-xs md:text-sm bg-primary rounded-full text-white"
              >
                Back
              </button>
            </div>

            <div className="w-full">
              <h1 className="text-lg md:text-2xl font-bold text-gray-600 text-center">
                {getTitle()}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {hasMultipleImages ? (
        // Multiple images - gunakan carousel layout yang sudah ada
        <>
          <div className="mt-14 sm:mt-16 px-4 sm:px-6 md:px-8 mb-0 md:mb-4">
            <div className="max-w-7xl mx-auto">
              <div className="relative flex items-center justify-center">
                <Carousel3D
                  slides={slides}
                  goToSlide={goToSlide}
                  onSlideChange={handleSlideChange}
                />
                <button
                  onClick={prevSlide}
                  className="absolute -left-2 sm:left-2 md:left-4 top-[90%] transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-teal-500 hover:bg-teal-600 text-white rounded-full flex items-center justify-center shadow-lg z-10"
                >
                  <MoveLeft size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute -right-2 sm:right-2 md:right-4 top-[90%] transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-teal-500 hover:bg-teal-600 text-white rounded-full flex items-center justify-center shadow-lg z-10"
                >
                  <MoveRight
                    size={16}
                    className="sm:w-5 sm:h-5 md:w-6 md:h-6"
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="px-4 sm:px-6 md:px-8 pb-20">{renderSpec()}</div>
        </>
      ) : (
        // Single image - responsive layout
        <div className="min-h-screen px-4 sm:px-6 md:px-8 pt-16 sm:pt-20 md:pt-24 pb-20">
          <div className="max-w-7xl w-full mx-auto">
            <div className="flex flex-col my-5 lg:flex-row items-center justify-center lg:items-start gap-2 sm:gap-4 md:gap-6">
              {/* Single Image */}
              <div className="w-full lg:flex-1 flex justify-center my-auto">
                <SingleImageDisplay
                  image={productImages[0]}
                  productName={product.name}
                />
              </div>

              {/* Specifications */}
              <div className="w-full lg:flex-1 mt-4 lg:mt-0">
                {renderSpec()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Info - Embedded */}
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
    </div>
  );
};

export default Specification;
