import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <div className="footer__border">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 768 48"
          preserveAspectRatio="none"
        >
          <path
            d="M241.283 15.337C98.3615 29.6176 20.877 18.502 0 11.1592V48H768V21.4138C646.845 -9.72996 419.936 -2.51371 241.283 15.337Z"
          ></path>
        </svg>
      </div>
      <footer className="main-footer bg-section dark-section text-center">
        <div className="container-fluid text-center">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="footer-about">
                <div className="footer-logo mb-3">
                  <img src="/img/melova_logo.png" alt="Melova Logo" />
                </div>


                <div className="footer-menu mb-3">
                  <ul className="list-inline text-center">
                    <li className="list-inline-item">
                      <Link href="/">Home</Link>
                    </li>
                    <li className="list-inline-item">
                      <Link href="/about">About Us</Link>
                    </li>
                    <li className="list-inline-item">
                      <Link href="/products">Products</Link>
                    </li>
                    <li className="list-inline-item">
                      <Link href="/blog">Blogs</Link>
                    </li>
                    <li className="list-inline-item">
                      <Link href="/contact">Contact Us</Link>
                    </li>
                  </ul>
                </div>
          
                <div className="footer-contact-item mb-3">
                  <h3>
                    <a href="tel:+971543072440">+971 54 307 2440</a>
                  </h3>
                  <p></p>
                </div>
                {/* Footer Contact Item End */}
              </div>
              {/* Footer About End */}

              {/* Footer Newsletter Form Start */}
              <div className="footer-newsletter-form">
                {/* Footer Social Links Start */}
                <div className="footer-social-links">
                  <h3>Follow Us On Socials:</h3>
                  <ul className="list-inline">
                    <li className="list-inline-item">
                      <a href="https://www.instagram.com/mymelova/">
                        <i className="fa-brands fa-instagram"></i>
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a href="#">
                        <i className="fa-brands fa-facebook-f"></i>
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a href="#">
                        <i className="fa-brands fa-youtube"></i>
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a href="#">
                        <i className="fa-brands fa-linkedin-in"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="footer-copyright">
                <div className="footer-copyright-text">
                  <p>Copyright © 2025 All Rights Reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>  
      </footer>
    </>
  );
}
