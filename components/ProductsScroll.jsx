"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";

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
            <ProductCard product={product} />
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
