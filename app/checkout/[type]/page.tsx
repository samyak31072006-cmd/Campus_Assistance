"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

function CheckoutContent({ params }: { params: { type: string } }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isCad = params.type === "cad";

  // Params
  const cadTitle = searchParams.get("title") || "Orthographic Projection — Sheet 03";
  const cadId = searchParams.get("cadId") || "cad-1";
  const initialPrice = parseFloat(searchParams.get("price") || "149");
  const existingOrderNumber = searchParams.get("orderNumber");

  const [paymentMode, setPaymentMode] = useState<"RAZORPAY" | "DEMO">("RAZORPAY");
  const [isProcessing, setIsProcessing] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const [studentInfo, setStudentInfo] = useState({
    name: "Rohan Sharma",
    phone: "+91 98765 43210",
    email: "rohan.sharma@campus.edu",
    rollNumber: "21BCE1042",
    branch: "Computer Science",
    section: "CS-B",
    pickupLocationId: "loc-1",
    instructions: searchParams.get("instructions") || "Hand deliver at library front desk.",
    deadline: "2026-09-08T17:00",
  });

  const pricePerItem = isCad ? initialPrice : 25;
  const quantity = 1;
  const billablePages = searchParams.get("pages") ? parseInt(searchParams.get("pages")!) : 12;
  
  const subtotal = isCad ? pricePerItem * quantity : billablePages * pricePerItem;
  const rushFee = 0;
  const totalAmount = subtotal + rushFee;

  // Load Razorpay standard checkout script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayNow = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      let targetOrderNumber = existingOrderNumber;

      // 1. Create CAD order if CAD service and no existing internal order number
      if (isCad && !targetOrderNumber) {
        const createRes = await fetch("/api/cad/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentName: studentInfo.name,
            studentEmail: studentInfo.email,
            studentPhone: studentInfo.phone,
            rollNumber: studentInfo.rollNumber,
            branch: studentInfo.branch,
            section: studentInfo.section,
            pickupLocationId: studentInfo.pickupLocationId,
            instructions: studentInfo.instructions,
            cadProductId: cadId,
            price: pricePerItem,
            questionFileName: searchParams.get("questionFile") || "Question_Reference.jpg",
          }),
        });
        const createData = await createRes.json();
        if (createData.success && createData.order) {
          targetOrderNumber = createData.order.orderNumber;
        } else {
          alert("Could not create CAD order: " + (createData.error || "Server error"));
          setIsProcessing(false);
          return;
        }
      }

      if (!targetOrderNumber) {
        targetOrderNumber = isCad ? "CAD1006" : "ASG1026";
      }

      // 2. Call backend POST /api/payments/create-order (Price calculated strictly on server!)
      const createPaymentRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internalOrderId: targetOrderNumber,
        }),
      });

      const paymentOrderData = await createPaymentRes.json();
      if (!paymentOrderData.success) {
        alert("Payment initialization error: " + (paymentOrderData.error || "Server error"));
        setIsProcessing(false);
        return;
      }

      // 3. Open Razorpay Standard Checkout modal if script loaded and live key present
      if (paymentMode === "RAZORPAY" && typeof (window as any).Razorpay !== "undefined" && paymentOrderData.key && paymentOrderData.provider === "RAZORPAY") {
        const options = {
          key: paymentOrderData.key,
          amount: paymentOrderData.amount,
          currency: paymentOrderData.currency || "INR",
          name: "Campus Assistance Startup",
          description: isCad ? `CAD Sheet: ${cadTitle}` : `Assignment Writing (${billablePages} Pages)`,
          order_id: paymentOrderData.razorpayOrderId,
          prefill: {
            name: studentInfo.name,
            email: studentInfo.email,
            contact: studentInfo.phone,
          },
          theme: {
            color: "#2563EB",
          },
          handler: async function (response: any) {
            // 4. Server-Side Signature Verification upon checkout completion
            try {
              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  internalOrderId: targetOrderNumber,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                  provider: "RAZORPAY",
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                router.push(`/orders/${targetOrderNumber}?payment=success`);
              } else {
                alert("Payment verification failed: " + (verifyData.error || "Invalid signature"));
                setIsProcessing(false);
              }
            } catch (vErr) {
              console.error(vErr);
              alert("Error verifying payment signature.");
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        return;
      }

      // 5. Fallback Demo Bypass if Razorpay keys not configured in environment
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internalOrderId: targetOrderNumber,
          razorpayPaymentId: `pay_demo_${Date.now()}`,
          razorpayOrderId: paymentOrderData.razorpayOrderId || `order_demo_${Date.now()}`,
          provider: "DEMO",
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        router.push(`/orders/${targetOrderNumber}?payment=success`);
      } else {
        alert("Payment verification failed.");
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      alert("An unexpected error occurred during payment processing.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-bold border border-blue-200">
          <Lock className="w-3.5 h-3.5" />
          256-Bit SSL Encrypted Campus Checkout
        </div>
        <h1 className="text-3xl font-extrabold text-brand-navy">
          Checkout & Confirm Order
        </h1>
        <p className="text-slate-600 text-sm">
          Review your order details and complete payment to assign a top campus creator.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: STUDENT & PICKUP DETAILS */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-4">
            <h3 className="font-extrabold text-lg text-brand-navy border-b border-slate-100 pb-3">
              1. Student Identification
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={studentInfo.name}
                  onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Roll Number
                </label>
                <input
                  type="text"
                  value={studentInfo.rollNumber}
                  onChange={(e) => setStudentInfo({ ...studentInfo, rollNumber: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Branch & Section
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={studentInfo.branch}
                    onChange={(e) => setStudentInfo({ ...studentInfo, branch: e.target.value })}
                    className="w-2/3 px-3.5 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 outline-none"
                  />
                  <input
                    type="text"
                    value={studentInfo.section}
                    onChange={(e) => setStudentInfo({ ...studentInfo, section: e.target.value })}
                    className="w-1/3 px-3.5 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={studentInfo.phone}
                  onChange={(e) => setStudentInfo({ ...studentInfo, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-4">
            <h3 className="font-extrabold text-lg text-brand-navy border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>2. Campus Pickup Spot</span>
              <MapPin className="w-5 h-5 text-emerald-600" />
            </h3>

            <div>
              <select
                value={studentInfo.pickupLocationId}
                onChange={(e) => setStudentInfo({ ...studentInfo, pickupLocationId: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-bold text-slate-800 bg-white focus:ring-2 focus:ring-brand-blue outline-none"
              >
                <option value="loc-1">Central Library (Ground Floor Desk)</option>
                <option value="loc-2">Academic Block 1 (A-Block Canteen)</option>
                <option value="loc-3">Hostel Complex (Block A Reception)</option>
                <option value="loc-4">Mechanical Engineering Dept Lab</option>
                <option value="loc-5">Sports Complex Pavilion</option>
              </select>
              <p className="text-xs text-slate-500 mt-2">
                Available pickup hours: <span className="font-semibold text-slate-700">9:00 AM - 8:00 PM</span> on college working days.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: COST SUMMARY & PAYMENT TRIGGER */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-card space-y-6">
            <h3 className="font-extrabold text-xl text-brand-navy border-b border-slate-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-slate-800 block">
                    {isCad ? cadTitle : "Assignment Writing Assistance"}
                  </span>
                  <span className="text-xs text-slate-500">
                    {isCad
                      ? "Engineering Drawing Sheet"
                      : `${billablePages} Verified Billable Pages @ ₹25/pg`}
                  </span>
                </div>
                <span className="font-extrabold text-slate-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {rushFee > 0 && (
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Rush Turnaround Fee</span>
                  <span>{formatCurrency(rushFee)}</span>
                </div>
              )}

              <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                <span className="text-base font-extrabold text-brand-navy">Total Payable</span>
                <span className="text-3xl font-extrabold text-brand-blue">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            {/* PAYMENT GATEWAY MODE SELECTOR */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select Payment Method
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMode("RAZORPAY")}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                    paymentMode === "RAZORPAY"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Razorpay</span>
                  <span className="text-[9px] opacity-80 font-normal">(UPI / Card / Net)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode("DEMO")}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                    paymentMode === "DEMO"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Demo Payment</span>
                  <span className="text-[9px] opacity-80 font-normal">(Instant Test)</span>
                </button>
              </div>
            </div>

            {/* PAY BUTTON */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full bg-brand-blue hover:bg-blue-700 text-white font-extrabold py-4 px-6 rounded-2xl text-base shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>PROCESSING...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>PAY {formatCurrency(totalAmount)}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Campus Money-Back Guarantee if unfulfilled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage({ params }: { params: { type: string } }) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm font-semibold">Loading checkout...</div>}>
      <CheckoutContent params={params} />
    </Suspense>
  );
}
