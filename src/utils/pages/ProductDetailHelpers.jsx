export const PRODUCT_TITLES = {
  "KMI 7000": "Interactive Whiteboard KMI 7000 Series",
  "KMI 8000": "Video Wall KMI 8000",
  "KMI 2000": "Digital Signage KMI 2000 Series",
  "KMI 2300": "Digital Signage KMI 2300",
  "KMI 4100": "Infrared Touch Inquiry Kiosk KMI 4100 & 4200",
};

export const ZOOM_ENABLED_PRODUCTS = [
  "Digital Signage KMI 2000 Series",
  "Digital Signage KMI 2300",
  "LED Poster Display",
];

export const PRODUCTS_WITHOUT_IMPLEMENTATION = [
  "Digital Signage KMI 2000 Series",
  "Digital Signage KMI 2300",
  "LED Outdoor for Fixed Installation",
  "LED Indoor for Fixed Installation",
];

export function getProductTitle(productName) {
  return PRODUCT_TITLES[productName] || productName;
}

export function getAvailableViews(product) {
  const viewKeys = ["front", "left", "right", "side", "back"];
  const viewLabels = {
    front: "Front View",
    left: "Left View",
    right: "Right View",
    side: "Side View",
    back: "Back View",
  };

  return viewKeys
    .filter((key) => product.images?.[key])
    .map((key) => ({
      key,
      label: viewLabels[key],
      src: product.images[key],
    }));
}

export function getCurrentImageData(product, selectedView, processHotspots) {
  const availableViews = getAvailableViews(product);
  const currentView = availableViews.find((view) => view.key === selectedView);

  if (!currentView && availableViews.length > 0) {
    return { src: availableViews[0].src, hotspots: [] };
  }
  if (!currentView) return { src: "", hotspots: [] };

  let hotspots = [];
  if (selectedView === "front") {
    hotspots = processHotspots(product.hotspots || []);
  } else if (selectedView === "back") {
    hotspots = processHotspots(product.back_hotspots || []);
  } else if (selectedView === "side") {
    hotspots = processHotspots(product.side_hotspots || []);
  }

  return { src: currentView.src, hotspots };
}

export function getMenuButtons(
  product,
  onBackToHome,
  onNavigateToSpec,
  onNavigateToImplementation,
  handleApplicationClick,
  setIsDownloadPopupOpen
) {
  const baseButtons = [
    {
      id: "product",
      label: "Homepage",
      icon: "/icons/icon-home.svg",
      onClick: onBackToHome,
    },
    {
      id: "spec",
      label: "Specification",
      icon: "/icons/icon-specification.svg",
      onClick: onNavigateToSpec,
    },
  ];

  const implementationButton = {
    id: "implementation",
    label: "Implementation",
    icon: "/icons/icon-implementation.svg",
    onClick: onNavigateToImplementation,
  };

  const endButtons = [
    {
      id: "applications",
      label: "Applications",
      icon: "/icons/icon-application.svg",
      onClick: handleApplicationClick,
    },
    {
      id: "download",
      label: "Download PDF",
      icon: "/icons/icon-download.svg",
      onClick: () => setIsDownloadPopupOpen(true),
    },
  ];

  return PRODUCTS_WITHOUT_IMPLEMENTATION.includes(product.name)
    ? [...baseButtons, ...endButtons]
    : [...baseButtons, implementationButton, ...endButtons];
}
