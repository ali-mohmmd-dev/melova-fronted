"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const { user, role, logout } = useAuth();
  const router = useRouter();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    router.push("/login");
  };

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
      <header className="main-header bg-section">
        <div className="header-sticky">
          <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
              <Link className="navbar-brand" href="/">
                <img src="/img/melova_logo.png" alt="Logo" />
              </Link>

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

                <div
                  className={`profile-dropdown me-3 ${profileDropdownOpen ? "active" : ""}`}
                  ref={dropdownRef}
                >
                  {user ? (
                    <>
                      <button
                        className="profile-btn"
                        onClick={() =>
                          setProfileDropdownOpen(!profileDropdownOpen)
                        }
                      >
                        <i className="fas fa-user-circle"></i>
                        <span>{user?.first_name || "User"}</span>
                        <i
                          className="fas fa-chevron-down"
                          style={{ fontSize: "0.8rem" }}
                        ></i>
                      </button>
                      <div className="dropdown-menu-custom">
                        {role === "admin" && (
                          <Link href="/admin">
                            <i className="fas fa-tachometer-alt"></i> Dashboard
                          </Link>
                        )}
                        <Link href="/profile">
                          <i className="fas fa-user"></i> My Profile
                        </Link>
                        <Link href="/orders">
                          <i className="fas fa-shopping-bag"></i> My Orders
                        </Link>
                        <a href="#logout" onClick={handleLogout}>
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

                <div className="header-btn">
                  <Link href="/contact" className="btn-default">
                    Reach Us
                  </Link>
                </div>
              </div>

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
              {user ? (
                <>
                  {role === "admin" && (
                    <li>
                      <Link href="/admin">Dashboard</Link>
                    </li>
                  )}
                  <li>
                    <Link href="/profile">My Profile</Link>
                  </li>
                  <li>
                    <Link href="/orders">My Orders</Link>
                  </li>
                  <li>
                    <a href="#logout" onClick={handleLogout}>
                      Logout
                    </a>
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
