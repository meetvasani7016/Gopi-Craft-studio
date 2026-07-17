import type { Product, ShopFilters } from "@/types";
import { products } from "@/data/products";

export function filterProducts(allProducts: Product[], filters: ShopFilters): Product[] {
  let result = [...allProducts];

  if (filters.search) {
    const query = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query) ||
        p.tags.some((t) => t.includes(query)) ||
        p.category.name.toLowerCase().includes(query)
    );
  }

  if (filters.categories?.length) {
    result = result.filter((p) => filters.categories!.includes(p.category.slug));
  }

  if (filters.priceMin !== undefined) {
    result = result.filter((p) => p.price.amount >= filters.priceMin!);
  }

  if (filters.priceMax !== undefined) {
    result = result.filter((p) => p.price.amount <= filters.priceMax!);
  }

  if (filters.materials?.length) {
    result = result.filter((p) => p.material && filters.materials!.includes(p.material));
  }

  if (filters.occasions?.length) {
    result = result.filter((p) =>
      p.occasion?.some((o) => filters.occasions!.includes(o))
    );
  }

  if (filters.inStock) {
    result = result.filter((p) => p.inStock);
  }

  if (filters.customizable) {
    result = result.filter((p) => p.customizable);
  }

  if (filters.collection === "limited-edition") {
    result = result.filter((p) => p.badges?.includes("limited"));
  }

  return result;
}

export function sortProducts(allProducts: Product[], sort?: string): Product[] {
  const result = [...allProducts];

  switch (sort) {
    case "newest":
      return result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "price-asc":
      return result.sort((a, b) => a.price.amount - b.price.amount);
    case "price-desc":
      return result.sort((a, b) => b.price.amount - a.price.amount);
    case "bestselling":
      return result.sort((a, b) => {
        const aBS = a.badges?.includes("bestseller") ? 1 : 0;
        const bBS = b.badges?.includes("bestseller") ? 1 : 0;
        return bBS - aBS || b.reviewCount - a.reviewCount;
      });
    case "rating":
      return result.sort((a, b) => b.rating - a.rating);
    default:
      return result;
  }
}

export function getShopProducts(filters: ShopFilters): Product[] {
  const filtered = filterProducts(products, filters);
  return sortProducts(filtered, filters.sort);
}

export function searchAll(query: string) {
  const q = query.toLowerCase();
  const matchedProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q))
  );

  return { products: matchedProducts, query };
}
