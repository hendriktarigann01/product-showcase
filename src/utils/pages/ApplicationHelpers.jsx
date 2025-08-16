export const isLEDOutdoorProduct = (product) => {
  return (
    product?.name?.toLowerCase().includes("outdoor") &&
    product?.name?.toLowerCase().includes("led")
  );
};

// Helper function to get the correct image source
export const getImageSource = (appImage, product) => {
  if (isLEDOutdoorProduct(product)) {
    return appImage.image_full;
  }
  return appImage.image;
};

// Calculate responsive positioning and sizing
export const getResponsiveStyle = (originalStyle, containerDimensions) => {
  const scaleX = containerDimensions.width / 910;
  const scaleY = containerDimensions.height / 490;

  return {
    left: originalStyle.left * scaleX,
    top: originalStyle.top * scaleY,
    width: originalStyle.width * scaleX,
    height: originalStyle.height * scaleY,
    zIndex: originalStyle.zIndex,
  };
};

// Calculate responsive hotspot positioning
export const getResponsiveHotspotPosition = (x, y) => {
  return {
    x: x,
    y: y,
  };
};

// Generate composite hotspots from app data
export const generateCompositeHotspots = (
  appRooms,
  appImages,
  handleImageClick
) => {
  let compositeHotspots = [];

  if (appRooms.length > 0) {
    compositeHotspots = appRooms.map((room) => ({
      ...room,
      onClick: () => handleImageClick(room.appId),
    }));
  } else if (appImages.length > 0) {
    compositeHotspots = appImages.map((app, index) => ({
      id: `hotspot-${app.id}`,
      appId: app.id,
      title: app.title,
      x: 20 + index * 25,
      y: 30 + index * 20,
      onClick: () => handleImageClick(app.id),
      style: {
        width: 200,
        height: 150,
        left: 10 + index * 30,
        top: 20 + index * 25,
        zIndex: 1,
      },
    }));
  }

  return compositeHotspots;
};
