import React from "react";

const CarouselSlide = ({ product, index, isVisible, imageRef, onClick }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-2 flex items-center justify-center">
        <img
          ref={imageRef}
          src={product.image}
          alt={product.name}
          className="w-full max-h-full object-contain transition-all duration-300 cursor-pointer"
          data-carousel-image="true"
          data-carousel-index={index}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "scale(1)" : "scale(0.4)",
          }}
          onClick={onClick}
        />
      </div>
      <div className="p-4 bg-transparent rounded-b-2xl">
        <div className="w-full h-10"></div>
      </div>
    </div>
  );
};

export default CarouselSlide;
