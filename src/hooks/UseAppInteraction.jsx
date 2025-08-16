import { useEffect, useRef } from "react";
import { getImageSource } from "../utils/pages/ApplicationHelpers";

export const UseAppInteraction = (
  product,
  selectedApp,
  setSelectedApp,
  selectedAppId,
  setSelectedAppId,
  startTransition,
  endTransition,
  isTransitioning
) => {
  const imageRefs = useRef({});
  const hotspotRefs = useRef({});

  useEffect(() => {
    const handleBackFromDetail = () => {
      setSelectedApp(null);
      setSelectedAppId(null);
      endTransition();

      window.history.pushState(
        { view: "application" },
        "",
        window.location.pathname
      );
    };

    const handlePopState = () => {
      if (selectedApp) {
        handleBackFromDetail();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectedApp, endTransition, setSelectedApp, setSelectedAppId]);

  const handleImageClick = (appId) => {
    const appImages = product?.app || [];
    const selectedAppData = appImages.find((item) => item.id === appId);
    if (!selectedAppData || isTransitioning) return;

    const clickedImageElement = imageRefs.current[appId];
    const hotspotElement = hotspotRefs.current[appId];

    if (clickedImageElement && hotspotElement) {
      const imageSource = getImageSource(selectedAppData, product);

      startTransition(clickedImageElement, null, {
        direction: "forward",
        appId: appId,
        selectedApp: selectedAppData,
        startImage: imageSource,
        endImage: imageSource,
      });
    }

    setSelectedAppId(appId);

    window.history.pushState(
      { view: "detail", appId },
      "",
      window.location.pathname
    );

    setTimeout(() => {
      setSelectedApp(selectedAppData);
      const slugTitle = selectedAppData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      window.history.pushState(
        { view: "detail", appId },
        "",
        `${window.location.pathname}?detail=${slugTitle}`
      );
    }, 50);
  };

  const handleBackFromDetailExternal = () => {
    setSelectedApp(null);
    setSelectedAppId(null);
    endTransition();

    window.history.pushState(
      { view: "application" },
      "",
      window.location.pathname
    );
  };

  return {
    imageRefs,
    hotspotRefs,
    handleImageClick,
    handleBackFromDetailExternal,
  };
};
