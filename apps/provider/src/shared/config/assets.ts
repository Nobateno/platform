export const productImagePaths = [
  "/assets/images/products/product1-400x400.jpg",
  "/assets/images/products/product2-400x400.jpg",
  "/assets/images/products/product3-400x400.jpg",
  "/assets/images/products/product4-400x400.jpg",
  "/assets/images/products/product5-400x400.jpg",
  "/assets/images/products/product6-400x400.jpg",
  "/assets/images/products/product7-400x400.jpg",
  "/assets/images/products/product8-400x400.jpg",
  "/assets/images/products/product9-400x400.jpg",
  "/assets/images/products/product10-400x400.jpg",
] as const;

export type ProductImagePath = (typeof productImagePaths)[number];

export const productImageAssets = Object.fromEntries(
  productImagePaths.map((path) => [path, { default: path }] as const)
) as Record<ProductImagePath, { readonly default: ProductImagePath }>;
