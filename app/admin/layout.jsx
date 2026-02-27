import React from "react";
import Link from "next/link";
import "@/public/css/admin-style.css"; // Make sure this path exists

export const metadata = {
  title: "Admin Dashboard - MyMelova",
};

export default function AdminLayout({ children }) {
  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Link href="/" className="sidebar-logo">
            <img
              src="/img/melova_logo.png"
              alt="MyMelova Admin"
              style={{ maxWidth: "130px", height: "auto" }}
            />
          </Link>
        </div>
        <nav className="sidebar-nav">
          <Link href="/admin" className="nav-link">
            <i className="fas fa-chart-line"></i>
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/products" className="nav-link">
            <i className="fas fa-box"></i>
            <span>Products</span>
          </Link>
          <Link href="/admin/orders" className="nav-link">
            <i className="fas fa-shopping-cart"></i>
            <span>Orders</span>
          </Link>
          <Link href="/admin/customers" className="nav-link">
            <i className="fas fa-users"></i>
            <span>Customers</span>
          </Link>
          <Link href="/" className="nav-link">
            <i className="fas fa-home"></i>
            <span>Back to Store</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="header-left">
            <button className="mobile-toggle" id="mobileToggle">
              <i className="fas fa-bars"></i>
            </button>
            <h1>Admin Panel</h1>
          </div>
          <div className="header-right">
            <div className="admin-user">
              <i className="fas fa-user-circle"></i>
              <span>Admin</span>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        {children}
      </main>
    </div>
  );
}
