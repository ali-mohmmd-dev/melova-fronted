"use client";
import React, { useState, useEffect } from "react";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchCustomers() {
      const API_BASE_URL = "http://127.0.0.1:8000/api/shop/customers/";
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error("API Error");
        const data = await response.json();
        setCustomers(data);
        setFilteredCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter((customer) => {
      const name = (customer.name || "").toLowerCase();
      const email = (customer.email || "").toLowerCase();
      const phone = (customer.phone || "").toLowerCase();
      const term = searchTerm.toLowerCase();

      return (
        name.includes(term) || email.includes(term) || phone.includes(term)
      );
    });
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const resetFilters = () => {
    setSearchTerm("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const viewCustomer = (id) => alert(`Viewing details for Customer #${id}`);
  const emailCustomer = (email) => (window.location.href = `mailto:${email}`);

  return (
    <div className="admin-content">
      {/* Search */}
      <div className="admin-card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-9">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: "35px" }}
                  placeholder="Search customers by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={resetFilters}
              >
                <i className="fas fa-redo"></i> Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="admin-card">
        <div className="card-header">
          <h2>All Customers ({filteredCustomers.length})</h2>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table customers-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Loading customers...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      <p className="text-muted py-4">No customers found.</p>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>#{customer.id}</td>
                      <td>
                        <strong>{customer.name}</strong>
                      </td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>
                        {customer.city}, {customer.country}
                      </td>
                      <td>{formatDate(customer.created_at)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-info me-1"
                            onClick={() => viewCustomer(customer.id)}
                            title="View Details"
                          >
                            <i className="fas fa-eye text-white"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => emailCustomer(customer.email)}
                            title="Email Customer"
                          >
                            <i className="fas fa-envelope text-white"></i>
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
