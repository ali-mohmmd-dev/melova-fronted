"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function AdminCustomerDetails() {
  const router = useRouter();
  const { id } = useParams();
  const { token } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomerData() {
      if (!token || !id) return;

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/";

      try {
        setLoading(true);

        const customersRes = await fetch(`${API_URL}api/auth/customers/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!customersRes.ok) {
          setCustomer(null);
          setLoading(false);
          return;
        }

        const allCustomers = await customersRes.json();
        const allCustomersArray = Array.isArray(allCustomers) ? allCustomers : allCustomers.results || [];
        const customerData = allCustomersArray.find(
          (c) => String(c.id) === String(id)
        );

        if (!customerData) {
          setCustomer(null);
        } else {
          setCustomer(customerData);
        }

        const ordersRes = await fetch(`${API_URL}api/shop/orders/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (ordersRes.ok) {
          const allOrders = await ordersRes.json();
          const allOrdersArray = Array.isArray(allOrders) ? allOrders : allOrders.results || [];
          const customerOrders = allOrdersArray.filter(
            (order) =>
              String(order.customer) === String(id) ||
              (customerData?.email && order.user_email === customerData.email)
          );
          setOrders(customerOrders);
        }
      } catch (error) {
        console.error("Error in Customer Details fetch:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomerData();
  }, [token, id]);

  const formatCurrency = (amount) =>
    "₹" +
    parseFloat(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen leading-relaxed">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto"></div>
          <p className="text-stone-600 font-medium">
            Loading Customer Profile...
          </p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-10 text-center bg-white rounded-2xl shadow-sm border border-stone-100 max-w-2xl mx-auto mt-20 leading-relaxed">
        <div className="mb-6 text-stone-300">
          <i className="fas fa-user-slash text-6xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-3">
          Customer Not Found
        </h2>
        <p className="text-stone-500 mb-8">
          This customer record could not be retrieved.
        </p>
        <Link
          href="/admin/customers"
          className="inline-flex items-center px-6 py-3 bg-amber-800 text-white rounded-xl font-semibold hover:bg-amber-900 transition shadow-lg shadow-amber-900/20"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Customers
        </Link>
      </div>
    );
  }

  const totalSpend = orders.reduce(
    (sum, order) => sum + parseFloat(order.total || 0),
    0
  );

  return (
    <div className="p-6 md:p-10 space-y-10 animate-fadeIn leading-relaxed max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link
            href="/admin/customers"
            className="text-amber-800 font-semibold mb-3 inline-flex items-center hover:underline"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Customers List
          </Link>

          <h1 className="text-3xl font-bold text-stone-800 leading-tight">
            Customer <span className="text-amber-800">#{customer.id}</span>
          </h1>

          <p className="text-stone-500 mt-2">
            Member since {formatDate(customer.created_at)}
          </p>
        </div>

        <button
          onClick={() => (window.location.href = `mailto:${customer.email}`)}
          className="px-6 py-3 bg-white border border-stone-200 text-stone-700 rounded-xl font-semibold hover:bg-stone-50 transition shadow-sm flex items-center"
        >
          <i className="fas fa-envelope mr-2 text-amber-800"></i>
          Send Email
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-7 text-center">
            <div className="w-24 h-24 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-5 border-4 border-white shadow-md">
              {customer.name?.charAt(0) || "C"}
            </div>

            <h2 className="text-2xl font-bold text-stone-800 leading-tight">
              {customer.name}
            </h2>
            <p className="text-stone-500 mb-6">{customer.email}</p>

            <div className="grid grid-cols-2 gap-4 border-t border-stone-50 pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-800">
                  {orders.length}
                </p>
                <p className="text-xs text-stone-400 uppercase font-bold tracking-widest mt-1">
                  Orders
                </p>
              </div>
              <div className="text-center border-l border-stone-50">
                <p className="text-2xl font-bold text-amber-800">
                  {formatCurrency(totalSpend)}
                </p>
                <p className="text-xs text-stone-400 uppercase font-bold tracking-widest mt-1">
                  Total Spend
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-7">
            <h3 className="font-bold text-stone-800 mb-5 flex items-center pb-4 border-b border-stone-50">
              <i className="fas fa-address-card mr-3 text-amber-800 opacity-70"></i>
              Contact Information
            </h3>

            <div className="space-y-6">
              <InfoRow
                icon="fa-phone"
                label="Phone"
                value={customer.phone || "N/A"}
              />
              <InfoRow
                icon="fa-map-marker-alt"
                label="Location"
                value="N/A"
                sub=""
              />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="px-7 py-5 border-b border-stone-50 flex items-center justify-between bg-stone-50/50">
              <h2 className="font-bold text-stone-800">Order History</h2>
              <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold">
                {orders.length} TOTAL
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-stone-400 text-left border-b border-stone-50">
                    <th className="px-7 py-4 font-bold uppercase tracking-widest text-[11px]">
                      Order #
                    </th>
                    <th className="px-7 py-4 font-bold uppercase tracking-widest text-[11px]">
                      Date
                    </th>
                    <th className="px-7 py-4 font-bold uppercase tracking-widest text-[11px]">
                      Status
                    </th>
                    <th className="px-7 py-4 font-bold uppercase tracking-widest text-[11px] text-right">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-50">
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-7 py-10 text-center text-stone-400 italic"
                      >
                        No orders found for this customer.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-amber-50/30 transition cursor-pointer group"
                        onClick={() =>
                          router.push(`/admin/orders/${order.id}`)
                        }
                      >
                        <td className="px-7 py-5 font-bold text-stone-800 group-hover:text-amber-800 transition">
                          #{order.id}
                        </td>
                        <td className="px-7 py-5 text-stone-500">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-7 py-5">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-7 py-5 text-right font-bold text-stone-800">
                          {formatCurrency(order.total)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Segment */}
          <div className="bg-stone-900 rounded-2xl p-7 text-white flex items-center justify-between shadow-xl shadow-stone-900/10">
            <div>
              <h3 className="text-xl font-bold mb-1">Customer Segmentation</h3>
              <p className="text-stone-400 text-sm">
                Categorized based on lifetime value and engagement.
              </p>
            </div>
            <div className="px-4 py-2 border border-white/20 rounded-xl font-bold text-amber-400 bg-white/5">
              {totalSpend > 5000 ? "VIP CUSTOMER" : "REGULAR"}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function InfoRow({ icon, label, value, sub }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center text-stone-400">
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <p className="text-xs text-stone-400 uppercase font-bold tracking-widest mb-1">
          {label}
        </p>
        <p className="font-bold text-stone-800">{value}</p>
        {sub && <p className="text-stone-500 text-sm">{sub}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const base =
    "text-[10px] font-bold uppercase tracking-tighter px-2.5 py-1 rounded-full";
  const styles =
    status === "Paid"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Pending"
      ? "bg-amber-100 text-amber-700"
      : "bg-stone-100 text-stone-700";

  return <span className={`${base} ${styles}`}>{status || "Pending"}</span>;
}