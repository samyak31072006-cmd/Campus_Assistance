"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Clock,
  CheckCircle2,
  Upload,
  ArrowRight,
  ShieldCheck,
  MapPin,
  X,
  Eye,
  Maximize2,
  Sparkles,
  Award,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CadSheetDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [questionFile, setQuestionFile] = useState<{ name: string; url: string } | null>({
    name: "Engineering_Drawing_Question_Problem3.jpg",
    url: "/uploads/question.jpg",
  });
  const [instructions, setInstructions] = useState("");
  const [pickupLocationId, setPickupLocationId] = useState("loc-1");
  const [showSampleModal, setShowSampleModal] = useState(false);

  const cadDetail = {
    id: params.id || "cad-1",
    title: "Orthographic Projection — Sheet 03",
    category: "Orthographic Projection",
    price: 149,
    turnaround: "24 hours",
    difficulty: "Intermediate",
    availability: "Available",
    description:
      "First & Third Angle Projections of Complex Machine Blocks. Includes front, top, and side elevation views with exact IS standard dimensioning, hatching, and title block layout.",
    sampleImages: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80",
    ],
    // Final prepared sheet sample uploaded by admin
    preparedSampleUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=80",
  };

  const [activeImage, setActiveImage] = useState(cadDetail.sampleImages[0]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setQuestionFile({
        name: file.name,
        url: URL.createObjectURL(file),
      });
    }
  };

  const handleProceedToCheckout = () => {
    const query = new URLSearchParams({
      cadId: cadDetail.id,
      title: cadDetail.title,
      price: cadDetail.price.toString(),
      questionFile: questionFile?.name || "",
      instructions,
      pickupLocationId,
    }).toString();

    router.push(`/checkout/cad?${query}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-brand-navy">Home</Link>
        <span>/</span>
        <Link href="/cad" className="hover:text-brand-navy">CAD Sheets</Link>
        <span>/</span>
        <span className="text-slate-800 font-bold truncate">{cadDetail.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: SAMPLE GALLERY, PREPARED SHEET SAMPLE & SPECIFICATIONS */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Gallery Preview */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-subtle overflow-hidden">
            <div className="h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 relative group">
              <img
                src={activeImage}
                alt={cadDetail.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-brand-navy text-white text-xs font-bold px-3 py-1 rounded-lg">
                {cadDetail.category}
              </span>
            </div>

            {/* Thumbnail selector */}
            <div className="flex items-center gap-3 mt-4">
              {cadDetail.sampleImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    activeImage === img ? "border-brand-blue scale-95" : "border-slate-200 opacity-70"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ADMIN-UPLOADED SAMPLE OF FINAL PREPARED PHYSICAL SHEET */}
          <div className="bg-gradient-to-br from-slate-900 via-brand-navy to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 relative overflow-hidden border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  Admin Verified Final Sheet Sample
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  Sample of Final Prepared Sheet
                </h3>
              </div>

              <button
                onClick={() => setShowSampleModal(true)}
                className="bg-brand-blue hover:bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Zoom & Inspect Full Sheet</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This is an actual sample of the final drafted physical sheet uploaded by our team. Inspect the title block, line weights, IS standard dimensioning, and hand drawing neatness before placing your order.
            </p>

            <div
              onClick={() => setShowSampleModal(true)}
              className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/80 cursor-pointer group"
            >
              <img
                src={cadDetail.preparedSampleUrl}
                alt="Sample of Final Prepared Sheet"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition flex items-center justify-center">
                <span className="bg-white/90 text-brand-navy font-extrabold text-xs px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 backdrop-blur-xs group-hover:scale-105 transition">
                  <Eye className="w-4 h-4 text-brand-blue" />
                  Click to View Full-Screen Sample Sheet
                </span>
              </div>
            </div>
          </div>

          {/* Description & Features */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-4">
            <h3 className="font-extrabold text-xl text-brand-navy">About This CAD Sheet</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{cadDetail.description}</p>

            <div className="pt-3 border-t border-slate-100">
              <h4 className="font-bold text-sm text-brand-navy mb-3">What You'll Receive:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                {[
                  "Professionally drafted physical sheet",
                  "IS Standard dimensions checked",
                  "Standard title block layout",
                  "Campus location delivery/pickup",
                  "Real-time order tracking updates",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER FORM & CHECKOUT */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-card space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {cadDetail.availability}
                </span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-blue" />
                  {cadDetail.turnaround} Turnaround
                </span>
              </div>

              <h1 className="text-2xl font-extrabold text-brand-navy leading-tight">
                {cadDetail.title}
              </h1>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-brand-navy">
                  {formatCurrency(cadDetail.price)}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ sheet</span>
              </div>
            </div>

            {/* UPLOAD EXACT QUESTION OR REFERENCE */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Upload Exact Question / Reference
              </label>

              {questionFile ? (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="truncate text-xs font-semibold text-slate-800">
                    📄 {questionFile.name}
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuestionFile(null)}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center relative hover:border-emerald-500 transition">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-slate-600 block">
                    Upload Question Sheet (PDF, JPG, PNG)
                  </span>
                </div>
              )}
            </div>

            {/* INSTRUCTIONS */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Custom Instructions
              </label>
              <textarea
                rows={3}
                placeholder="E.g. Use 3rd angle projection, specific scale (1:1), or specific title block notes..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* PICKUP LOCATION */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Campus Pickup Location
              </label>
              <select
                value={pickupLocationId}
                onChange={(e) => setPickupLocationId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
              >
                <option value="loc-1">Central Library (Ground Floor Desk)</option>
                <option value="loc-2">Academic Block 1 (A-Block Canteen)</option>
                <option value="loc-3">Hostel Complex (Block A Reception)</option>
                <option value="loc-4">Mechanical Engineering Dept Lab</option>
                <option value="loc-5">Sports Complex Pavilion</option>
              </select>
            </div>

            {/* ORDER CTA */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 px-6 rounded-2xl text-base shadow-lg transition flex items-center justify-center gap-2 group"
            >
              <span>Order This Sheet — {formatCurrency(cadDetail.price)}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>

            <p className="text-center text-[11px] text-slate-400 font-medium">
              ⚡ Instant order placement. Zero waiting for page verification.
            </p>
          </div>
        </div>
      </div>

      {/* FULL-SCREEN PREPARED SHEET SAMPLE LIGHTBOX MODAL */}
      {showSampleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 relative">
            <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-base sm:text-lg">
                  Sample Final Prepared Physical Sheet
                </h3>
              </div>
              <button
                onClick={() => setShowSampleModal(false)}
                className="bg-slate-800 hover:bg-slate-700 p-2 rounded-xl text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-950 flex items-center justify-center">
              <img
                src={cadDetail.preparedSampleUrl}
                alt="Full Prepared CAD Sheet Sample"
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
              />
            </div>

            <div className="p-4 bg-slate-900 text-slate-300 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
              <span>Verified Creator Quality Standard • IS Standard 10711 Line Weights</span>
              <button
                onClick={() => setShowSampleModal(false)}
                className="bg-brand-blue hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
