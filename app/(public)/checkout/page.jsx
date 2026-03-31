"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [step, setStep] = useState(1);
  const [cart, setCart] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/";

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

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-amber-700 focus:bg-white focus:outline-none transition-all duration-200";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;
      try {
        const res = await api.get("api/shop/cart/");
        setCart(res.data);
      } catch (err) {
        console.error("Error fetching cart for checkout:", err);
      }
    };

    if (token) fetchCart();

    if (user) {
      const fullName = (user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`).trim();
      const [firstName, ...rest] = fullName ? fullName.split(/\s+/) : [];
      const lastName = rest.join(" ");

      setFormData((p) => ({
        ...p,
        firstName: firstName || "",
        lastName: lastName || "",
        email: user.email || "",
      }));
    }
  }, [user, token, API_URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const nextStep = () => {
    if (step === 1 && !user) {
      router.push("/login?redirect=/checkout");
      return;
    }
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setStep((s) => s - 1);
  };

  const handleSubmitOrder = async () => {
    if (!user || !token) return alert("Login required.");
    if (!cart || cart.items.length === 0) return alert("Cart is empty.");

    setIsProcessing(true);
    try {
      const payload = {
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.zipCode,
      };

      const res = await api.post("api/shop/cart/checkout/", payload);
      const razorpayOrderId = res.data.razorpay_order_id;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(cart.total_price * 100),
        currency: "INR",
        name: "Melova",
        description: "Melova Chocolate Order",
        order_id: razorpayOrderId,
        handler: async (response) => {
          const verifyRes = await api.post("api/shop/verify-payment/", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data.status === "Payment Successful") {
            window.dispatchEvent(new Event("cartUpdated"));
            setStep(3);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#92400e" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      alert("Order failed. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart && step !== 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Link href="/products" className="text-amber-800 font-medium hover:underline">
          Your cart is empty — Shop now
        </Link>
      </div>
    );
  }

  return (
    /* flex items-center justify-center min-h-screen ensures vertical and horizontal centering on PC */
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center py-12 lg:py-24">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Header */}
        {step !== 3 && (
          <div className="flex items-center justify-center mb-8 gap-4 sm:gap-8">
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-amber-800 text-white' : 'bg-gray-200 text-gray-500'}`}>1</span>
              <span className={`text-xs font-bold uppercase tracking-widest ${step >= 1 ? 'text-amber-900' : 'text-gray-400'}`}>Details</span>
            </div>
            <div className="h-px w-12 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-amber-800 text-white' : 'bg-gray-200 text-gray-500'}`}>2</span>
              <span className={`text-xs font-bold uppercase tracking-widest ${step >= 2 ? 'text-amber-900' : 'text-gray-400'}`}>Payment</span>
            </div>
          </div>
        )}

         {step < 3 && (
              <button
                onClick={() => step === 1 ? router.back() : prevStep()}
                className="mb-6 flex items-center gap-2 text-gray-400 hover:text-amber-800 transition-colors group"
              >
                <i className="fas fa-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform"></i>
                <span className="text-[10px] font-bold uppercase tracking-widest">Go Back</span>
              </button>
            )}

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Form or Confirmation */}
          <div className={`lg:col-span-7 xl:col-span-8 w-full ${step === 3 ? 'lg:col-span-12' : ''}`}>
            
           

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">
              {step === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                  <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Delivery Details</h2>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input className={inputClass} placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                      <input className={inputClass} placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                    </div>
                    <input className={inputClass} placeholder="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                    <input className={inputClass} placeholder="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
                    <input className={inputClass} placeholder="Street Address" name="address" value={formData.address} onChange={handleInputChange} required />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <input className={inputClass} placeholder="City" name="city" value={formData.city} onChange={handleInputChange} required />
                      <input className={inputClass} placeholder="State" name="state" value={formData.state} onChange={handleInputChange} required />
                      <input className={inputClass} placeholder="PIN Code" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <button type="submit" className="mt-10 w-full rounded-2xl bg-amber-800 py-4 text-sm font-bold text-white hover:bg-amber-900 shadow-xl shadow-amber-900/20 transition-all active:scale-[0.98]">
                    Continue to Payment
                  </button>
                </form>
              )}

              {step === 2 && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Review Order</h2>
                  <div className="bg-stone-50 rounded-2xl p-6 mb-8 border border-stone-100">
                    <p className="text-[10px] font-bold text-amber-800 uppercase tracking-[0.2em] mb-4">Shipping Information</p>
                    <p className="text-base font-bold text-gray-900">{formData.firstName} {formData.lastName}</p>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{formData.address}, {formData.city}, {formData.state} - {formData.zipCode}</p>
                    <p className="text-sm text-gray-600 mt-1">{formData.phone}</p>
                  </div>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={isProcessing}
                    className="w-full rounded-2xl bg-amber-800 py-4 text-sm font-bold text-white hover:bg-amber-900 disabled:opacity-60 shadow-xl shadow-amber-900/20 transition-all"
                  >
                    {isProcessing ? "Opening Razorpay..." : `Pay ₹${cart.total_price} via Secure Gateway`}
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-10 px-4 max-w-md mx-auto">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <i className="fas fa-check text-3xl"></i>
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Success!</h2>
                  <p className="text-gray-500 mb-10 text-sm leading-relaxed">Your artisan chocolates are being prepared. Check <span className="font-bold text-gray-800">{formData.email}</span> for your receipt.</p>
                  <Link href="/products" className="inline-block w-full rounded-2xl bg-amber-800 py-4 text-sm font-bold text-white hover:bg-amber-900 shadow-lg transition-all">
                    Back to Gallery
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Summary (Sticky on PC) */}
          {step < 3 && (
            <div className="lg:col-span-5 xl:col-span-4 w-full">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
                  Summary
                  <span className="text-xs font-normal text-gray-400">{cart.items.length} items</span>
                </h3>
                <div className="space-y-5 max-h-[350px] overflow-y-auto pr-2 mb-6 scrollbar-hide">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-14 h-14 relative rounded-xl overflow-hidden border border-gray-50 flex-shrink-0">
                        <Image src={item.variant_details.images[0]?.image || "/img/placeholder_product.png"} alt={item.variant_details.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{item.variant_details.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-xs font-bold text-gray-900">₹{item.subtotal}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 border-t pt-6">
                  <div className="flex justify-between text-xs font-medium text-gray-400"><span>Subtotal</span><span className="text-gray-900 font-bold">₹{cart.total_price}</span></div>
                  <div className="flex justify-between text-xs font-medium text-gray-400"><span>Shipping</span><span className="text-green-600 font-bold tracking-tighter">FREE</span></div>
                  <div className="flex justify-between text-lg font-black text-gray-900 pt-3 border-t border-dashed">
                    <span>Total</span>
                    <span>₹{cart.total_price}</span>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-center gap-2 opacity-30 grayscale">
                   <i className="fas fa-lock text-[10px]"></i>
                   <span className="text-[9px] font-black uppercase tracking-widest">End-to-End Encrypted</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}