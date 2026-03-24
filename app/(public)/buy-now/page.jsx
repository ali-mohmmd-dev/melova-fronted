import React from "react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Melova | Where to Buy",
};

export default function BuyNow() {
  return (
    <>
      {/* Page Header Start */}
      <div className="page-header bg-section parallaxie">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <div className="page-header-box">
                <h1 className="text-anime-style-2" data-cursor="-opaque">
                  <span>Where to</span> Buy
                </h1>
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="/">home</Link>
                    </li>
                    <li className="bread" aria-current="page">
                      Where to Buy
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Header End */}

      <div className="our-products bg-section">
        <div className="container">
          <div className="row section-row">
            <div className="col-lg-12">
              <div className="section-title section-title-center">
                <h3 className="wow fadeInUp">Where to Buy</h3>
                <h2 className="text-anime-style-2" data-cursor="-opaque">
                  <span>Buy our Chocolates from our </span> Official Store
                </h2>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="product-item wow fadeInUp">
                <div>
                  <figure className="image-anime relative h-64">
                    <Image src="/img/hawocart.png" alt="Hawocart" fill className="object-contain" />
                  </figure>
                </div>
                <div className="product-item-content">
                  <h3 style={{ textDecoration: "underline" }}>Buy Now</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
