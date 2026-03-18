"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const { user, role, logout } = useAuth();
  const router = useRouter();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const isAnimatedPage = ["/", "/products", "/about", "/buy-now"].includes(pathname);

  const dropdownRef = useRef(null);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    router.push("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-white/5 ${
          !isAnimatedPage || scrolled
            ? "bg-[#562c1b] backdrop-blur-md shadow-lg py-3 border-b"
            : "bg-transparent backdrop-blur-sm py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <img
                  src="/img/melova_logo.png"
                  alt="Melova Logo"
                  className={`transition-all duration-300 w-auto drop-shadow-lg ${
                    !isAnimatedPage || scrolled ? "h-12" : "h-14"
                  }`}
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href="/about"
                className="text-stone-300 hover:text-amber-400 font-medium tracking-wide transition-colors duration-300 relative group text-sm"
              >
                Our Story
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/products"
                className="text-stone-300 hover:text-amber-400 font-medium tracking-wide transition-colors duration-300 relative group text-sm"
              >
                Chocolates
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/buy-now"
                className="text-stone-300 hover:text-amber-400 font-medium tracking-wide transition-colors duration-300 relative group text-sm"
              >
                Where to Buy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                {user ? (
                  <>
                    <button
                      onClick={() =>
                        setProfileDropdownOpen(!profileDropdownOpen)
                      }
                      className="flex items-center space-x-2 text-stone-300 hover:text-amber-400 transition-colors focus:outline-none"
                    >
                      <i className="fas fa-user-circle text-lg"></i>
                      <span className="font-medium text-sm">
                        {user?.name
                          ? user.name.split(" ")[0].slice(0, 8)
                          : "User"}
                      </span>
                      <i
                        className={`fas fa-chevron-down text-xs transition-transform duration-300 ${profileDropdownOpen ? "rotate-180" : ""
                          }`}
                      ></i>
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={`absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-stone-100 overflow-hidden transition-all duration-300 transform origin-top-right ${profileDropdownOpen
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 pointer-events-none"
                        }`}
                    >
                      <div className="py-2">
                        {(role === "admin" || role === "superadmin") && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-amber-600 transition-colors"
                          >
                            <i className="fas fa-tachometer-alt w-5 text-center mr-2 text-stone-400"></i>
                            Dashboard
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-amber-600 transition-colors"
                        >
                          <i className="fas fa-user w-5 text-center mr-2 text-stone-400"></i>
                          My Profile
                        </Link>
                        <Link
                          href="/orders"
                          className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-amber-600 transition-colors"
                        >
                          <i className="fas fa-shopping-bag w-5 text-center mr-2 text-stone-400"></i>
                          My Orders
                        </Link>
                        <div className="h-px bg-stone-100 my-1"></div>
                        <a
                          href="#logout"
                          onClick={handleLogout}
                          className="block px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <i className="fas fa-sign-out-alt w-5 text-center mr-2 text-red-400"></i>
                          Logout
                        </a>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 text-stone-300 hover:text-amber-400 font-medium text-sm transition-colors"
                  >
                    <i className="fas fa-user text-lg"></i>
                    <span>Login</span>
                  </Link>
                )}
              </div>

              {/* CTA Button */}
              <Link
                href="/contact"
                className="relative overflow-hidden group bg-gradient-to-r from-amber-600 to-amber-500 text-white px-6 py-2.5 rounded-full font-medium text-sm tracking-wide shadow-lg hover:shadow-amber-500/30 transition-shadow duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Reach Us
                  <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                </span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-amber-500 to-amber-400 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-500 ease-out z-0"></div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setSideMenuOpen(true)}
                className="text-stone-300 hover:text-white p-2 focus:outline-none transition-colors"
                aria-label="Open menu"
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${sideMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setSideMenuOpen(false)}
      ></div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 max-w-sm w-full bg-stone-900 shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out flex flex-col ${sideMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <img
            src="/img/melova_logo.png"
            alt="Melova Logo"
            className="h-10 w-auto"
          />
          <button
            onClick={() => setSideMenuOpen(false)}
            className="text-stone-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-all"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-6">
          <nav className="flex flex-col space-y-6">
            <Link
              href="/"
              className="text-lg font-medium text-stone-300 hover:text-amber-400 transition-colors"
              onClick={() => setSideMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-lg font-medium text-stone-300 hover:text-amber-400 transition-colors"
              onClick={() => setSideMenuOpen(false)}
            >
              Our Story
            </Link>
            <Link
              href="/products"
              className="text-lg font-medium text-stone-300 hover:text-amber-400 transition-colors"
              onClick={() => setSideMenuOpen(false)}
            >
              Chocolates
            </Link>
            <Link
              href="/buy-now"
              className="text-lg font-medium text-stone-300 hover:text-amber-400 transition-colors"
              onClick={() => setSideMenuOpen(false)}
            >
              Where to Buy
            </Link>

            <div className="h-px bg-white/10 my-2"></div>

            <div className="pt-2">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-2 py-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-lg">
                      {user?.first_name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-sm text-stone-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 mt-4 px-2">
                    {(role === "admin" || role === "superadmin") && (
                      <Link
                        href="/admin"
                        className="flex items-center text-stone-300 hover:text-amber-400 transition-colors"
                        onClick={() => setSideMenuOpen(false)}
                      >
                        <i className="fas fa-tachometer-alt w-6 text-center text-stone-500 mr-3"></i>
                        Dashboard
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="flex items-center text-stone-300 hover:text-amber-400 transition-colors"
                      onClick={() => setSideMenuOpen(false)}
                    >
                      <i className="fas fa-user w-6 text-center text-stone-500 mr-3"></i>
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center text-stone-300 hover:text-amber-400 transition-colors"
                      onClick={() => setSideMenuOpen(false)}
                    >
                      <i className="fas fa-shopping-bag w-6 text-center text-stone-500 mr-3"></i>
                      My Orders
                    </Link>
                    <a
                      href="#logout"
                      onClick={(e) => {
                        handleLogout(e);
                        setSideMenuOpen(false);
                      }}
                      className="flex items-center text-red-400 hover:text-red-300 transition-colors mt-2"
                    >
                      <i className="fas fa-sign-out-alt w-6 text-center mr-3"></i>
                      Logout
                    </a>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center justify-center w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl border border-white/20 transition-colors font-medium"
                  onClick={() => setSideMenuOpen(false)}
                >
                  <i className="fas fa-user mr-2"></i>
                  Login / Sign Up
                </Link>
              )}
            </div>
          </nav>
        </div>

        <div className="p-6 border-t border-white/10 bg-black/20">
          <Link
            href="/contact"
            className="flex items-center justify-center w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white py-3.5 rounded-xl font-medium tracking-wide shadow-lg shadow-amber-900/40 hover:brightness-110 transition-all"
            onClick={() => setSideMenuOpen(false)}
          >
            Reach Us
            <i className="fas fa-arrow-right ml-2 text-sm"></i>
          </Link>
        </div>
      </div>
    </>
  );
}
