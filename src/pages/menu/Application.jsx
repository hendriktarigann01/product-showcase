import React, { useState, useRef, useEffect } from "react";
import DetailApplication from "../menu/details/DetailApplication";
import { useMorphTransition } from "../../utils/MorphTransitionApp";

const Application = ({
  product: propProduct,
  productIndex: propIndex,
  onBack,
}) => {
  const [product, setProduct] = useState(propProduct);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const imageRefs = useRef({});
  const hotspotRefs = useRef({});
  const { startTransition, isTransitioning, endTransition } =
    useMorphTransition();

  useEffect(() => {
    if (!propProduct) {
      const savedProduct = localStorage.getItem("selectedProduct");
      const savedIndex = localStorage.getItem("selectedProductIndex");

      if (savedProduct) setProduct(JSON.parse(savedProduct));
      // productIndex state dihapus karena tidak digunakan
      // Jika tetap diperlukan untuk debugging, bisa uncomment line berikut:
      // if (savedIndex) console.log('Product Index:', parseInt(savedIndex));
    }
  }, [propProduct, propIndex]);

  useEffect(() => {
    // Pindahkan handleBackFromDetail ke dalam useEffect untuk menghindari dependency issue
    const handleBackFromDetail = () => {
      // Back dari detail ke application (tidak keluar dari application)
      setSelectedApp(null);
      setSelectedAppId(null);
      endTransition();

      // Update URL untuk kembali ke application view
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
  }, [selectedApp, endTransition]); // Tambahkan endTransition ke dependency array

  // Helper function to determine if this is LED Outdoor product
  const isLEDOutdoorProduct = (product) => {
    return (
      product?.name?.toLowerCase().includes("outdoor") &&
      product?.name?.toLowerCase().includes("led")
    );
  };

  // Helper function to get the correct image source
  const getImageSource = (appImage) => {
    // Hanya untuk LED Outdoor, gunakan image_full jika ada, fallback ke image
    if (isLEDOutdoorProduct(product)) {
      return appImage.image_full;
    }
    // Untuk produk lainnya (LED Indoor, dll), tetap gunakan image biasa
    return appImage.image;
  };

  const handleImageClick = (appId) => {
    // Get applications data - handle both regular products and LED products
    const appImages = product?.app || [];
    const selectedAppData = appImages.find((item) => item.id === appId);
    if (!selectedAppData || isTransitioning) return;

    // Get the clicked image element for transition
    const clickedImageElement = imageRefs.current[appId];
    const hotspotElement = hotspotRefs.current[appId];

    if (clickedImageElement && hotspotElement) {
      // Get the correct image source for transition
      const imageSource = getImageSource(selectedAppData);

      // Start forward transition
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

    // Set selected app and update URL without full navigation
    setTimeout(() => {
      setSelectedApp(selectedAppData);
      // Update URL untuk browser history
      window.history.pushState(
        { view: "detail", appId },
        "",
        `${window.location.pathname}?detail=${appId}`
      );
    }, 50);
  };

  // Buat function terpisah untuk handle back from detail yang bisa dipanggil dari luar useEffect
  const handleBackFromDetailExternal = () => {
    setSelectedApp(null);
    setSelectedAppId(null);
    endTransition();

    // Update URL untuk kembali ke application view
    window.history.pushState(
      { view: "application" },
      "",
      window.location.pathname
    );
  };

  if (!product) return null;

  if (selectedApp) {
    return (
      <DetailApplication
        selectedApp={selectedApp}
        onBack={handleBackFromDetailExternal}
        isTransitioning={isTransitioning}
      />
    );
  }

  // Get applications data - handle both regular products and LED products
  const appImages = product.app || [];
  const appRooms = product.app_room || [];

  // For LED products, create app_room data from app data if app_room doesn't exist
  let compositeHotspots = [];

  if (appRooms.length > 0) {
    // Use existing app_room data for regular products
    compositeHotspots = appRooms.map((room) => ({
      ...room,
      onClick: () => handleImageClick(room.appId),
    }));
  } else if (appImages.length > 0) {
    // For LED products, create hotspots from app data
    // This assumes a simple layout - you may need to adjust positioning
    compositeHotspots = appImages.map((app, index) => ({
      id: `hotspot-${app.id}`,
      appId: app.id,
      title: app.title,
      x: 20 + index * 25, // Simple horizontal spacing
      y: 30 + index * 20, // Simple vertical spacing
      onClick: () => handleImageClick(app.id),
      style: {
        width: "200px",
        height: "150px",
        left: `${10 + index * 30}%`,
        top: `${20 + index * 25}%`,
      },
    }));
  }

  return (
    <div className="max-h-screen">
      {/* Header - Embedded */}
      <div className="fixed top-0 left-0 right-0 bg-[#e7f4f3] backdrop-blur-sm z-50">
        <div className="my-6 mx-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-full flex justify-between items-center">
              <img
                src="/logo/mjs_logo_text.png"
                alt="MJS Logo"
                className="h-10"
              />
              <button
                onClick={onBack}
                className="w-3 h-3 p-7 flex justify-center items-center text-sm bg-primary rounded-full text-white"
              >
                Back
              </button>
            </div>

            <div className="w-full">
              <h1 className="text-2xl font-bold text-gray-600 text-center">
                Applications
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-screen pt-32 pb-24 bg-[#e7f4f3] px-4 lg:px-12 box-border overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          <div className="flex-grow flex items-center justify-center">
            <div className="flex items-center justify-center">
              <div
                className="relative flex items-center justify-center"
                style={{ width: "910px", height: "490px" }}
              >
                {/* Composite Image Layer */}
                <div className="relative w-full h-full">
                  {compositeHotspots.map((hotspot) => {
                    const appImage = appImages.find(
                      (app) => app.id === hotspot.appId
                    );
                    if (!appImage) return null;

                    const isSelected = selectedAppId === hotspot.appId;
                    const shouldHide = isTransitioning && isSelected;

                    // Use the helper function to get the correct image source
                    const imageSource = getImageSource(appImage);

                    return (
                      <img
                        key={hotspot.id}
                        ref={(el) => (imageRefs.current[hotspot.appId] = el)}
                        src={imageSource}
                        alt={hotspot.title}
                        className="absolute object-contain cursor-pointer transition-all duration-300 ease-out"
                        style={{
                          ...hotspot.style,
                          opacity: shouldHide ? 0 : 1,
                          visibility: shouldHide ? "hidden" : "visible",
                        }}
                        onClick={() => handleImageClick(hotspot.appId)}
                      />
                    );
                  })}
                </div>

                {/* Hotspot Layer */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ zIndex: 100 }}
                >
                  {compositeHotspots.map((hotspot) => {
                    const isSelected = selectedAppId === hotspot.appId;
                    const shouldHide = isTransitioning && isSelected;

                    return (
                      <div key={hotspot.id}>
                        <div
                          ref={(el) =>
                            (hotspotRefs.current[hotspot.appId] = el)
                          }
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto transition-all duration-300 ease-out"
                          style={{
                            left: `${hotspot.x}%`,
                            top: `${hotspot.y}%`,
                            zIndex: 101,
                            opacity: shouldHide ? 0 : 1,
                          }}
                          onClick={hotspot.onClick}
                          data-hotspot-id={hotspot.appId}
                        >
                          <div className="relative flex items-center justify-center">
                            {/* Animated Rings - hanya show jika tidak sedang hide */}
                            {!shouldHide && (
                              <>
                                <div className="absolute w-6 h-6 rounded-full bg-teal-500 border opacity-40 animate-ping"></div>
                                <div
                                  className="absolute w-8 h-8 rounded-full bg-teal-500 border opacity-30 animate-ping"
                                  style={{ animationDelay: "1.5s" }}
                                ></div>
                                <div
                                  className="absolute w-10 h-10 rounded-full bg-teal-500 border opacity-20 animate-ping"
                                  style={{ animationDelay: "2s" }}
                                ></div>
                              </>
                            )}

                            <button
                              className={`relative w-4 h-4 bg-teal-600 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                                isSelected
                                  ? "scale-125 bg-teal-700"
                                  : "hover:scale-110"
                              }`}
                              disabled={isTransitioning}
                            ></button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Overlay untuk mencegah interaksi saat transisi */}
                {isTransitioning && (
                  <div
                    className="absolute inset-0 bg-transparent"
                    style={{ zIndex: 999 }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info - Embedded */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#e7f4f3] z-50">
        <div className="my-7 mx-6">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <img
                src="/icons/icon-web.svg"
                alt="Website"
                className="w-4 h-4"
              />
              <span>mjsolution.co.id</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/icons/icon-call.svg" alt="Call" className="w-4 h-4" />
              <span>(+62) 811-1122-492</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Application;
