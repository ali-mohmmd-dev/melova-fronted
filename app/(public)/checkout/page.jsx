"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const savedOrder = localStorage.getItem("pendingOrder");
    if (savedOrder) {
      const parsedOrder = JSON.parse(savedOrder);
      setOrderData(parsedOrder);
    }
    
    // Autofill user details if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.first_name || prev.firstName,
        lastName: user.last_name || prev.lastName,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step === 1 && !user) {
      alert("Please login to continue with your order.");
      // Option: redirect to login
      // router.push("/login?redirect=/checkout");
      return;
    }
    setStep((prev) => prev + 1);
  };
  
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmitOrder = async () => {
    if (!user || !token) {
      alert("You must be logged in to place an order.");
      return;
    }

    setIsProcessing(true);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/";
      
      // 1. Create Order on Backend
      const payload = {
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.zipCode,
        items: [
          {
            variant: orderData.variant.id,
            quantity: 1
          }
        ]
      };

      const res = await axios.post(`${API_URL}api/shop/orders/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const order = res.data;
      const razorpayOrderId = order.razorpay_order_id;

      if (!razorpayOrderId) {
        throw new Error("Failed to get Razorpay Order ID from backend.");
      }

      // 2. Launch Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SRoOO2kOzMXJFt",
        amount: parseInt(orderData.price * 100),
        currency: "INR",
        name: "Melova",
        description: `Order for ${orderData.productName}`,
        image: "/img/melova_logo.png",
        order_id: razorpayOrderId,
        handler: async function (response) {
          // 3. Verify Payment
          try {
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyRes = await axios.post(`${API_URL}api/shop/verify-payment/`, verifyPayload, {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (verifyRes.data.status === 'Payment Successful') {
              localStorage.removeItem("pendingOrder");
              setStep(3); // Success step
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment completed but verification failed. Please check your account.");
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#562c1b",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error("Order process failed:", error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.error || "Something went wrong while creating your order.";
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!orderData && step !== 3) {
    return (
      <div className="container py-20 text-center">
        <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-[#562c1b]">
          <i className="fas fa-shopping-basket text-3xl"></i>
        </div>
        <h2 className="mb-4 text-3xl font-serif font-bold text-[#562c1b]">Your tray is empty</h2>
        <p className="mb-8 text-gray-500">Pick some delicious creations to get started.</p>
        <Link href="/products" className="rounded-full bg-[#562c1b] px-10 py-4 text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-lg">
          Explore Creations
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcfb] py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Progress Tracker */}
        <div className="mb-16 max-w-2xl mx-auto flex items-center justify-between relative px-2">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-[#9e7c29] -z-10 -translate-y-1/2 transition-all duration-700 ease-out"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
          
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div 
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                  step >= s ? "border-[#9e7c29] bg-[#9e7c29] text-white shadow-md shadow-[#9e7c29]/20" : "border-gray-200 bg-white text-gray-300"
                }`}
              >
                {step > s || step === 3 ? (
                  <i className="fas fa-check"></i>
                ) : (
                  <span className="font-bold">{s}</span>
                )}
              </div>
              <span className={`mt-3 text-xs font-bold uppercase tracking-widest ${step >= s ? "text-[#9e7c29]" : "text-gray-300"}`}>
                {s === 1 ? "Shipping" : s === 2 ? "Payment" : "Done"}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl bg-white p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
              {step === 1 && (
                <div>
                  <div className="mb-10">
                    <h2 className="mb-2 font-serif text-4xl font-bold text-[#562c1b]">Delivery Address</h2>
                    <p className="text-gray-400">Where should we send your handcrafted delights?</p>
                  </div>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9e7c29]/20 focus:border-[#9e7c29] transition-all"
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9e7c29]/20 focus:border-[#9e7c29] transition-all"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9e7c29]/20 focus:border-[#9e7c29] transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9e7c29]/20 focus:border-[#9e7c29] transition-all"
                          placeholder="9876543210"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Street Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9e7c29]/20 focus:border-[#9e7c29] transition-all"
                        placeholder="House No., Street, Area"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9e7c29]/20 focus:border-[#9e7c29] transition-all"
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9e7c29]/20 focus:border-[#9e7c29] transition-all"
                          placeholder="State"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">ZIP</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9e7c29]/20 focus:border-[#9e7c29] transition-all"
                          placeholder="400001"
                        />
                      </div>
                    </div>
                  </form>
                  
                  <div className="mt-12 flex justify-end">
                    <button
                      onClick={nextStep}
                      disabled={!formData.firstName || !formData.email || !formData.address || !formData.phone}
                      className="group relative overflow-hidden rounded-full bg-[#562c1b] px-12 py-5 text-white font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-40 shadow-xl shadow-[#562c1b]/20"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Continue to Payment <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-in fade-in duration-500">
                  <div className="mb-10">
                    <h2 className="mb-2 font-serif text-4xl font-bold text-[#562c1b]">Review & Order</h2>
                    <p className="text-gray-400">One final check before we proceed to secure payment.</p>
                  </div>
                  
                  <div className="space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-8">
                      <div className="rounded-2xl bg-[#faf7f2] p-6 border border-[#9e7c29]/10">
                        <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#9e7c29]">Shipping To</h4>
                        <p className="font-bold text-[#562c1b]">{formData.firstName} {formData.lastName}</p>
                        <p className="text-sm text-[#562c1b]/70 mt-1 leading-relaxed">
                          {formData.address}<br />
                          {formData.city}, {formData.state} - {formData.zipCode}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#faf7f2] p-6 border border-[#9e7c29]/10">
                        <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#9e7c29]">Contact Details</h4>
                        <p className="font-bold text-[#562c1b]">{formData.email}</p>
                        <p className="text-sm text-[#562c1b]/70 mt-1">{formData.phone}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-6 border border-gray-100 flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <i className="fas fa-shield-alt"></i>
                      </div>
                      <div className="text-sm text-gray-500">
                        Payment is securely handled via <span className="font-bold text-[#562c1b]">Razorpay</span>. We don't store your card details.
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 flex justify-between items-center">
                    <button
                      onClick={prevStep}
                      className="flex items-center gap-2 text-[#562c1b] font-bold hover:underline"
                    >
                      <i className="fas fa-arrow-left text-xs"></i> Back
                    </button>
                    <button
                      onClick={handleSubmitOrder}
                      disabled={isProcessing}
                      className="group relative overflow-hidden rounded-full bg-[#562c1b] px-12 py-5 text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#562c1b]/20 disabled:opacity-70"
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <i className="fas fa-circle-notch fa-spin"></i> Initializing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Pay ₹{orderData?.price} <i className="fas fa-lock text-xs ml-1"></i>
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-16 animate-in zoom-in-95 duration-700">
                  <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-green-500 outline outline-8 outline-green-50/50 shadow-inner">
                    <i className="fas fa-check text-4xl"></i>
                  </div>
                  <h2 className="mb-4 font-serif text-5xl font-bold text-[#562c1b]">Order Confirmed!</h2>
                  <p className="mb-12 text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                    Your artisanal chocolate creation is now being prepared. We'll send you an email with tracking details shortly.
                  </p>
                  <Link href="/products" className="rounded-full bg-[#562c1b] px-12 py-5 text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#562c1b]/10">
                    Return to Shop
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Summary */}
          {step !== 3 && (
            <div className="lg:col-span-4">
              <div className="sticky top-12 rounded-3xl bg-white p-8 shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <i className="fas fa-quote-right text-6xl text-[#562c1b]"></i>
                </div>
                
                <h3 className="mb-8 text-xl font-bold text-[#562c1b] flex items-center gap-2">
                  <i className="fas fa-shopping-bag text-sm text-[#9e7c29]"></i> Order Summary
                </h3>
                
                <div className="mb-8 flex gap-5">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
                    <img src={orderData?.image} alt={orderData?.productName} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="font-bold text-[#562c1b] leading-tight">{orderData?.productName}</h4>
                    <span className="mt-1 inline-block rounded-full bg-[#faf7f2] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#9e7c29]">
                      {orderData?.variant?.name} ({orderData?.variant?.gram}g)
                    </span>
                  </div>
                </div>
                
                <div className="space-y-5 border-t border-gray-50 pt-8 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-medium">Subtotal</span>
                    <span className="text-[#562c1b] font-bold">₹{orderData?.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-medium">Shipping</span>
                    <span className="text-green-500 font-bold uppercase tracking-wider text-[10px] bg-green-50 px-2 py-1 rounded-md">Free</span>
                  </div>
                  <div className="flex justify-between pt-6 text-2xl font-serif font-bold text-[#562c1b] border-t border-dashed border-gray-200">
                    <span>Total</span>
                    <span>₹{orderData?.price}</span>
                  </div>
                </div>

                <div className="mt-10 rounded-2xl bg-[#562c1b]/[0.02] p-4 border border-[#562c1b]/[0.05]">
                   <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                     <i className="fas fa-shield-alt mr-1"></i> Your transaction is secure and encrypted. By continuing, you agree to our Terms of Service.
                   </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

