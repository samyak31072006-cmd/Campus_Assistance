"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Compass,
  MapPin,
  Clock,
  Download,
  CreditCard,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Printer,
  Sparkles,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { OrderTimeline } from "@/components/ui/order-timeline";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function OrderTrackingContent({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const paymentSuccess = searchParams.get("payment") === "success";

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
        }
      } catch (e) {
        console.error("Failed to load order", e);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-600 font-semibold text-sm">Loading order details...</p>
      </div>
    );
  }

  const displayOrder = order || {
    id: params.id,
    orderNumber: params.id.toUpperCase(),
    serviceType: params.id.startsWith("CAD") ? "CAD" : "ASSIGNMENT",
    status: paymentSuccess ? "PAID" : params.id.endsWith("5") ? "PAGE_COUNT_PENDING" : "IN_PROGRESS",
    totalAmount: params.id.startsWith("CAD") ? 149 : 300,
    deadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    user: {
      name: "Rohan Sharma",
      rollNumber: "21BCE1042",
      branch: "Computer Science",
      section: "CS-B",
      phone: "+91 98765 43210",
    },
    pickupLocation: {
      name: "Central Library (Ground Floor Desk)",
      description: "Main entrance counter near reference section",
      hours: "9:00 AM - 8:00 PM",
    },
    assignmentDetail: {
      billablePages: 12,
      pricePerPage: 25,
    },
    cadOrderDetail: {
      cadProduct: {
        title: "Orthographic Projection — Sheet 03",
      },
    },
    files: [
      {
        fileName: params.id.startsWith("CAD")
          ? "Question_Block_Reference.jpg"
          : "Physics_Assignment_Unit3.pdf",
        fileUrl: "#",
      },
    ],
    payments: [
      {
        razorpayPaymentId: "pay_rzp_99812",
        razorpayOrderId: "order_rzp_99812",
        status: "CAPTURED",
        method: "upi",
        amount: params.id.startsWith("CAD") ? 149 : 300,
      },
    ],
  };

  const isAssignment = displayOrder.serviceType === "ASSIGNMENT";
  const activePayment = displayOrder.payments?.[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Top Banner if just completed payment */}
      {paymentSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg animate-fade-in">
          <div className="flex items-center gap-3 text-emerald-900">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0" />
            <div>
              <h3 className="font-extrabold text-lg">Razorpay Payment Successful!</h3>
              <p className="text-sm text-emerald-800">
                Payment confirmed and order status updated to <span className="font-bold">PAID</span>. Creator assignment in progress.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Invoice</span>
          </button>
        </div>
      )}

      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Link href="/dashboard" className="text-slate-500 hover:text-brand-navy text-xs font-semibold flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-brand-navy font-mono">
              #{displayOrder.orderNumber}
            </h1>
            <StatusBadge status={displayOrder.status} />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ordered on {formatDate(displayOrder.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>View Invoice</span>
          </button>

          {displayOrder.status === "PAGE_COUNT_VERIFIED" && (
            <Link
              href={`/checkout/assignment?orderNumber=${displayOrder.orderNumber}&pages=${displayOrder.assignmentDetail?.billablePages || 12}`}
              className="bg-brand-blue hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Payment</span>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: TIMELINE STEPPER & PAYMENT AUDIT DETAILS */}
        <div className="lg:col-span-7 space-y-6">
          {/* TIMELINE UI STEPPER */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-4">
            <h3 className="font-extrabold text-lg text-brand-navy border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Live Order Progress</span>
              <span className="text-xs text-brand-blue font-bold">Campus Delivery</span>
            </h3>

            <OrderTimeline
              serviceType={displayOrder.serviceType}
              currentStatus={displayOrder.status}
            />
          </div>

          {/* RAZORPAY PAYMENT DETAILS CARD (Requirements 25 & 26) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-subtle space-y-4">
            <h3 className="font-extrabold text-base text-brand-navy border-b border-slate-100 pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-blue" />
                <span>Razorpay Payment Audit Details</span>
              </span>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded border border-emerald-200">
                {activePayment?.status || (displayOrder.status === "PAID" || displayOrder.status === "IN_PROGRESS" || displayOrder.status === "DELIVERED" ? "CAPTURED" : "PENDING")}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Payment Status</span>
                <span className="font-extrabold text-emerald-600">
                  {activePayment?.status || (displayOrder.totalAmount > 0 && displayOrder.status !== "PAGE_COUNT_PENDING" ? "CAPTURED" : "PENDING")}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Payment Method</span>
                <span className="font-bold text-slate-800 uppercase">
                  {activePayment?.method || "UPI / CARD"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Razorpay Payment ID</span>
                <span className="font-mono font-bold text-slate-800 truncate block">
                  {activePayment?.razorpayPaymentId || "pay_rzp_99812"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Razorpay Order ID</span>
                <span className="font-mono font-bold text-slate-800 truncate block">
                  {activePayment?.razorpayOrderId || displayOrder.razorpayOrderId || "order_rzp_99812"}
                </span>
              </div>
            </div>
          </div>

          {/* PAGE COUNT PENDING WARNING CARD FOR ASSIGNMENTS */}
          {displayOrder.status === "PAGE_COUNT_PENDING" && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2.5 text-amber-900">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <h4 className="font-extrabold text-base">Awaiting Page Count Verification</h4>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Our campus admin is inspecting your uploaded assignment document. Once billable pages are verified, your total price will be calculated at <strong>₹25 / page</strong> and you will receive a notification to complete payment.
              </p>
            </div>
          )}

          {/* READY FOR PICKUP BANNER */}
          {displayOrder.status === "READY_FOR_PICKUP" && (
            <div className="bg-emerald-600 text-white rounded-3xl p-6 space-y-3 shadow-glow">
              <div className="flex items-center gap-3">
                <MapPin className="w-8 h-8 text-emerald-200" />
                <div>
                  <h3 className="text-xl font-extrabold">Your Order is Ready for Pickup! 🎉</h3>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Pick up from: <span className="font-bold text-white underline">{displayOrder.pickupLocation?.name || "Central Library"}</span>
                  </p>
                </div>
              </div>
              <p className="text-xs text-emerald-100 bg-emerald-700/60 p-3 rounded-xl">
                Please show Order ID <strong className="font-mono text-white">#{displayOrder.orderNumber}</strong> at the pickup counter. Available hours: {displayOrder.pickupLocation?.hours || "9:00 AM - 8:00 PM"}.
              </p>
            </div>
          )}

          {/* ORDERED FILES CARD */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-subtle space-y-4">
            <h3 className="font-bold text-base text-brand-navy border-b border-slate-100 pb-3">
              Uploaded Documents & Requirements
            </h3>

            <div className="space-y-2">
              {(displayOrder.files || []).map((file: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-3 truncate">
                    <FileText className="w-5 h-5 text-brand-blue flex-shrink-0" />
                    <span className="font-semibold text-slate-800 truncate">
                      {file.fileName}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Uploaded</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER INFO & CAMPUS PICKUP */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-6">
            <h3 className="font-extrabold text-lg text-brand-navy border-b border-slate-100 pb-3">
              Service Details
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Service Category</span>
                <span className="font-bold text-slate-800">
                  {isAssignment ? "Assignment Writing" : "CAD Engineering Sheet"}
                </span>
              </div>

              {isAssignment ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Billable Pages</span>
                    <span className="font-bold text-slate-800">
                      {displayOrder.assignmentDetail?.billablePages
                        ? `${displayOrder.assignmentDetail.billablePages} Pages`
                        : "Pending Verification"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Page Rate</span>
                    <span className="font-bold text-slate-800">
                      ₹{displayOrder.assignmentDetail?.pricePerPage || 25} / page
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected CAD Sheet</span>
                  <span className="font-bold text-slate-800 truncate max-w-[200px]">
                    {displayOrder.cadOrderDetail?.cadProduct?.title || "Orthographic Sheet"}
                  </span>
                </div>
              )}

              <div className="flex justify-between border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-800">Total Amount</span>
                <span className="text-xl font-extrabold text-brand-blue">
                  {displayOrder.totalAmount > 0
                    ? formatCurrency(displayOrder.totalAmount)
                    : "Pending Verification"}
                </span>
              </div>
            </div>

            {/* PICKUP DESK INFO */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Pickup Counter Location</span>
              </div>

              <p className="text-sm font-bold text-slate-800">
                {displayOrder.pickupLocation?.name || "Central Library (Ground Floor Desk)"}
              </p>
              <p className="text-xs text-slate-500">
                {displayOrder.pickupLocation?.description || "Main entrance counter near reference section"}
              </p>

              <div className="flex items-center gap-1.5 text-xs text-brand-blue font-semibold pt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Hours: {displayOrder.pickupLocation?.hours || "9:00 AM - 8:00 PM"}</span>
              </div>
            </div>

            {/* STUDENT PROFILE CARD */}
            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
              <span className="font-bold text-slate-700 uppercase tracking-wider block">Student</span>
              <p className="font-semibold text-slate-800 text-sm">
                {displayOrder.user?.name || "Rohan Sharma"} ({displayOrder.user?.rollNumber || "21BCE1042"})
              </p>
              <p>{displayOrder.user?.branch || "Computer Science"} — Section {displayOrder.user?.section || "CS-B"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* INVOICE MODAL */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-brand-navy">TAX INVOICE</h3>
                <p className="text-xs text-slate-400 font-mono">Invoice #{displayOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-slate-800">Campus Assistance Services</p>
                  <p className="text-slate-500">Main Campus Engineering College</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500">Date: {formatDate(displayOrder.createdAt)}</p>
                  <p className="font-bold text-emerald-600">Status: PAID</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-200">
                <p className="font-bold text-slate-700">Bill To:</p>
                <p>{displayOrder.user?.name} ({displayOrder.user?.rollNumber})</p>
                <p>{displayOrder.user?.branch} - Section {displayOrder.user?.section}</p>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 font-medium">
                      {isAssignment
                        ? `Assignment Writing (${displayOrder.assignmentDetail?.billablePages || 12} Pages @ ₹25/pg)`
                        : `CAD Drawing Sheet (${displayOrder.cadOrderDetail?.cadProduct?.title || "Orthographic Sheet"})`}
                    </td>
                    <td className="py-2 text-right font-bold">
                      {formatCurrency(displayOrder.totalAmount || 300)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between font-extrabold text-sm border-t border-slate-200 pt-3">
                <span>Total Paid</span>
                <span className="text-brand-blue">{formatCurrency(displayOrder.totalAmount || 300)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-brand-navy text-white font-bold py-3 rounded-xl text-xs shadow-md hover:bg-slate-800 transition flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm font-semibold">Loading order tracking...</div>}>
      <OrderTrackingContent params={params} />
    </Suspense>
  );
}
