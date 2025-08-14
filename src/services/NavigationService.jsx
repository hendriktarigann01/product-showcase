// services/navigationService.js
import { getProductSlug } from "../constants/ProductMappings";

export class NavigationService {
  static getBasePath(isLED) {
    return isLED ? "/led-display" : "/lcd-display";
  }

  static getHomePathWithProduct(isLED, productSlug) {
    const basePath = this.getBasePath(isLED);
    return productSlug ? `${basePath}?selected=${productSlug}` : basePath;
  }

  static getProductPath(isLED, productSlug) {
    const basePath = this.getBasePath(isLED);
    return `${basePath}/${productSlug}`;
  }

  static getProductSubPath(isLED, productSlug, subPath) {
    const productPath = this.getProductPath(isLED, productSlug);
    return `${productPath}/${subPath}`;
  }

  static generateProductRoutes(isLED = false) {
    const products = isLED
      ? ["led-outdoor", "led-indoor", "led-poster"]
      : [
          "kmi-7000-series",
          "kmi-8000",
          "kmi-2000-series",
          "kmi-2300-series",
          "kmi-4100-and-4200",
        ];

    const basePath = this.getBasePath(isLED);

    return products.flatMap((slug) => [
      {
        path: `${basePath}/${slug}`,
        type: "detail",
        slug,
        isLED,
      },
      {
        path: `${basePath}/${slug}/specification`,
        type: "specification",
        slug,
        isLED,
      },
      {
        path: `${basePath}/${slug}/implementation`,
        type: "implementation",
        slug,
        isLED,
      },
      {
        path: `${basePath}/${slug}/application`,
        type: "application",
        slug,
        isLED,
      },
    ]);
  }

  static buildProductNavigationHandlers(navigate, product, isLED, slug) {
    const basePath = this.getBasePath(isLED);

    return {
      handleNavigateToSpec: () => navigate(`${basePath}/${slug}/specification`),
      handleNavigateToImplementation: () =>
        navigate(`${basePath}/${slug}/implementation`),
      handleNavigateToApplication: () =>
        navigate(`${basePath}/${slug}/application`),
      handleBackToHome: (productSlug) => {
        const homeUrl = this.getHomePathWithProduct(isLED, productSlug);
        navigate(homeUrl);
      },
    };
  }
}
