"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";

export default function ProductsScroll({ products }) {
  const scrollerRef = useRef(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    function step() {
      return Math.max(260, Math.floor(scroller.clientWidth * 0.9));
    }

    const handleKeydown = (e) => {
      if (e.key === "ArrowRight")
        scroller.scrollBy({ left: step(), behavior: "smooth" });
      if (e.key === "ArrowLeft")
        scroller.scrollBy({ left: -step(), behavior: "smooth" });
    };

    scroller.addEventListener("keydown", handleKeydown);

    return () => {
      scroller.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  const slideLeft = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({
        left: -Math.max(260, Math.floor(scrollerRef.current.clientWidth * 0.9)),
        behavior: "smooth",
      });
    }
  };

  const slideRight = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({
        left: Math.max(260, Math.floor(scrollerRef.current.clientWidth * 0.9)),
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="products-scroll-wrap">
      <button
        className="scroll-btn left"
        aria-label="Scroll left"
        onClick={slideLeft}
      >
        &larr;
      </button>

      <div
        className="products-scroll"
        id="productsScroll"
        tabIndex="0"
        aria-label="Our products (horizontal scroll)"
        ref={scrollerRef}
      >
        {products.map((product) => (
          <div className="col-lg-3" key={product.id}>
            <Link href={`/products/${product.id}`}>
              <div className="product-item wow fadeInUp" data-wow-delay="0.6s">
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
                    <h2>{product.name}</h2>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <button
        className="scroll-btn right"
        aria-label="Scroll right"
        onClick={slideRight}
      >
        &rarr;
      </button>
    </div>
  );
}
