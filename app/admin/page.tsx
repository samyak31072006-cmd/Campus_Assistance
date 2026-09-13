"use client";

import React, { useEffect, useState } from "react";
import {
  Shield,
  FileText,
  Compass,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Search,
  Filter,
  Eye,
  Edit3,
  UserCheck,
  MapPin,
  Settings,
  X,
  Plus,
  Upload,
  Image,
  Award,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "cad" | "pricing">("orders");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State for Page Count Verification
  const [verifyingOrder, setVerifyingOrder] = useState<any | null>(null);
  const [verifyForm, setVerifyForm] = useState({
    billablePages: "12",
    pricePerPage: "25",
    rushFee: "0",
    additionalFee: "0",
  });
  const [isVerifying, setIsVerifying] = useState(false);

  // Modal State for CAD Sample Upload
  const [editingCadProduct, setEditingCadProduct] = useState<any | null>(null);
  const [sampleUrlInput, setSampleUrlInput] = useState("");
  const [isUpdatingSample, setIsUpdatingSample] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  async function fetchAdminData() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error("Error loading admin data:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingOrder) return;
    setIsVerifying(true);

    try {
      const res = await fetch("/api/admin/verify-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: verifyingOrder.id,
          billablePages: verifyForm.billablePages,
          pricePerPage: verifyForm.pricePerPage,
          rushFee: verifyForm.rushFee,
          additionalFee: verifyForm.additionalFee,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setVerifyingOrder(null);
        fetchAdminData();
      } else {
        alert("Verification failed.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSampleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCadProduct) return;
    setIsUpdatingSample(true);

    try {
      const res = await fetch("/api/admin/cad/update-sample", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cadProductId: editingCadProduct.id,
          preparedSampleUrl: sampleUrlInput,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Prepared sheet sample updated successfully!");
        setEditingCadProduct(null);
        fetchAdminData();
      } else {
        alert("Failed to update sample image.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred while updating sample.");
    } finally {
      setIsUpdatingSample(false);
    }
  };

  // Metrics calculation
  const totalRevenue = orders
    .filter((o) => o.status !== "CANCELLED" && o.status !== "PAGE_COUNT_PENDING")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const pendingVerificationCount = orders.filter((o) => o.status === "PAGE_COUNT_PENDING").length;
  const inProgressCount = orders.filter((o) => o.status === "IN_PROGRESS").length;
  const readyCount = orders.filter((o) => o.status === "READY_FOR_PICKUP").length;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const cadProductsList = [
    {
      id: "cad-1",
      title: "Orthographic Projection — Sheet 03",
      category: "Orthographic Projection",
      price: 149,
      preparedSampleUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "cad-2",
      title: "Isometric Projection — Sheet 01",
      category: "Isometric Projection",
      price: 129,
      preparedSampleUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "cad-3",
      title: "Sectional View — Assembly Sheet 05",
      category: "Sectional Views",
      price: 169,
      preparedSampleUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* SaaS Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 mb-2">
            <Shield className="w-3.5 h-3.5" />
            SaaS Admin Operations Dashboard
          </div>
          <h1 className="text-3xl font-extrabold text-brand-navy">
            Campus Operations Control
          </h1>
          <p className="text-slate-600 text-sm">
            Manage assignment page verification, CAD catalogue, creator payouts, and campus pickup locations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "orders" ? "bg-brand-navy text-white" : "bg-white text-slate-700 border"
            }`}
          >
            Orders & Verification
          </button>
          <button
            onClick={() => setActiveTab("cad")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "cad" ? "bg-brand-navy text-white" : "bg-white text-slate-700 border"
            }`}
          >
            CAD Catalogue & Samples
          </button>
        </div>
      </div>

      {/* EXECUTIVE KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total Revenue
          </span>
          <span className="text-2xl font-extrabold text-brand-navy">
            {formatCurrency(totalRevenue)}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold block">
            ↑ Verified & Paid Orders
          </span>
        </div>

        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
            Pending Page Count
          </span>
          <span className="text-2xl font-extrabold text-amber-900">
            {pendingVerificationCount} Orders
          </span>
          <span className="text-[10px] text-amber-700 font-semibold block">
            Requires Admin Review
          </span>
        </div>

        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">
            In Progress
          </span>
          <span className="text-2xl font-extrabold text-blue-900">
            {inProgressCount} Orders
          </span>
          <span className="text-[10px] text-blue-700 font-semibold block">
            Creators Drafting/Writing
          </span>
        </div>

        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
            Ready for Pickup
          </span>
          <span className="text-2xl font-extrabold text-emerald-900">
            {readyCount} Orders
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold block">
            At Campus Pickup Desks
          </span>
        </div>
      </div>

      {/* MAIN ORDERS TABLE TAB */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="font-extrabold text-lg text-brand-navy">Recent Student Orders</h3>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by Order ID or Student..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium bg-white"
              >
                <option value="ALL">All Statuses</option>
                <option value="PAGE_COUNT_PENDING">Pending Verification</option>
                <option value="PAGE_COUNT_VERIFIED">Page Count Verified</option>
                <option value="PAID">Paid</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                <option value="DELIVERED">Delivered</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Student</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Billable Details</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No orders matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-mono font-bold text-brand-navy">
                        #{order.orderNumber}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{order.user?.name || "Student"}</div>
                        <div className="text-[10px] text-slate-400">{order.user?.rollNumber}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            order.serviceType === "ASSIGNMENT"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {order.serviceType}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700">
                        {order.serviceType === "ASSIGNMENT" ? (
                          order.assignmentDetail?.billablePages ? (
                            `${order.assignmentDetail.billablePages} Pages @ ₹${order.assignmentDetail.pricePerPage}/pg`
                          ) : (
                            <span className="text-amber-600 font-bold">Pending Review</span>
                          )
                        ) : (
                          order.cadOrderDetail?.cadProduct?.title || "CAD Sheet"
                        )}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {order.totalAmount > 0 ? formatCurrency(order.totalAmount) : "Pending"}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {order.status === "PAGE_COUNT_PENDING" && (
                          <button
                            onClick={() => {
                              setVerifyingOrder(order);
                              setVerifyForm({
                                billablePages: "12",
                                pricePerPage: "25",
                                rushFee: "0",
                                additionalFee: "0",
                              });
                            }}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-xs transition"
                          >
                            Verify Pages
                          </button>
                        )}

                        <a
                          href={`/orders/${order.orderNumber}`}
                          target="_blank"
                          className="p-1.5 text-slate-500 hover:text-brand-blue rounded-lg inline-block"
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
      )}

      {/* CAD CATALOGUE & ADMIN PREPARED SHEET SAMPLES TAB */}
      {activeTab === "cad" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Award className="w-4 h-4" />
                Admin Sample Sheet Management
              </div>
              <h3 className="font-extrabold text-xl text-brand-navy">
                CAD Catalogue & Prepared Sheet Samples
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            As an Admin, you can upload and manage the <strong>"Final Prepared Sheet Sample"</strong> for any CAD sheet item. Students inspect this sample before ordering to verify title block layout, linework neatness, and IS dimensioning standards.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cadProductsList.map((product) => (
              <div key={product.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {product.category}
                    </span>
                    <h4 className="font-extrabold text-slate-800 text-sm mt-1">{product.title}</h4>
                    <p className="text-xs text-slate-500">{formatCurrency(product.price)} / sheet</p>
                  </div>
                </div>

                {/* Prepared Sheet Sample Preview Box */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    Current Final Prepared Sample:
                  </span>
                  <div className="h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 relative group">
                    <img
                      src={product.preparedSampleUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <span className="text-white text-xs font-bold flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Sample Active
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setEditingCadProduct(product);
                    setSampleUrlInput(product.preparedSampleUrl);
                  }}
                  className="w-full bg-brand-navy hover:bg-brand-blue text-white font-bold py-2 px-3 rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload / Change Prepared Sample</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE COUNT VERIFICATION MODAL */}
      {verifyingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded">
                  Admin Verification Action
                </span>
                <h3 className="text-xl font-extrabold text-brand-navy mt-1">
                  Verify Billable Page Count
                </h3>
              </div>
              <button
                onClick={() => setVerifyingOrder(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-slate-800">#{verifyingOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-800">{verifyingOrder.user?.name}</span>
              </div>
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Billable Pages
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={verifyForm.billablePages}
                    onChange={(e) => setVerifyForm({ ...verifyForm, billablePages: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Price / Page (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={verifyForm.pricePerPage}
                    onChange={(e) => setVerifyForm({ ...verifyForm, pricePerPage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm shadow-md transition"
              >
                {isVerifying ? "Confirming..." : "Confirm Price & Notify Student"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN UPLOAD PREPARED SAMPLE MODAL */}
      {editingCadProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                  Admin Prepared Sheet Upload
                </span>
                <h3 className="text-xl font-extrabold text-brand-navy mt-1">
                  Upload Final Prepared Sheet Sample
                </h3>
              </div>
              <button
                onClick={() => setEditingCadProduct(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">{editingCadProduct.title}</p>
              <p>Category: {editingCadProduct.category}</p>
            </div>

            <form onSubmit={handleSampleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Sample Image URL / Upload Path
                </label>
                <input
                  type="text"
                  required
                  value={sampleUrlInput}
                  onChange={(e) => setSampleUrlInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="https://... or /uploads/sample_sheet.jpg"
                />
              </div>

              {sampleUrlInput && (
                <div className="h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={sampleUrlInput} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <button
                type="submit"
                disabled={isUpdatingSample}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{isUpdatingSample ? "Saving Sample..." : "Save & Publish Prepared Sample"}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
