import { products } from "../data/product";
import { products_led } from "../data/product_led";
import { getProductNameFromSlug } from "../constants/ProductMappings";

export class ProductService {
  static getProducts(isLED = false) {
    return isLED ? products_led : products;
  }

  static getProductBySlug(slug, isLED = false) {
    const productList = this.getProducts(isLED);
    const productName = getProductNameFromSlug(slug);

    if (!productName) {
      return { product: null, productIndex: -1 };
    }

    const product = productList.find((p) => p.name === productName);
    const productIndex = productList.findIndex((p) => p.name === productName);

    return { product, productIndex };
  }

  static findProductIndex(products, productName) {
    return products.findIndex((p) => p.name === productName);
  }

  static getProductByIndex(products, index) {
    return products[index] || null;
  }
}
