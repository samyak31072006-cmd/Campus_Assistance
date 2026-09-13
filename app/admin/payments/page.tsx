"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Shield,
  Search,
  Filter,
  RefreshCw,
  Eye,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  ArrowLeft,
  X,
  Lock,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Refund Modal state
  const [refundModalPayment, setRefundModalPayment] = useState<any | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [isRefunding, setIsRefunding] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  async function fetchPayments() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payments?status=${statusFilter}&query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments || []);
      }
    } catch (e) {
      console.error("Error fetching payments:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundModalPayment) return;
    setIsRefunding(true);

    try {
      const res = await fetch(`/api/admin/payments/${refundModalPayment.id}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: refundModalPayment.amount,
          reason: refundReason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Refund of ${formatCurrency(data.amount)} processed successfully! Refund ID: ${data.refundId}`);
        setRefundModalPayment(null);
        fetchPayments();
      } else {
        alert("Refund failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error initiating refund.");
    } finally {
      setIsRefunding(false);
    }
  };

  const statusPills = [
    { label: "All Payments", value: "ALL" },
    { label: "Captured / Paid", value: "CAPTURED" },
    { label: "Created / Pending", value: "CREATED" },
    { label: "Failed", value: "FAILED" },
    { label: "Refunded", value: "REFUNDED" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Link href="/admin" className="text-slate-500 hover:text-brand-navy text-xs font-semibold flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Operations Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-brand-navy">
              Razorpay Payments Ledger
            </h1>
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
              Admin Financial Control
            </span>
          </div>
          <p className="text-slate-600 text-sm mt-1">
            Audit transactions, inspect Razorpay Payment & Order IDs, and process admin refunds.
          </p>
        </div>

        <button
          onClick={fetchPayments}
          className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* FILTER PILLS & SEARCH */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {statusPills.map((pill) => (
              <button
                key={pill.value}
                onClick={() => setStatusFilter(pill.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  statusFilter === pill.value
                    ? "bg-brand-navy text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Order ID or Payment ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* PAYMENTS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-3.5">Internal Order</th>
                <th className="p-3.5">Student</th>
                <th className="p-3.5">Service</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Method</th>
                <th className="p-3.5">Razorpay Payment ID</th>
                <th className="p-3.5">Razorpay Order ID</th>
                <th className="p-3.5">Payment Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 font-semibold">
                    Loading payments ledger...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 font-semibold">
                    No payment records found matching criteria.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-mono font-bold text-brand-navy">
                      #{p.order?.orderNumber}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-800">{p.order?.user?.name || "Student"}</div>
                      <div className="text-[10px] text-slate-400">{p.order?.user?.rollNumber}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">
                        {p.order?.serviceType}
                      </span>
                    </td>
                    <td className="p-3.5 font-extrabold text-slate-900">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="p-3.5 uppercase font-bold text-slate-600 text-[10px]">
                      {p.method || (p.provider === "DEMO" ? "DEMO" : "UPI")}
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-600">
                      {p.razorpayPaymentId || "—"}
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-600">
                      {p.razorpayOrderId || "—"}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border ${
                          p.status === "CAPTURED" || p.status === "PAID"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                            : p.status === "REFUNDED"
                            ? "bg-purple-50 text-purple-700 border-purple-300"
                            : p.status === "FAILED"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-300"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {(p.status === "CAPTURED" || p.status === "PAID") && (
                        <button
                          onClick={() => setRefundModalPayment(p)}
                          className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-1 rounded-lg text-xs font-bold transition inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Refund</span>
                        </button>
                      )}
                      <a
                        href={`/orders/${p.order?.orderNumber}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-brand-blue rounded-lg inline-block"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REFUND CONFIRMATION MODAL */}
      {refundModalPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-red-700 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  Admin Action: Issue Refund
                </span>
                <h3 className="text-xl font-extrabold text-brand-navy mt-1">
                  Refund Transaction
                </h3>
              </div>
              <button
                onClick={() => setRefundModalPayment(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-slate-800">
                  #{refundModalPayment.order?.orderNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Razorpay Payment ID:</span>
                <span className="font-mono font-bold text-slate-800 truncate max-w-[180px]">
                  {refundModalPayment.razorpayPaymentId || "pay_demo"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Refundable Amount:</span>
                <span className="font-extrabold text-red-600">
                  {formatCurrency(refundModalPayment.amount)}
                </span>
              </div>
            </div>

            <form onSubmit={handleRefundSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Reason for Refund
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Mention reason (e.g. Student cancelled before drafting)..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isRefunding}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isRefunding ? "Processing Refund..." : `Confirm Refund of ${formatCurrency(refundModalPayment.amount)}`}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
