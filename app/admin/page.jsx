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

        const totalRevenue = orders.reduce(
          (sum, order) => sum + (parseFloat(order.total) || 0),
          0,
        );
        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalProducts: products.length,
        });

        setRecentOrders(orders.slice(0, 8));

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
    if (window.Chart && chartRef.current && !window.salesChartInstance) {
      const ctx = chartRef.current.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(158, 124, 41, 0.3)'); /* Gold gradient */
      gradient.addColorStop(1, 'rgba(158, 124, 41, 0)');

      window.salesChartInstance = new window.Chart(chartRef.current, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "Revenue (₹)",
              data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000, 45000],
              borderColor: "#9e7c29",
              backgroundColor: gradient,
              borderWidth: 4,
              pointBackgroundColor: "#562c1b",
              pointBorderColor: "#fff",
              pointHoverRadius: 6,
              tension: 0.45,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#3e1f14",
              titleColor: "#9e7c29",
              bodyColor: "#fff",
              padding: 12,
              cornerRadius: 10,
              displayColors: false
            }
          },
          scales: {
            y: {
              grid: { color: "rgba(86,44,27,0.05)", borderDash: [5, 5] },
              ticks: { color: "#8d736a" }
            },
            x: {
              grid: { display: false },
              ticks: { color: "#8d736a" }
            }
          }
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
    return "₹" + parseFloat(amount).toLocaleString("en-IN");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="admin-content">
      {/* Welcome Section */}
      <div className="mb-5">
        <h2 className="fw-bold mb-1">Store Overview</h2>
        <p className="text-muted">Welcome back. Monitoring your chocolate empire's performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon bg-primary">
              <i className="fas fa-cookie"></i>
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
              <i className="fas fa-gem"></i>
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
              <i className="fas fa-box-open"></i>
            </div>
            <div className="stat-details">
              <h3>{loading ? "..." : stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Sales Chart */}
        <div className="col-lg-8">
          <div className="admin-card h-100">
            <div className="card-header">
              <h2>Revenue Analytics</h2>
              <div className="badge bg-success">Live Analysis</div>
            </div>
            <div className="card-body" style={{ height: "350px" }}>
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="col-lg-4">
          <div className="admin-card h-100">
            <div className="card-header">
              <h2>Top Performers</h2>
            </div>
            <div className="card-body">
              <div className="top-products-list">
                {loading ? (
                  Array(5).fill(0).map((_, i) => <div key={i} className="placeholder-glow mb-3"><div className="placeholder col-12 py-3 rounded"></div></div>)
                ) : topProducts.length === 0 ? (
                  <p className="text-muted text-center py-4">No product data available</p>
                ) : (
                  topProducts.map((product, index) => (
                    <div className="product-item" key={product.id}>
                      <div className="product-rank">{index + 1}</div>
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p>{product.sales} sales • <span style={{ color: "var(--admin-secondary)" }}>{formatCurrency(product.revenue)}</span></p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="col-12 mt-4">
          <div className="admin-card">
            <div className="card-header">
              <h2>Recent Orders</h2>
              <button className="btn btn-primary btn-sm">Manage Orders</button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                       Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan="5"><div className="placeholder-glow"><div className="placeholder col-12"></div></div></td></tr>)
                    ) : recentOrders.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-4">No orders found.</td></tr>
                    ) : (
                      recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="fw-bold">#ORD-{order.id}</td>
                          <td>{order.customer?.name || "Guest Customer"}</td>
                          <td className="fw-bold" style={{ color: "var(--admin-primary)" }}>{formatCurrency(order.total)}</td>
                          <td>{formatDate(order.created_at)}</td>
                          <td>
                            <span className="badge bg-success">Processed</span>
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
      </div>
    </div>
  );
}
