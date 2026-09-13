"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  User,
  ShoppingBag,
  Bell,
  ArrowRight,
  Plus,
  FileText,
  Compass,
  MapPin,
  Clock,
  Download,
  CreditCard,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "profile" ? "profile" : "orders";

  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "notifications">(initialTab);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/student/dashboard");
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const user = data?.user || {
    name: "Rohan Sharma",
    email: "rohan.sharma@campus.edu",
    phone: "+91 98765 43210",
    rollNumber: "21BCE1042",
    branch: "Computer Science & Engg",
    section: "CS-B",
    collegeName: "Main Campus Institute of Technology",
  };

  const orders = data?.orders || [];
  const notifications = data?.notifications || [];

  const activeOrders = orders.filter((o: any) => o.status !== "DELIVERED" && o.status !== "CANCELLED");
  const pastOrders = orders.filter((o: any) => o.status === "DELIVERED" || o.status === "CANCELLED");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Student Greeting */}
      <div className="bg-gradient-to-r from-brand-navy via-slate-900 to-blue-950 text-white rounded-3xl p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-400/30">
            Student Portal
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome back, {user.name}!
          </h1>
          <p className="text-slate-300 text-sm">
            {user.branch} • Section {user.section} • Roll: <span className="font-mono">{user.rollNumber}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/assignments"
            className="bg-brand-blue hover:bg-blue-600 text-white font-bold px-5 py-3 rounded-xl text-xs shadow-md transition flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Upload Assignment</span>
          </Link>

          <Link
            href="/cad"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-5 py-3 rounded-xl text-xs transition flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Browse CAD Sheets</span>
          </Link>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "orders" ? "bg-brand-navy text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "notifications" ? "bg-brand-navy text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
          {notifications.length > 0 && (
            <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {notifications.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "profile" ? "bg-brand-navy text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* ORDERS TAB */}
      {activeTab === "orders" && (
        <div className="space-y-8">
          {/* ACTIVE ORDERS */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-xl text-brand-navy flex items-center gap-2">
              <span>Active Orders</span>
              <span className="bg-blue-100 text-brand-blue text-xs font-bold px-2.5 py-0.5 rounded-full">
                {activeOrders.length}
              </span>
            </h3>

            {activeOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 text-slate-500 text-sm">
                You don't have any active orders right now.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeOrders.map((order: any) => {
                  const isAssignment = order.serviceType === "ASSIGNMENT";
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-400 text-xs">
                            #{order.orderNumber}
                          </span>
                          <StatusBadge status={order.status} />
                        </div>

                        <div>
                          <h4 className="font-extrabold text-lg text-brand-navy">
                            {isAssignment
                              ? "Assignment Writing Assistance"
                              : order.cadOrderDetail?.cadProduct?.title || "CAD Drawing Sheet"}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">
                            {isAssignment
                              ? order.assignmentDetail?.billablePages
                                ? `${order.assignmentDetail.billablePages} Verified Pages @ ₹25/pg`
                                : "Page Count Pending Verification"
                              : "Engineering Sheet"}
                          </p>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                          <span className="text-slate-500">Pickup Spot:</span>
                          <span className="font-semibold text-slate-800">
                            {order.pickupLocation?.name || "Central Library"}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Total Payable
                          </span>
                          <span className="text-lg font-extrabold text-brand-blue">
                            {order.totalAmount > 0 ? formatCurrency(order.totalAmount) : "Pending"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {order.status === "PAGE_COUNT_VERIFIED" && (
                            <Link
                              href={`/checkout/assignment?orderNumber=${order.orderNumber}&pages=${order.assignmentDetail?.billablePages || 12}`}
                              className="bg-brand-blue text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs hover:bg-blue-700 transition"
                            >
                              Pay Now
                            </Link>
                          )}

                          <Link
                            href={`/orders/${order.orderNumber}`}
                            className="bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-brand-blue transition flex items-center gap-1"
                          >
                            <span>Track Order</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* PAST ORDERS */}
          {pastOrders.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="font-extrabold text-xl text-brand-navy">Past Completed Orders</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastOrders.map((order: any) => (
                  <div key={order.id} className="bg-white p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-slate-700">#{order.orderNumber}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="font-bold text-slate-800 text-sm">{order.serviceType} Service</p>
                    <div className="flex justify-between text-slate-500 pt-2 border-t border-slate-100">
                      <span>Paid: {formatCurrency(order.totalAmount)}</span>
                      <Link href={`/orders/${order.orderNumber}`} className="text-brand-blue font-bold">
                        View Invoice
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* NOTIFICATIONS TAB */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <h3 className="font-extrabold text-lg text-brand-navy">Notifications & Updates</h3>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-slate-400 text-xs">No notifications yet.</p>
            ) : (
              notifications.map((n: any) => (
                <div key={n.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <h4 className="font-bold text-sm text-slate-800">{n.title}</h4>
                  <p className="text-xs text-slate-600">{n.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">{formatDate(n.createdAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl space-y-6">
          <h3 className="font-extrabold text-xl text-brand-navy border-b border-slate-100 pb-3">
            Student Profile Settings
          </h3>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
              <input type="text" readOnly value={user.name} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">College Roll Number</label>
              <input type="text" readOnly value={user.rollNumber} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Branch</label>
                <input type="text" readOnly value={user.branch} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Section</label>
                <input type="text" readOnly value={user.section} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
              <input type="text" readOnly value={user.phone} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm font-semibold">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
