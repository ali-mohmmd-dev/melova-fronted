"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style jsx>{`
        .main-menu ul li a {
          font-size: 20px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .main-menu ul li a:hover,
        .main-menu ul li a:focus {
          color: #c6a64c;
        }
        .header-social-links ul li a i {
          font-size: 20px;
          color: #c6a64c;
        }
        .profile-dropdown {
          position: relative;
          margin-left: 1rem;
        }
        .profile-btn {
          background: linear-gradient(135deg, #8b4513 0%, #d2691e 100%);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 25px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .profile-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(139, 69, 19, 0.3);
        }
        .profile-btn i {
          font-size: 1.2rem;
        }
        .dropdown-menu-custom {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          min-width: 200px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s ease;
          z-index: 1000;
        }
        .profile-dropdown.active .dropdown-menu-custom {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .dropdown-menu-custom a {
          display: block;
          padding: 0.75rem 1.25rem;
          color: #333;
          text-decoration: none;
          transition: all 0.2s ease;
          border-bottom: 1px solid #f0f0f0;
        }
        .dropdown-menu-custom a:hover {
          background: #f8f9fa;
          color: #8b4513;
          padding-left: 1.5rem;
        }
        @media (max-width: 991px) {
          .profile-dropdown {
            margin-left: 0;
            margin-top: 1rem;
          }
        }
      `}</style>
      <header className="main-header bg-section">
        <div className="header-sticky">
          <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
              {/* Logo */}
              <Link className="navbar-brand" href="/">
                <img src="/img/melova_logo.png" alt="Logo" />
              </Link>
              {/* Desktop Menu */}
              <div className="collapse navbar-collapse main-menu d-none d-lg-flex">
                <div className="nav-menu-wrapper">
                  <ul className="navbar-nav mr-auto" id="menu">
                    <li className="nav-item">
                      <Link className="nav-link" href="/about">
                        Our Story
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" href="/products">
                        Chocolates
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" href="/buy-now">
                        Where to Buy
                      </Link>
                    </li>
                  </ul>
                </div>
                {/* Profile Button */}
                <div
                  className={`profile-dropdown me-3 ${profileDropdownOpen ? "active" : ""}`}
                  ref={dropdownRef}
                >
                  {isLoggedIn ? (
                    <>
                      <button
                        className="profile-btn"
                        onClick={() =>
                          setProfileDropdownOpen(!profileDropdownOpen)
                        }
                      >
                        <i className="fas fa-user-circle"></i>
                        <span>{userName}</span>
                        <i
                          className="fas fa-chevron-down"
                          style={{ fontSize: "0.8rem" }}
                        ></i>
                      </button>
                      <div className="dropdown-menu-custom">
                        <Link href="/admin">
                          <i className="fas fa-tachometer-alt"></i> Dashboard
                        </Link>
                        <Link href="/profile">
                          <i className="fas fa-user"></i> My Profile
                        </Link>
                        <Link href="/orders">
                          <i className="fas fa-shopping-bag"></i> My Orders
                        </Link>
                        <a href="#logout">
                          <i className="fas fa-sign-out-alt"></i> Logout
                        </a>
                      </div>
                    </>
                  ) : (
                    <button
                      className="profile-btn"
                      onClick={() => (window.location.href = "/login")}
                    >
                      <i className="fas fa-user"></i> Login
                    </button>
                  )}
                </div>
                {/* Button */}
                <div className="header-btn">
                  <Link href="/contact" className="btn-default">
                    Reach Us
                  </Link>
                </div>
              </div>
              {/* Mobile Hamburger */}
              <button
                className="menu-toggle d-lg-none"
                onClick={() => setSideMenuOpen(true)}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </nav>
          {/* Mobile Side Menu */}
          <div
            className={`responsive-menu ${sideMenuOpen ? "active" : ""}`}
            id="sideMenu"
          >
            <button
              className="close-btn"
              onClick={() => setSideMenuOpen(false)}
            >
              &times;
            </button>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">Our Story</Link>
              </li>
              <li>
                <Link href="/products">Chocolates</Link>
              </li>
              <li>
                <Link href="/buy-now">Where to Buy</Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li>
                    <Link href="/admin">Dashboard</Link>
                  </li>
                  <li>
                    <Link href="/profile">My Profile</Link>
                  </li>
                  <li>
                    <Link href="/orders">My Orders</Link>
                  </li>
                  <li>
                    <a href="#logout">Logout</a>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/login">Login</Link>
                </li>
              )}
            </ul>
            <div className="side-extra">
              <Link href="/contact" className="btn-default">
                Reach Us
              </Link>
            </div>
          </div>
          {/* Dark Overlay */}
          <div
            className={`overlay ${sideMenuOpen ? "active" : ""}`}
            onClick={() => setSideMenuOpen(false)}
            style={{ display: sideMenuOpen ? "block" : "none" }}
          ></div>
        </div>
      </header>
    </>
  );
}
