import React from "react";

export const Carousel3D = ({
  slides,
  currentIndex,
  onSlideClick,
  variant = "home",
}) => {
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

    if (variant === "home") {
      // Home page carousel style
      if (isActive) {
        transform = "translateX(0) rotateY(0deg) translateZ(0px)";
        opacity = 1;
        scale = 1;
        zIndex = 3;
      } else if (isPrev) {
        transform = "translateX(-320px) rotateY(20deg) translateZ(-320px)";
        opacity = 0.7;
        zIndex = 2;
      } else if (isNext) {
        transform = "translateX(320px) rotateY(-20deg) translateZ(-320px)";
        opacity = 0.7;
        zIndex = 2;
      } else {
        transform = "translateX(0) rotateY(90deg) translateZ(-320px)";
        opacity = 0;
        scale = 0.6;
        zIndex = 0;
      }
    } else if (variant === "specification") {
      // Specification page carousel style - responsive
      const isMobile = window.innerWidth < 1024;

      if (isActive) {
        transform = "translateX(0) rotateY(0deg) translateZ(0px)";
        opacity = 1;
        scale = 1;
        zIndex = 3;
      } else if (isPrev) {
        if (isMobile) {
          transform = "translateX(100px) rotateY(-35deg) translateZ(-100px)";
        } else {
          transform = "translateX(350px) rotateY(-0deg) translateZ(-350px)";
        }
        opacity = 0.7;
        zIndex = 2;
      } else if (isNext) {
        if (isMobile) {
          transform = "translateX(-100px) rotateY(35deg) translateZ(-100px)";
        } else {
          transform = "translateX(-350px) rotateY(0deg) translateZ(-350px)";
        }
        opacity = 0.7;
        zIndex = 2;
      } else {
        if (isMobile) {
          transform = "translateX(0) rotateY(90deg) translateZ(-200px)";
        } else {
          transform = "translateX(0) rotateY(90deg) translateZ(-400px)";
        }
        opacity = 0;
        scale = 0.6;
        zIndex = 0;
      }
    }

    return {
      transform: `${transform} scale(${scale})`,
      opacity,
      zIndex,
      transition: "all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)",
    };
  };

  const getContainerClass = () => {
    if (variant === "home") {
      return "relative w-[95%] sm:w-[92%] md:w-[90%] mx-auto h-[370px] sm:h-[416px]";
    } else if (variant === "specification") {
      return "relative w-full sm:w-4/5 md:w-3/4 lg:w-[72%] mx-auto h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px]";
    }
    return "relative w-full mx-auto";
  };

  const getSlideClass = () => {
    if (variant === "home") {
      return "absolute w-[352px] h-[352px]";
    } else if (variant === "specification") {
      return "absolute justify-center items-center w-[240px] max-h-[200px] sm:w-[400px] sm:max-h-[250px] md:w-[500px] md:max-h-[280px] lg:w-[600px] lg:max-h-[335px] cursor-pointer";
    }
    return "absolute";
  };

  return (
    <div className={getContainerClass()}>
      <div className="relative w-full h-full flex items-center justify-center preserve-3d">
        {slides.map((slide, index) => (
          <div
            key={slide.key || index}
            className={getSlideClass()}
            style={getSlideStyle(index)}
            onClick={() => onSlideClick?.(slide, index)}
          >
            {slide.content}
          </div>
        ))}
      </div>
    </div>
  );
};
