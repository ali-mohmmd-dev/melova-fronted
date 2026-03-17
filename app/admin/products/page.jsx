"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/product-data";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        // Attempt to load using our shared data fetching logic
        const data = await getProducts();
        console.log("All products:", data);
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products locally:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products.filter((product) => {
      const name = (product.name || "").toLowerCase();
      return name.includes(searchTerm.toLowerCase());
    });

    if (sortOption) {
      filtered = [...filtered].sort((a, b) => {
        let aValue, bValue;
        switch (sortOption) {
          case "name-asc":
            return (a.name || "").localeCompare(b.name || "");
          case "name-desc":
            return (b.name || "").localeCompare(a.name || "");
          case "price-asc":
            aValue = parseFloat(a.price || 0);
            bValue = parseFloat(b.price || 0);
            return aValue - bValue;
          case "price-desc":
            aValue = parseFloat(a.price || 0);
            bValue = parseFloat(b.price || 0);
            return bValue - aValue;
          default:
            return 0;
        }
      });
    }

    setFilteredProducts(filtered);
  }, [searchTerm, sortOption, products]);

  const resetFilters = () => {
    setSearchTerm("");
    setSortOption("");
  };

  const formatCurrency = (amount) => {
    return (
      "₹" +
      parseFloat(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  const viewProduct = (id) => {
    window.location.href = `/products/${id}`;
  };

  const editProduct = (id) => {
    alert(
      `Edit product #${id}\n\nThis would typically route to an edit form in Next.js.`,
    );
  };

  const deleteProduct = (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${name}"?\n\nThis action cannot be undone.`,
      )
    ) {
      alert(
        `Delete product #${id}\n\nThis would make an API call to delete the product.`,
      );
    }
  };

  return (
    <div className="admin-content">
      {/* Header Extension for Add Product */}
      <div className="d-flex justify-content-end mb-4">
        {/* We can route to a new component eventually for adding products */}
        <button
          className="btn btn-primary"
          onClick={() => (window.location.href = "/admin/add-product")}
        >
          <i className="fas fa-plus me-2"></i> Add New Product
        </button>
      </div>

      {/* Search and Filter */}
      <div className="admin-card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: "35px" }}
                  placeholder="Search products by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Sort by...</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </div>
            <div className="col-md-3">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={resetFilters}
              >
                <i className="fas fa-redo"></i> Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-card">
        <div className="card-header">
          <h2>All Products ({filteredProducts.length})</h2>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Variants</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      <p className="text-muted py-4">No products found.</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>
                        <div
                          className="product-image-thumb"
                          style={{
                            width: "50px",
                            height: "50px",
                            overflow: "hidden",
                            borderRadius: "5px",
                          }}
                        >
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div className="no-image d-flex align-items-center justify-content-center bg-light w-100 h-100">
                              <i className="fas fa-image text-muted"></i>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <strong>{product.title}</strong>
                      </td>
                      <td>
                        <div
                          className="product-intro"
                          style={{ maxWidth: "250px" }}
                        >
                          {product.intro && product.intro.length > 60
                            ? `${product.introduction.substring(0, 60)}...`
                            : product.intro}
                        </div>
                      </td>
                      <td>
                        <span className="price-tag">
                          {formatCurrency(product.price)}
                        </span>
                      </td>
                      <td>{product.variants ? product.variants.length : 0}</td>
                      <td>
                        <div className="action-buttons text-nowrap">
                          <button
                            className="btn btn-sm btn-info me-1"
                            onClick={() => viewProduct(product.id)}
                            title="View"
                          >
                            <i className="fas fa-eye text-white"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-warning me-1"
                            onClick={() => editProduct(product.id)}
                            title="Edit"
                          >
                            <i className="fas fa-edit text-white"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              deleteProduct(product.id, product.name)
                            }
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
