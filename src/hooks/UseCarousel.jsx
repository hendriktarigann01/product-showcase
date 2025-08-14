import { useState, useEffect, useCallback } from "react";

export const UseCarousel = (totalSlides, initialIndex = 0) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [goToSlide, setGoToSlide] = useState(null);
  const [carouselVisible, setCarouselVisible] = useState(false);

  const nextSlide = useCallback(() => {
    const next = (currentIndex + 1) % totalSlides;
    setCurrentIndex(next);
    setGoToSlide(next);
  }, [currentIndex, totalSlides]);

  const prevSlide = useCallback(() => {
    const prev = (currentIndex - 1 + totalSlides) % totalSlides;
    setCurrentIndex(prev);
    setGoToSlide(prev);
  }, [currentIndex, totalSlides]);

  const goToIndex = useCallback(
    (index) => {
      if (index >= 0 && index < totalSlides) {
        setCurrentIndex(index);
        setGoToSlide(index);
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

  return {
    currentIndex,
    goToSlide,
    carouselVisible,
    nextSlide,
    prevSlide,
    goToIndex,
    showCarousel,
    hideCarousel,
    setCurrentIndex,
    setGoToSlide,
  };
};
