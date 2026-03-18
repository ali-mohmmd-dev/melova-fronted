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
  <div className="p-6 space-y-6">

    {/* Search */}
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="grid md:grid-cols-12 gap-3 items-center">

        {/* Search Input */}
        <div className="md:col-span-9 relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Reset Button */}
        <div className="md:col-span-3">
          <button
            onClick={resetFilters}
            className="w-full border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50"
          >
            <i className="fas fa-rotate-right mr-2"></i>
            Reset
          </button>
        </div>

      </div>
    </div>

    {/* Customers Table */}
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="font-semibold">
          All Customers
          <span className="text-gray-500 font-normal ml-2">
            ({filteredCustomers.length})
          </span>
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="text-left px-4 py-2 font-semibold">ID</th>
              <th className="text-left px-4 py-2 font-semibold">Name</th>
              <th className="text-left px-4 py-2 font-semibold">Email</th>
              <th className="text-left px-4 py-2 font-semibold">Phone</th>
              <th className="text-left px-4 py-2 font-semibold">Location</th>
              <th className="text-left px-4 py-2 font-semibold">Joined Date</th>
              <th className="text-center px-4 py-2 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  Loading customers...
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  No customers found.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition">

                  <td className="px-4 py-2 font-semibold">
                    #{customer.id}
                  </td>

                  <td className="px-4 py-2 font-medium">
                    {customer.name}
                  </td>

                  <td className="px-4 py-2 text-gray-600">
                    {customer.email}
                  </td>

                  <td className="px-4 py-2 text-gray-600">
                    {customer.phone}
                  </td>

                  <td className="px-4 py-2 text-gray-600">
                    {customer.city}, {customer.country}
                  </td>

                  <td className="px-4 py-2 text-gray-600">
                    {formatDate(customer.created_at)}
                  </td>

                  <td className="px-4 py-2">
                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => viewCustomer(customer.id)}
                        title="View Details"
                        className="px-2 py-1 text-xs font-medium text-white bg-sky-500 rounded-md hover:bg-sky-600"
                      >
                        <i className="fas fa-eye"></i>
                      </button>

                      <button
                        onClick={() => emailCustomer(customer.email)}
                        title="Email Customer"
                        className="px-2 py-1 text-xs font-medium text-white bg-amber-500 rounded-md hover:bg-amber-600"
                      >
                        <i className="fas fa-envelope"></i>
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
);
}
