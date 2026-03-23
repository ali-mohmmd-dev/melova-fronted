"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export default function ProductDetailsClient({ product }) {
  const router = useRouter();
  const { token } = useAuth();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const variants = product.variants || [];
  const selectedVariant =
    variants.length > 0 ? variants[selectedVariantIndex] : null;

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentImages =
    selectedVariant && selectedVariant.image
      ? selectedVariant.image
      : [product.image];

  // Swiper state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleAddToCart = async (e, silent = false) => {
    if (e) e.preventDefault();
    if (!token) {
      alert("Please login to add items to cart.");
      router.push("/login?redirect=" + window.location.pathname);
      return false;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/";
      await axios.post(
        `${API_URL}api/shop/cart/add_item/`,
        { variant_id: selectedVariant.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Trigger header refresh
      window.dispatchEvent(new Event("cartUpdated"));
      if (!silent) alert("Added to cart!");
      return true;
    } catch (err) {
      console.error("Error adding to cart:", err);
      if (!silent) alert("Failed to add to cart.");
      return false;
    }
  };

  const handleOrderNow = async (e) => {
    if (e) e.preventDefault();
    const added = await handleAddToCart(null, true);
    if (added) {
      router.push("/cart");
    }
  };

  return (
    <>
      {/* Product Image */}
      <div className="col-lg-6 mb-4">
        <div className="product-details-image wow fadeInUp">
          <div
            className="swiper productDetailSwiper"
            style={{ overflow: "hidden", position: "relative" }}
          >
            <div
              className="swiper-wrapper"
              style={{
                display: "flex",
                transition: "transform 0.3s ease",
                transform: `translateX(-${activeImageIndex * 100}%)`,
              }}
            >
              {currentImages.map((img, i) => (
                <div
                  className="swiper-slide"
                  key={i}
                  style={{ flex: "0 0 100%", minWidth: "100%" }}
                >
                  <img
                    src={img}
                    alt={`${product.title || product.name} image ${i + 1}`}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "15px",
                      aspectRatio: "1/1",
                      objectFit: "cover",
                      
                    }}
                  />
                </div>
              ))}
            </div>

            {currentImages.length > 1 && (
              <>
                <div
                  className="swiper-button-next scroll-btn"
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      Math.min(prev + 1, currentImages.length - 1),
                    )
                  }
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    cursor: "pointer",
                    background: "#fff",
                    borderRadius: "50%",
                    padding: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  &rarr;
                </div>
                <div
                  className="swiper-button-prev scroll-btn"
                  onClick={() =>
                    setActiveImageIndex((prev) => Math.max(prev - 1, 0))
                  }
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    cursor: "pointer",
                    background: "#fff",
                    borderRadius: "50%",
                    padding: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  &larr;
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="col-lg-6">
        <div
          className="product-details-content wow fadeInUp"
          data-wow-delay="0.2s"
        >
          <h1 id="productName" className="text-anime-style-2">
            {product.title || product.name}
          </h1>

          <div className="product-price mt-3 mb-3">
            <h3 className="text-primary">
              Starting from ₹
              <span className="productPrice">{currentPrice}</span>
            </h3>
          </div>

          <div className="product-description mb-4">
            <p className="lead">{product.introduction || product.intro}</p>
            <p>{product.description}</p>
          </div>

          {/* Variants Selection */}
          {variants.length > 0 && (
            <div className="product-variants mb-4">
              <h5>Available Sizes:</h5>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {variants.map((variant, index) => (
                  <button
                    key={variant.id}
                    className={`btn btn-outline-dark variant-btn ${index === selectedVariantIndex ? "active bg-dark text-white" : ""}`}
                    onClick={() => {
                      setSelectedVariantIndex(index);
                      setActiveImageIndex(0); // Reset slider when variant changes
                    }}
                  >
                    {variant.name} - {variant.gram}g
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="product-actions mt-5 d-flex flex-wrap gap-3">
            <button
              className="btn-default"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button
              className="btn-default bg-dark text-white border-0"
              onClick={handleOrderNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
