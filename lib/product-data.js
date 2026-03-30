import api from "./axios";

export async function getProducts() {
  try {
    const res = await api.get("api/shop/products/", {
      params: { revalidate: 60 },
      timeout: 5000,
    });

    const data = res.data;
    const products = Array.isArray(data) ? data : data.results;

    if (!Array.isArray(products) || products.length === 0)
      throw new Error("Empty");

    // Normalize for UI
    return products.map(p => ({
      id: p.id,
      name: p.title,
      intro: p.introduction,
      description: p.details,
      image: p.image,
      price: p.price,
      variants: p.variants
    }));

  } catch (error) {
    console.error("Error in getProducts:", error.message);
    return fallbackProducts;
  }
}

export async function getProduct(id) {
  try {
    const res = await api.get(`api/shop/products/${id}/`, {
      params: { revalidate: 60 },
      timeout: 5000,
    });

    const data = res.data;
    return data;
  } catch (error) {
    console.error(`Error in getProduct(${id}):`, error.message);
    return null;
  }
}