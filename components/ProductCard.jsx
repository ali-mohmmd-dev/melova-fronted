import React from "react";
import Link from "next/link";

export default function ProductCard({ product, delay = "0.6s" }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="product-item wow fadeInUp" data-wow-delay={delay}>
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-item-body">
          <div className="product-rating">
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
          </div>
          <div className="product-item-content">
            <h2>{product.title || product.name}</h2>
            {product.price && (
              <p className="product-price">₹{product.price}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
