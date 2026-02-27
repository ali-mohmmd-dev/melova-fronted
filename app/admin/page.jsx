"use client";
import React, { useEffect, useState, useRef } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const API_BASE_URL = "http://127.0.0.1:8000/api/shop/";
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`${API_BASE_URL}orders/`),
          fetch(`${API_BASE_URL}products/`),
        ]);

        if (!ordersRes.ok || !productsRes.ok) throw new Error("API Error");

        const orders = await ordersRes.json();
        const products = await productsRes.json();

        // Calculate Stats
        const totalRevenue = orders.reduce(
          (sum, order) => sum + (parseFloat(order.total) || 0),
          0,
        );
        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalProducts: products.length,
        });

        // Set Recent Orders
        setRecentOrders(orders.slice(0, 10));

        // Mock Top Products
        const productsWithSales = products
          .map((product) => ({
            ...product,
            sales: Math.floor(Math.random() * 90) + 10,
            revenue: Math.floor(Math.random() * 9000) + 1000,
          }))
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5);
        setTopProducts(productsWithSales);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    // Only initialize chart if Chart.js is loaded globally (added in RootLayout)
    if (window.Chart && chartRef.current && !window.salesChartInstance) {
      window.salesChartInstance = new window.Chart(chartRef.current, {
        type: "line",
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Sales (₹)",
              data: [
                12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000,
                40000, 38000, 45000,
              ],
              borderColor: "#8B4513",
              backgroundColor: "rgba(139, 69, 19, 0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    return () => {
      if (window.salesChartInstance) {
        window.salesChartInstance.destroy();
        window.salesChartInstance = null;
      }
    };
  }, [loading]);

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

  return (
    <div className="admin-content">
      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon bg-primary">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <div className="stat-details">
              <h3>{loading ? "..." : stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon bg-success">
              <i className="fas fa-rupee-sign"></i>
            </div>
            <div className="stat-details">
              <h3>{loading ? "..." : formatCurrency(stats.totalRevenue)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon bg-warning">
              <i className="fas fa-box"></i>
            </div>
            <div className="stat-details">
              <h3>{loading ? "..." : stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables Row */}
      <div className="row g-4">
        {/* Recent Orders */}
        <div className="col-lg-8">
          <div className="admin-card">
            <div className="card-header">
              <h2>Recent Orders</h2>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          Loading orders...
                        </td>
                      </tr>
                    ) : recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          No orders found.
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.customer?.name || "N/A"}</td>
                          <td>{formatCurrency(order.total)}</td>
                          <td>{formatDate(order.created_at)}</td>
                          <td>
                            <span className="badge bg-success">Completed</span>
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

        {/* Top Selling Products */}
        <div className="col-lg-4">
          <div className="admin-card">
            <div className="card-header">
              <h2>Top Products</h2>
            </div>
            <div className="card-body">
              <div className="top-products-list">
                {loading ? (
                  <p className="text-center">Loading products...</p>
                ) : topProducts.length === 0 ? (
                  <p className="text-muted text-center">
                    No product data available
                  </p>
                ) : (
                  topProducts.map((product, index) => (
                    <div className="product-item" key={product.id}>
                      <div className="product-rank">{index + 1}</div>
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p>
                          {product.sales} sales •{" "}
                          {formatCurrency(product.revenue)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Overview Chart */}
      <div className="row g-4 mt-4">
        <div className="col-12">
          <div className="admin-card">
            <div className="card-header">
              <h2>Sales Overview</h2>
            </div>
            <div className="card-body" style={{ height: "300px" }}>
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
