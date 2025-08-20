import React from "react";

const ModuleImage = ({ showModuleImage, product, selectedView }) => {
  if (!showModuleImage) return null;

  const isLEDProduct =
    product.name === "LED Outdoor for Fixed Installation" ||
    product.name === "LED Indoor for Fixed Installation";

  if (!isLEDProduct || selectedView !== "front") return null;

  const isOutdoor = product.name === "LED Outdoor for Fixed Installation";
  const moduleImagePath = isOutdoor
    ? "/products_led/outdoor/front_module.webp"
    : "/products_led/indoor/front_module.webp";

  return (
    <div
      className={`absolute top-0 left-0 w-[320px] h-[220px] md:h-[280px] lg:w-[650px] lg:h-[400px] flex items-center justify-center z-[70] transition-all duration-700 ${
        showModuleImage
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-5"
      }`}
    >
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={moduleImagePath}
          alt="LED Module"
          className="max-h-full object-contain"
        />
      </div>
    </div>
  );
};

export default ModuleImage;
