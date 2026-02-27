"use client";
import React, { useState, useEffect } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      const API_BASE_URL = "http://127.0.0.1:8000/api/shop/orders/";
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error("API Error");
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const customerName = (order.customer_name || "").toLowerCase();
      const orderIdStr = String(order.id);

      const matchesSearch =
        customerName.includes(searchTerm.toLowerCase()) ||
        orderIdStr.includes(searchTerm.toLowerCase());

      const status = "Completed"; // Modify this once backend has real status
      const matchesStatus = statusFilter === "" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const viewOrder = (id) => alert(`Viewing details for Order #${id}`);
  const printInvoice = (id) => alert(`Printing invoice for Order #${id}`);

  return (
    <div className="admin-content">
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
                  placeholder="Search orders by customer name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
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

      {/* Orders Table */}
      <div className="admin-card">
        <div className="card-header">
          <h2>All Orders ({filteredOrders.length})</h2>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Total Amount</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Loading orders...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      <p className="text-muted py-4">No orders found.</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>
                        <strong>{order.customer_name || "N/A"}</strong>
                      </td>
                      <td>{order.email || "N/A"}</td>
                      <td>
                        <span className="price-tag">
                          {formatCurrency(order.total)}
                        </span>
                      </td>
                      <td>{formatDate(order.created_at)}</td>
                      <td>
                        <span className="badge bg-success">Completed</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-info me-1"
                            onClick={() => viewOrder(order.id)}
                            title="View Details"
                          >
                            <i className="fas fa-eye text-white"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => printInvoice(order.id)}
                            title="Print Invoice"
                          >
                            <i className="fas fa-print"></i>
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
