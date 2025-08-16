import { useState, useEffect, useCallback } from "react";

export const UseCarousel = (totalSlides, initialIndex = 0) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [carouselVisible, setCarouselVisible] = useState(false);

  const nextSlide = useCallback(() => {
    const next = (currentIndex + 1) % totalSlides;
    setCurrentIndex(next);
  }, [currentIndex, totalSlides]);

  const prevSlide = useCallback(() => {
    const prev = (currentIndex - 1 + totalSlides) % totalSlides;
    setCurrentIndex(prev);
  }, [currentIndex, totalSlides]);

  const goToIndex = useCallback(
    (index) => {
      if (index >= 0 && index < totalSlides) {
        setCurrentIndex(index);
      }
    },
    [totalSlides]
  );

  const showCarousel = useCallback(() => {
    setTimeout(() => {
      setCarouselVisible(true);
    }, 100);
  }, []);

  const hideCarousel = useCallback(() => {
    setCarouselVisible(false);
  }, []);

  // Auto-initialize carousel visibility
  useEffect(() => {
    if (totalSlides > 0) {
      showCarousel();
    }
  }, [totalSlides, showCarousel]);

  return {
    currentIndex,
    carouselVisible,
    nextSlide,
    prevSlide,
    goToIndex,
    showCarousel,
    hideCarousel,
    setCurrentIndex,
  };
};
