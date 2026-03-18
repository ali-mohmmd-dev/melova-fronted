"use client";
import React, { useEffect, useState, useRef } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

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
  <div className="p-6 space-y-6">

    {/* Welcome */}
    <div>
      <h2 className="text-2xl font-bold">Store Overview</h2>
      <p className="text-gray-500">
        Welcome back. Monitoring your chocolate empire's performance.
      </p>
    </div>

    {/* Stats */}
<div className="grid md:grid-cols-3 gap-4">
  {/* Orders */}
  <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
      <i className="fas fa-shopping-bag text-blue-600 text-lg"></i>
    </div>
    <div>
      <h3 className="text-xl font-semibold">
        {loading ? "..." : stats.totalOrders}
      </h3>
      <p className="text-gray-500 text-sm">Total Orders</p>
    </div>
  </div>

  {/* Revenue */}
  <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
    <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
      <i className="fas fa-rupee-sign text-emerald-600 text-lg"></i>
    </div>
    <div>
      <h3 className="text-xl font-semibold">
        {loading ? "..." : formatCurrency(stats.totalRevenue)}
      </h3>
      <p className="text-gray-500 text-sm">Total Revenue</p>
    </div>
  </div>

  {/* Products */}
  <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
    <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
      <i className="fas fa-box text-amber-600 text-lg"></i>
    </div>
    <div>
      <h3 className="text-xl font-semibold">
        {loading ? "..." : stats.totalProducts}
      </h3>
      <p className="text-gray-500 text-sm">Total Products</p>
    </div>
  </div>
</div>

    {/* Main Grid */}
    <div className="grid lg:grid-cols-12 gap-6">

      {/* Revenue Chart */}
      <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-semibold">Revenue Analytics</h3>
          <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
            Live Analysis
          </span>
        </div>
        <div className="p-4 h-[350px]">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>

      {/* Top Products */}
      <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold">Top Performers</h3>
        </div>

        <div className="p-4 space-y-4">
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
            ))
          ) : topProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No product data available
            </p>
          ) : (
            topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  <p className="text-xs text-gray-500">
                    {product.sales} sales •{" "}
                    <span className="font-medium text-amber-600">
                      {formatCurrency(product.revenue)}
                    </span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="lg:col-span-12 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-semibold">Recent Orders</h3>
          <button className="text-sm font-medium bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700">
            Manage Orders
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="text-left px-4 py-2 font-semibold">Order ID</th>
                <th className="text-left px-4 py-2 font-semibold">Customer</th>
                <th className="text-left px-4 py-2 font-semibold">Amount</th>
                <th className="text-left px-4 py-2 font-semibold">Date</th>
                <th className="text-left px-4 py-2 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td colSpan="5" className="px-4 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-semibold">
                      #ORD-{order.id}
                    </td>
                    <td className="px-4 py-2">
                      {order.customer?.name || "Guest Customer"}
                    </td>
                    <td className="px-4 py-2 font-semibold text-amber-700">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-4 py-2">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                        Processed
                      </span>
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
