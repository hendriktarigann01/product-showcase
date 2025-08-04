import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Spec1 } from "../../components/specs/lcd/Spec1";
import { Spec2 } from "../../components/specs/lcd/Spec2";
import { Spec3 } from "../../components/specs/lcd/Spec3";
import { Spec4 } from "../../components/specs/lcd/Spec4";
import { Spec5 } from "../../components/specs/lcd/Spec5";
import { Spec1_LED } from "../../components/specs/led/Spec1";
import { Spec2_LED } from "../../components/specs/led/Spec2";

// Embedded Header Component
function Header({ title, subtitle, onBack, showBackButton }) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#e7f4f3] backdrop-blur-sm z-50">
      <div className="my-6 mx-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-full flex justify-between items-center">
            <img
              src="/logo/mjs_logo_text.png"
              alt="MJS Logo"
              className="h-10"
            />
            {showBackButton && (
              <button
                onClick={handleBack}
                className="w-3 h-3 p-7 flex justify-center items-center text-sm bg-primary rounded-full text-white"
              >
                Back
              </button>
            )}
          </div>

          <div className="w-full">
            <h1 className="text-2xl font-bold text-gray-600 text-center">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 text-lg text-center">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Embedded ContactInfo Component
function ContactInfo() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#e7f4f3] z-50">
      <div className="my-6 mx-6">
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <img src="/icons/icon-web.svg" alt="Website" className="w-4 h-4" />
            <span>mjsolution.co.id</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="/icons/icon-call.svg" alt="Call" className="w-4 h-4" />
            <span>(+62) 811-1122-492</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Carousel3D({ slides, goToSlide, onSlideChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (goToSlide !== null && goToSlide !== currentIndex) {
      setCurrentIndex(goToSlide);
      onSlideChange?.(goToSlide);
    }
  }, [goToSlide, currentIndex, onSlideChange]);

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
    <div className="relative w-4/5 sm:w-3/4 md:w-[72%] mx-auto h-[400px]">
      <div className="relative w-full h-full flex items-center justify-center preserve-3d">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="absolute w-[600px] h-[335px] cursor-pointer"
            style={getSlideStyle(index)}
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
      <div className="max-w-6xl">
        <img
          src={image}
          alt={`${productName} specification`}
          className="w-full h-96 mt-10 object-contain"
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
      <div className="h-full flex flex-col mt-3">
        <div className="flex-1 m-7 flex items-center justify-center">
          <img
            src={image}
            alt={`${product.name} view ${index + 1}`}
            className="max-w-full max-h-72 object-contain"
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

    if (Array.isArray(currentSpec?.options)) {
      console.log("Using Spec2");
      return <Spec2 spec={currentSpec} layout={layoutType} />;
    }

    if (Array.isArray(currentSpec?.specs)) {
      console.log("Using Spec3");
      return <Spec3 specs={currentSpec.specs} layout={layoutType} />;
    }

    if (
      currentSpec?.refresh_rate &&
      currentSpec?.brightness &&
      currentSpec?.modul_size &&
      currentSpec?.pixel_resolution
    ) {
      console.log("Using Spec1 LED");
      return <Spec1_LED specs={[currentSpec]} layout={layoutType} />;
    }

    if (
      currentSpec?.module_pixels &&
      currentSpec?.weight
    ) {
      console.log("Using Spec2 LED");
      return <Spec2_LED specs={[currentSpec]} layout={layoutType} />;
    }

    if (
      currentSpec?.size &&
      currentSpec?.power &&
      currentSpec?.display_ratio &&
      currentSpec?.application
    ) {
      console.log("Using Spec5");
      return <Spec5 spec={currentSpec} layout={layoutType} />;
    }

    if (
      currentSpec?.table ||
      currentSpec?.brightness ||
      currentSpec?.resolution ||
      currentSpec?.display
    ) {
      console.log("Using Spec4");
      return <Spec4 spec={currentSpec} layout={layoutType} />;
    }

    console.log("Using Spec1 (default)");
    return <Spec1 spec={currentSpec} layout={layoutType} />;
  };

  return (
    <div className="h-screen bg-[#e7f4f3]">
      <Header title={getTitle()} onBack={onBack} showBackButton={true} />

      {hasMultipleImages ? (
        // Multiple images - gunakan carousel layout yang sudah ada
        <>
          <div className="pt-16 px-8">
            <div className="max-w-7xl mx-auto">
              <div className="relative flex items-center justify-center">
                <Carousel3D
                  slides={slides}
                  goToSlide={goToSlide}
                  onSlideChange={handleSlideChange}
                />
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-3/4 transform -translate-y-1/2 w-12 h-12 bg-teal-500 hover:bg-teal-600 text-white rounded-full flex items-center justify-center shadow-lg z-10"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-3/4 transform -translate-y-1/2 w-12 h-12 bg-teal-500 hover:bg-teal-600 text-white rounded-full flex items-center justify-center shadow-lg z-10"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
          {renderSpec()}
        </>
      ) : (
        // Single image - gunakan layout side by side
        <div className="h-screen px-8 flex items-center justify-center">
          <div className="max-w-7xl w-full">
            <div className="flex flex-col lg:flex-row items-center justify-center lg:items-start gap-8">
              {/* Single Image */}
              <div className="flex-1 flex justify-center my-auto">
                <SingleImageDisplay
                  image={productImages[0]}
                  productName={product.name}
                />
              </div>

              {/* Specifications */}
              <div className="flex-1">{renderSpec()}</div>
            </div>
          </div>
        </div>
      )}

      <ContactInfo />
    </div>
  );
};

export default Specification;
