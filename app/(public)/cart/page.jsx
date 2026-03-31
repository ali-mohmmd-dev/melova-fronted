"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

export default function CartPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/";

  // Component Styles
  const btnPrimary =
    "block w-full bg-[#9e7c29] text-white text-center py-3 rounded-xl text-sm font-bold hover:bg-[#866922] transition-all shadow-md active:scale-[0.98]";
  const btnGhost =
    "text-red-500 hover:text-red-700 text-[10px] font-bold transition-colors flex items-center gap-1 uppercase tracking-wider p-1";
  const qtyBtn =
    "w-7 h-7 flex items-center justify-center hover:bg-stone-200 transition-colors text-stone-600 disabled:opacity-30";
  const cardStyle =
    "bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden";

  const fetchCart = React.useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get("api/shop/cart/");
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchCart();
    else setLoading(false);
  }, [token, fetchCart]);

  const updateQuantity = async (variantId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const res = await api.post("api/shop/cart/update_item/", {
        variant_id: variantId,
        quantity: newQuantity,
      });
      setCart(res.data);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      alert("Failed to update quantity");
    }
  };

  const removeItem = async (variantId) => {
    try {
      const res = await api.post("api/shop/cart/remove_item/", {
        variant_id: variantId,
      });
      setCart(res.data);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      alert("Failed to remove item");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#9e7c29]"></div>
      </div>
    );
  }

  // Centered Empty State
  if (!token || !cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-4 text-center">
        <div className="text-6xl mb-6 text-stone-200">
          <i className={`fas ${!token ? "fa-lock" : "fa-shopping-basket"}`}></i>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-stone-800">
          {!token ? "Login Required" : "Your bag is empty"}
        </h2>
        <p className="text-stone-500 mb-8 max-w-xs text-sm">
          {!token 
            ? "Please log in to manage your chocolate selection." 
            : "Indulge yourself with our finest handcrafted chocolates."}
        </p>
        <Link 
          href={!token ? "/login?redirect=/cart" : "/products"} 
          className="bg-[#9e7c29] text-white px-10 py-3 rounded-xl text-sm font-bold shadow-lg shadow-amber-900/20"
        >
          {!token ? "Login Now" : "Explore Collection"}
        </Link>
      </div>
    );
  }

  return (
    /* The min-h-screen + flex items-center centers the content vertically on PC */
    <div className="min-h-screen bg-stone-50 flex items-center justify-center py-24 px-4 sm:px-6">
      <div className="w-full max-w-5xl mx-auto animate-fadeIn">
        
        {/* Header: Centered layout logic (Back Left, Title Right) */}
        <div className="flex flex-col sm:flex-row-reverse justify-between items-start sm:items-center gap-4 mb-8">
          <div className="w-full sm:w-auto flex sm:justify-end">
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 flex items-center gap-3">
              Your Bag
              <span className="text-sm font-normal text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
              </span>
            </h1>
          </div>
          <Link 
            href="/products" 
            className="text-sm font-bold text-[#9e7c29] hover:text-[#7a5f1e] flex items-center gap-2 transition-all group"
          >
            <i className="fas fa-chevron-left text-[10px] group-hover:-translate-x-1 transition-transform"></i> 
            Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className={`${cardStyle} p-3.5 flex items-center gap-4`}>
                
                {/* Small One-line Image Design */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 relative">
                  <Image
                    src={item.variant_details.images[0]?.image || "/img/placeholder_product.png"}
                    alt={item.variant_details.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-stone-800 text-sm sm:text-base truncate leading-tight">
                        {item.variant_details.name}
                      </h3>
                      <p className="text-stone-400 text-[10px] font-bold uppercase tracking-tight mt-0.5">
                        {item.variant_details.weight}g
                      </p>
                    </div>
                    <p className="font-bold text-stone-900 text-sm whitespace-nowrap lg:hidden">
                      ₹{item.subtotal}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 overflow-hidden scale-90 sm:scale-100 origin-left">
                      <button onClick={() => updateQuantity(item.variant, item.quantity - 1)} className={qtyBtn} disabled={item.quantity <= 1}>
                        <i className="fas fa-minus text-[8px]"></i>
                      </button>
                      <span className="px-2 text-xs font-bold text-stone-800 min-w-[30px] text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.variant, item.quantity + 1)} className={qtyBtn}>
                        <i className="fas fa-plus text-[8px]"></i>
                      </button>
                    </div>

                    <button onClick={() => removeItem(item.variant)} className={btnGhost}>
                      <i className="fas fa-trash-alt text-[9px]"></i> 
                      <span className="hidden sm:inline ml-1">Remove</span>
                    </button>
                  </div>
                </div>

                {/* Price Display (PC) */}
                <div className="hidden lg:block text-right flex-shrink-0 pl-6 border-l border-stone-100 min-w-[120px]">
                  <p className="font-bold text-stone-900 text-lg">₹{item.subtotal}</p>
                  <p className="text-[10px] text-stone-400 font-bold">₹{item.variant_details.price} / pc</p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Card */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className={`${cardStyle} p-6`}>
              <h2 className="text-xl font-bold text-stone-900 mb-6">Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500 font-medium">Subtotal</span>
                  <span className="font-bold text-stone-900">₹{cart.total_price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500 font-medium">Delivery</span>
                  <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest bg-green-50 px-2 py-0.5 rounded">Free</span>
                </div>
                <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
                  <span className="text-stone-900 font-bold">Total</span>
                  <div className="text-right">
                    <p className="text-2xl font-black text-stone-900">₹{cart.total_price}</p>
                    <p className="text-[10px] text-stone-400 font-bold">Tax Included</p>
                  </div>
                </div>
              </div>

              <Link href="/checkout" className={btnPrimary}>
                Checkout Now
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}