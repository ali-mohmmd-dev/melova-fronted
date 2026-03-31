"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";

export default function Header() {
  const { user, role, logout, token } = useAuth();
  const router = useRouter();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Renamed for clarity
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/";
  const pathname = usePathname();
  const isAnimatedPage = ["/", "/products", "/about", "/buy-now"].includes(pathname);
  const dropdownRef = useRef(null);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    router.push("/login");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!token) {
        setCartCount(0);
        return;
      }
      try {
        const res = await api.get("api/shop/cart/");
        const totalItems = res.data.items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(totalItems);
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error("Error fetching cart count:", err);
        }
      }
    };

    fetchCartCount();
    window.addEventListener('cartUpdated', fetchCartCount);
    return () => window.removeEventListener('cartUpdated', fetchCartCount);
  }, [token, API_URL]);

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
                <Image
                  src="/img/melova_logo.png"
                  alt="Melova Logo"
                  width={150}
                  height={56}
                  quality={90}
                  className={`transition-all duration-300 w-auto drop-shadow-lg ${
                    !isAnimatedPage || scrolled ? "h-10 sm:h-12" : "h-12 sm:h-14"
                  }`}
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/about" className="text-stone-300 hover:text-amber-400 font-medium tracking-wide transition-colors duration-300 relative group text-sm">
                Our Story
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/products" className="text-stone-300 hover:text-amber-400 font-medium tracking-wide transition-colors duration-300 relative group text-sm">
                Chocolates
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/buy-now" className="text-stone-300 hover:text-amber-400 font-medium tracking-wide transition-colors duration-300 relative group text-sm">
                Where to Buy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Actions (Desktop + Mobile Icons) */}
            <div className="flex items-center space-x-3 sm:space-x-6">
              {/* Profile Dropdown (Desktop) */}
              <div className="hidden lg:block relative" ref={dropdownRef}>
                {mounted && user ? (
                  <>
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center space-x-2 text-stone-300 hover:text-amber-400 transition-colors focus:outline-none"
                    >
                      <i className="fas fa-user-circle text-lg"></i>
                      <span className="font-medium text-sm">
                        {user?.name ? user.name.split(" ")[0].slice(0, 8) : "User"}
                      </span>
                      <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${profileDropdownOpen ? "rotate-180" : ""}`}></i>
                    </button>
                    <div className={`absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-stone-100 overflow-hidden transition-all duration-300 transform origin-top-right ${profileDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                      <div className="py-2">
                        {(role === "admin" || role === "superadmin") && (
                          <Link href="/admin" className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-amber-600 transition-colors">
                            <i className="fas fa-tachometer-alt w-5 text-center mr-2 text-stone-400"></i> Dashboard
                          </Link>
                        )}
                        <Link href="/profile" className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-amber-600 transition-colors">
                          <i className="fas fa-user w-5 text-center mr-2 text-stone-400"></i> My Profile
                        </Link>
                        <div className="h-px bg-stone-100 my-1"></div>
                        <a href="#logout" onClick={handleLogout} className="block px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <i className="fas fa-sign-out-alt w-5 text-center mr-2 text-red-400"></i> Logout
                        </a>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link href="/login" className="flex items-center space-x-2 text-stone-300 hover:text-amber-400 font-medium text-sm transition-colors">
                    <i className="fas fa-user text-lg"></i>
                    <span>Login</span>
                  </Link>
                )}
              </div>

              {/* Cart Button (Always Visible) */}
              <Link
                href="/cart"
                className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 border ${
                  !isAnimatedPage || scrolled ? "bg-white/10 border-white/20" : "bg-white border-stone-200"
                }`}
              >
                <i className={`fas fa-shopping-bag text-sm ${!isAnimatedPage || scrolled ? "text-amber-400" : "text-amber-700"}`} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-800 text-white text-[9px] min-w-[16px] h-[16px] flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-stone-300 hover:text-white focus:outline-none"
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl w-6 text-center`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Simplified Mobile Dropdown Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden bg-[#4a2617] ${mobileMenuOpen ? "max-h-[500px] border-t border-white/10" : "max-h-0"}`}>
          <div className="px-6 py-6 space-y-4">
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block text-stone-200 text-sm font-medium tracking-wide">Our Story</Link>
            <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="block text-stone-200 text-sm font-medium tracking-wide">Chocolates</Link>
            <Link href="/buy-now" onClick={() => setMobileMenuOpen(false)} className="block text-stone-200 text-sm font-medium tracking-wide">Where to Buy</Link>
            
            <div className="h-px bg-white/10 my-2"></div>
            
            {mounted && user ? (
              <div className="space-y-4">
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-stone-200 text-sm font-medium">
                  <i className="fas fa-user-circle mr-3 text-amber-400"></i> My Profile
                </Link>
                {(role === "admin" || role === "superadmin") && (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-stone-200 text-sm font-medium">
                    <i className="fas fa-tachometer-alt mr-3 text-amber-400"></i> Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center text-red-400 text-sm font-medium">
                  <i className="fas fa-sign-out-alt mr-3"></i> Logout
                </button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-amber-400 text-sm font-medium">
                <i className="fas fa-user mr-3"></i> Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}