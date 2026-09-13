"use client";

import React, { useEffect, useState } from "react";
import {
  Code,
  FileText,
  Compass,
  CheckCircle2,
  Clock,
  DollarSign,
  Star,
  Award,
  Upload,
  ArrowRight,
  Eye,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function CreatorDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCreatorData();
  }, []);

  async function fetchCreatorData() {
    setLoading(true);
    try {
      const res = await fetch("/api/creator/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        setProfile(data.creatorProfile || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/creator/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchCreatorData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Creator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-2">
            <Code className="w-3.5 h-3.5" />
            Campus Creator Workstation
          </div>
          <h1 className="text-3xl font-extrabold text-brand-navy">
            Creator Dashboard
          </h1>
          <p className="text-slate-600 text-sm">
            View assigned writing & CAD jobs, track completion proof, and monitor payout earnings.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{profile?.rating || 4.9} Creator Rating</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="text-xs font-extrabold text-slate-800">
            Total Payout: {formatCurrency(profile?.totalEarnings || 7560)}
          </div>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Active Assigned Jobs
          </span>
          <span className="text-2xl font-extrabold text-brand-navy">
            {orders.filter((o) => o.status === "IN_PROGRESS" || o.status === "PAID").length} Jobs
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Pending Quality Check
          </span>
          <span className="text-2xl font-extrabold text-teal-600">
            {orders.filter((o) => o.status === "QUALITY_CHECK").length} Jobs
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Completed Orders
          </span>
          <span className="text-2xl font-extrabold text-emerald-600">
            {profile?.totalOrders || 42} Completed
          </span>
        </div>
      </div>

      {/* ASSIGNED JOBS LIST */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-xl text-brand-navy">Assigned Jobs & Payouts</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => {
            const isAssignment = order.serviceType === "ASSIGNMENT";
            const creatorPayout = isAssignment
              ? (order.totalAmount || 300) * 0.6
              : (order.totalAmount || 149) * 0.67;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded font-bold text-xs ${
                        isAssignment ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {isAssignment ? "ASSIGNMENT WRITING" : "CAD DRAFTING"}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      #{order.orderNumber}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-extrabold text-brand-navy">
                      {isAssignment
                        ? `Assignment (${order.assignmentDetail?.billablePages || 12} Pages)`
                        : order.cadOrderDetail?.cadProduct?.title || "CAD Sheet"}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Target Deadline: <span className="font-semibold text-slate-800">{formatDate(order.deadline)}</span>
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Student Instructions:</span>
                      <span className="font-semibold text-slate-800 text-right truncate max-w-[200px]">
                        {order.instructions || "Standard formatting"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pickup Counter:</span>
                      <span className="font-semibold text-slate-800">
                        {order.pickupLocation?.name || "Central Library"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Creator Payout
                    </span>
                    <span className="text-xl font-extrabold text-emerald-600">
                      {formatCurrency(creatorPayout)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === "PAID" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "IN_PROGRESS")}
                        className="bg-brand-blue hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition"
                      >
                        Start Work
                      </button>
                    )}

                    {order.status === "IN_PROGRESS" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "QUALITY_CHECK")}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition"
                      >
                        Submit for QC
                      </button>
                    )}

                    {order.status === "QUALITY_CHECK" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "READY_FOR_PICKUP")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition"
                      >
                        Mark Ready
                      </button>
                    )}

                    <a
                      href={`/orders/${order.orderNumber}`}
                      target="_blank"
                      className="p-2 text-slate-400 hover:text-brand-navy"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
