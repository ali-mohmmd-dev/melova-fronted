import React from "react";
import Link from "next/link";
import { getProducts } from "@/lib/product-data";
import ProductDetailsClient from "@/components/ProductDetailsClient";

export async function generateMetadata({ params }) {
  const products = await getProducts();
  const product = products.find((p) => p.id === parseInt(params.id));

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.title || product.name} | MyMelova Chocolate Factory`,
    description: product.introduction || product.intro,
  };
}

export default async function ProductDetailsPage({ params }) {
  const resolvedParams = await params;
  const products = await getProducts();
  const product = products.find((p) => p.id === parseInt(resolvedParams.id));

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-4">Product not found</h2>
        <Link href="/products" className="btn-default">
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="product-details-page bg-section">
      <div className="container">
        <div className="row">
          <ProductDetailsClient product={product} />
        </div>
      </div>
    </div>
  );
}
