import React from "react";
import Link from "next/link";
import { getProducts } from "@/lib/product-data";

export const metadata = {
  title: "Our Chocolates Products | MyMelova Chocolate Factory",
  description:
    "MyMelova’s handcrafted chocolate bars made with the finest cocoa. From classic milk chocolate to rich dark blends, our artisanal bars deliver indulgence in every bite.",
};

export default async function Products() {
  const products = await getProducts();

  return (
    <>
      {/* Page Header Start */}
      <div className="page-header bg-section parallaxie">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <div className="page-header-box">
                <h1 className="text-anime-style-2" data-cursor="-opaque">
                  Our <span>products</span>
                </h1>
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="/">home</Link>
                    </li>
                    <li className="bread" aria-current="page">
                      products
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Header End */}

      {/* Product Page Start */}
      <div className="page-product bg-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="our-product-box row">
                {products.map((product) => (
                  <div className="col-lg-3" key={product.id}>
                    <Link href={`/products/${product.id}`}>
                      <div
                        className="product-item wow fadeInUp"
                        data-wow-delay="0.6s"
                      >
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
            </div>
          </div>
        </div>
      </div>
      {/* Product Page End */}
    </>
  );
}
