import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/product-data";
import ProductsScroll from "@/components/ProductsScroll";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      {/* Hero Section Start */}
      <div className="hero hero-bg-image hero-video bg-section">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-12">
              {/* Hero Box Start */}
              <div className="hero-box">
                {/* Video Start */}
                <div className="hero-bg-video">
                  {/* Selfhosted Video Start */}
                  <video autoPlay muted loop id="myvideo">
                    <source src="/img/backeri-video.mp4" type="video/mp4" />
                  </video>
                </div>
                {/* Video End */}

                {/* Hero Content Start */}
                <div className="hero-content dark-section">
                  {/* Section Title Start */}
                  <div className="section-title deep">
                    <h1 className="text-anime-style-2" data-cursor="-opaque">
                      Every piece of chocolate is <br />
                      made fresh with love.
                    </h1>
                    <p
                      className="wow fadeInUp"
                      style={{ color: "#ffffffc2" }}
                      data-wow-delay="0.2s"
                    >
                      Rich flavors, smooth textures, and artisanal care, crafted
                      to make every mood sweeter and every memory richer.
                    </p>
                  </div>
                  {/* Section Title End */}

                  {/* Hero Body Start */}
                  <div className="hero-body wow fadeInUp" data-wow-delay="0.4s">
                    {/* Hero Button Start */}
                    <div className="hero-btn">
                      <Link href="/products" className="btn-default">
                        Explore More
                      </Link>
                    </div>
                  </div>
                  {/* Hero Body End */}
                </div>
                {/* Hero Content End */}
              </div>
              {/* Hero Box End */}
            </div>
          </div>
        </div>
      </div>
      {/* Hero Section End */}

      {/* Our Products Section Start */}
      <div className="our-products bg-section">
        <div className="container">
          <div className="row section-row">
            <div className="col-lg-12">
              <div className="section-title section-title-center">
                <h3 className="wow fadeInUp">
                  Here are some of our finest products.
                </h3>
                <h2 className="text-anime-style-2" data-cursor="-opaque">
                  Melting Hearts, One Creation at a Time
                </h2>
              </div>
            </div>
          </div>

          <ProductsScroll products={products} />

          {/* Footer Text */}
          <div className="section-footer-text wow fadeInUp">
            <p>
              Taste the luxury of handcrafted cocoa delights –{" "}
              <Link href="/contact">order your chocolates today!</Link>
            </p>
          </div>
        </div>
      </div>
      {/* Our Products Section End */}

      {/* About Us Section Start */}
      <div className="about-us project-cover">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              {/* About Us Content Start */}
              <div className="about-us-content">
                <style>{`
                  @media only screen and (max-width: 900px) {
                    .about-image img { max-width: 738px!important; }
                    .about-us-content { text-align: center!important; }
                  }
                `}</style>
                {/* Section Title Start */}
                <div className="section-title about">
                  <h3 className="wow fadeInUp">Melt in Bites</h3>
                  <h2 className="text-anime-style-2" data-cursor="-opaque">
                    Melova
                    <br />
                    Pistachio Kunafa
                    <br />
                    <span>
                      Chocolate Bar <span>(200g)</span>
                    </span>
                  </h2>
                </div>
                {/* Section Title End */}

                {/* About Us Button Start */}
                <div
                  className="about-us-btn wow fadeInUp"
                  data-wow-delay="0.8s"
                >
                  <Link href="/products" className="btn-default">
                    Discover
                  </Link>
                </div>
                {/* About Us Button End */}
              </div>
              {/* About Us Content End */}
            </div>

            <div className="col-lg-6">
              {/* About Us Images Start */}
              <div className="about-us-images">
                {/* About Image Start */}
                <div className="about-image relative h-[500px]">
                  <Image
                    src="/img/melova-11.png"
                    alt="Finest Chocolates"
                    fill
                    className="move-img object-contain"
                  />
                </div>
                {/* About Image End */}
              </div>
              {/* About Us Images End */}
            </div>
          </div>
        </div>
      </div>
      {/* About Us Section End */}

      {/* Our Special Offers Section Start */}
      <div className="our-special-offers bg-section">
        <div className="container">
          <div className="row section-row">
            <div className="col-lg-12">
              {/* Section Title Start */}
              <div className="section-title section-title-center">
                <h3 className="wow fadeInUp">
                  Unwrap happiness with our seasonal delights
                </h3>
                <h2 className="text-anime-style-2" data-cursor="-opaque">
                  Irresistible Chocolate Treats and Limited-Time Specials
                </h2>
              </div>
              {/* Section Title End */}
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-4 col-md-6 order-1">
              {/* Offers Item List Start */}
              <div className="offers-item-list offer-list-1">
                <div className="offer-item wow fadeInUp">
                  <div className="offer-image relative h-48 w-48 mx-auto">
                    <Image src="/img/products/item-4.png" alt="Angel Chocolate Bars" fill className="object-contain" />
                  </div>
                  <div className="offer-item-content">
                    <h2>ANGEL CHOCOLATE BARS</h2>
                    <p>
                      Rich, velvety chocolate truffles with a melt-in-mouth
                      center.
                    </p>
                  </div>
                </div>

                <div className="offer-item wow fadeInUp" data-wow-delay="0.2s">
                  <div className="offer-image relative h-48 w-48 mx-auto">
                    <Image src="/img/products/item-5.png" alt="Pistachio Kunafa" fill className="object-contain" />
                  </div>
                  <div className="offer-item-content">
                    <h2>
                      PISTACHIO
                      <br />
                      KUNAFA
                    </h2>
                    <p>
                      Decadent dark chocolate blended with creamy cocoa fudge.
                    </p>
                  </div>
                </div>
              </div>
              {/* Offers Item List End */}
            </div>

            <div className="col-lg-4 order-lg-2 order-md-3 order-2">
              <div className="best-offer-image-box">
                <div className="best-offer-content wow fadeInUp">
                  <h2>Best Offers</h2>
                  <p>Premium chocolate experiences at prices you’ll love!</p>
                  <Link href="/contact" className="readmore-btn">
                    View all offers
                  </Link>
                </div>
                <div
                  className="best-offer-image wow fadeInUp"
                  data-wow-delay="0.2s"
                >
                  <figure className="relative h-80 w-full">
                    <Image src="/img/offer.png" alt="Best Offers" fill className="object-contain" />
                  </figure>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 order-lg-3 order-md-2 order-3">
              {/* Offers Item List Start */}
              <div className="offers-item-list offer-list-2">
                <div className="offer-item wow fadeInUp">
                  <div className="offer-image relative h-48 w-48 mx-auto">
                    <Image src="/img/products/item-7.png" alt="Melova Dates Chocolate" fill className="object-contain" />
                  </div>
                  <div className="offer-item-content">
                    <h2>MELOVA DATES CHOCOLATE</h2>
                    <p>
                      Soft sponge cake with a gooey molten chocolate center.
                    </p>
                  </div>
                </div>

                <div className="offer-item wow fadeInUp" data-wow-delay="0.2s">
                  <div className="offer-image relative h-48 w-48 mx-auto">
                    <Image src="/img/products/item-8.png" alt="Melova Dates Chocolate Premium" fill className="object-contain" />
                  </div>
                  <div className="offer-item-content">
                    <h2>MELOVA DATES CHOCOLATE</h2>
                    <p>
                      Crunchy roasted almonds dipped in smooth milk chocolate.
                    </p>
                  </div>
                </div>
              </div>
              {/* Offers Item List End */}
            </div>
          </div>
        </div>
      </div>
      {/* Our Special Offers Section End */}

      {/* Our Services Section Start */}
      <div
        className="our-services bg-section"
        style={{
          background:
            "var(--accent-color) url('/img/banner.png') center/cover no-repeat",
        }}
      >
        <div className="container">
          <div className="row service-item-list">
            <div className="col-lg-12">
              <div className="about-us-item-list">
                <div className="about-us-item wow fadeInUp">
                  <div className="icon-box">
                    <Image src="/images/icon-about-us-item-1.svg" alt="Precision Icon" width={60} height={60} />
                  </div>
                  <div className="about-us-item-content">
                    <h3>Precision-Crafted Chocolates</h3>
                    <p>
                      Made with exacting standards for perfect taste and
                      texture.
                    </p>
                  </div>
                </div>

                <div
                  className="about-us-item wow fadeInUp"
                  data-wow-delay="0.2s"
                >
                  <div className="icon-box">
                    <Image src="/images/icon-about-us-item-2.svg" alt="Eco Packaging Icon" width={60} height={60} />
                  </div>
                  <div className="about-us-item-content">
                    <h3>Eco-Friendly Packaging</h3>
                    <p>
                      Thoughtfully packaged to protect both your chocolates and
                      the planet.
                    </p>
                  </div>
                </div>

                <div
                  className="about-us-item wow fadeInUp"
                  data-wow-delay="0.4s"
                >
                  <div className="icon-box">
                    <Image src="/images/icon-about-us-item-3.svg" alt="Freshness Icon" width={60} height={60} />
                  </div>
                  <div className="about-us-item-content">
                    <h3>Guaranteed Freshness</h3>
                    <p>
                      Chocolates made daily to ensure peak taste and quality.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Our Services Section End */}

      {/* Our Blog Section Start */}
      <div className="our-blog bg-section">
        <div className="container">
          <div className="row section-row">
            <div className="col-lg-12">
              <div className="section-title section-title-center">
                <h3 className="wow fadeInUp">Latest blog</h3>
                <h2 className="text-anime-style-2" data-cursor="-opaque">
                  Bite-Sized Stories: Discover, Learn, and Explore
                </h2>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="post-item wow fadeInUp">
                <div className="post-featured-image">
                  <Link href="/work-of-art" data-cursor-text="View">
                    <figure className="image-anime relative h-64">
                      <Image src="/img/post-1.jpg" alt="Melova Chocolate Art" fill className="object-cover" />
                    </figure>
                  </Link>
                </div>
                <div className="post-item-body">
                  <div className="post-item-content">
                    <h2>
                      <Link href="/work-of-art">Melova Chocolate Art</Link>
                    </h2>
                  </div>
                  <div className="post-item-btn">
                    <Link href="/work-of-art" className="readmore-btn">
                      read more
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="post-item wow fadeInUp">
                <div className="post-featured-image">
                  <Link href="/luxury-in-every-bite" data-cursor-text="View">
                    <figure className="image-anime relative h-64">
                      <Image src="/img/post-2.jpg" alt="Luxury Melova Chocolate" fill className="object-cover" />
                    </figure>
                  </Link>
                </div>
                <div className="post-item-body">
                  <div className="post-item-content">
                    <h2>
                      <Link href="/luxury-in-every-bite">
                        Luxury Melova Chocolate Bite
                      </Link>
                    </h2>
                  </div>
                  <div className="post-item-btn">
                    <Link href="/luxury-in-every-bite" className="readmore-btn">
                      read more
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="post-item wow fadeInUp">
                <div className="post-featured-image">
                  <Link href="/the-melova-story" data-cursor-text="View">
                    <figure className="image-anime relative h-64">
                      <Image src="/img/post-3.jpg" alt="The Melova Story" fill className="object-cover" />
                    </figure>
                  </Link>
                </div>
                <div className="post-item-body">
                  <div className="post-item-content">
                    <h2>
                      <Link href="/the-melova-story">
                        The Melova Story - From Passion to Perfection
                      </Link>
                    </h2>
                  </div>
                  <div className="post-item-btn">
                    <Link href="/the-melova-story" className="readmore-btn">
                      read more
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Our Blog Section End */}
    </>
  );
}
