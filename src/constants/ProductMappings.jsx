export const PRODUCT_SLUGS = {
  // LCD Products
  "Interactive Whiteboard KMI 7000 Series": "kmi-7000-series",
  "Video Wall KMI 8000": "kmi-8000",
  "Digital Signage KMI 2000 Series": "kmi-2000-series",
  "Digital Signage KMI 2300": "kmi-2300-series",
  "Digital Kiosk Signage KMI 4100 & 4200": "kmi-4100-and-4200",
  // LED Products
  "LED Outdoor for Fixed Installation": "led-outdoor",
  "LED Indoor for Fixed Installation": "led-indoor",
  "LED Poster Display": "led-poster",
};

export const SLUG_TO_NAME = Object.fromEntries(
  Object.entries(PRODUCT_SLUGS).map(([name, slug]) => [slug, name])
);

export const getProductSlug = (productName) => {
  return (
    PRODUCT_SLUGS[productName] || productName.toLowerCase().replace(/\s+/g, "-")
  );
};

export const getProductNameFromSlug = (slug) => {
  return SLUG_TO_NAME[slug];
};
