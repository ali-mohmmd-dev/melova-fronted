export async function getProducts() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/";
    const res = await fetch(`${API_URL}api/shop/products/`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();
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