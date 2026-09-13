"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Compass,
  ArrowRight,
  CheckCircle2,
  Upload,
  Clock,
  ShieldCheck,
  MapPin,
  Sparkles,
  Search,
  Layers,
  ChevronRight,
  Zap,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  const [trackIdInput, setTrackIdInput] = useState("");

  const sampleCadItems = [
    {
      id: "cad-1",
      title: "Orthographic Projection — Sheet 03",
      category: "Orthographic",
      price: 149,
      turnaround: "24 hours",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "cad-2",
      title: "Isometric Projection — Sheet 01",
      category: "Isometric",
      price: 129,
      turnaround: "18 hours",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "cad-3",
      title: "Sectional View — Assembly Sheet 05",
      category: "Sectional",
      price: 169,
      turnaround: "24 hours",
      image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* ================= SECTION 1: HERO & TWO SERVICE CARDS ================= */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Decorative ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/60 to-transparent -z-10 pointer-events-none rounded-b-3xl" />
        
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs sm:text-sm font-semibold shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Campus Assignment & CAD Assistance</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-navy leading-tight">
            Your Deadline. <span className="text-brand-blue underline decoration-sky-400 decoration-wavy decoration-2">Sorted.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Get reliable assignment writing and CAD drafting assistance from skilled campus creators right inside your college campus.
          </p>
        </div>

        {/* TWO PRIMARY SERVICE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* SERVICE CARD 1: ASSIGNMENTS */}
          <div className="bg-white rounded-3xl p-8 border-2 border-slate-200/80 shadow-card hover:border-brand-blue card-hover-effect flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-100 transition" />
            
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
                <FileText className="w-7 h-7" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-brand-blue uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Service A
                </span>
                <span className="text-xs font-medium text-slate-500">Priced per page</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mb-3">
                Need an Assignment?
              </h2>

              <p className="text-slate-600 text-base mb-6 leading-relaxed">
                Upload your PDF or images. Our team verifies the page count and price, then our verified campus creators write it out neatly for you.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 font-medium block">Starting at</span>
                <span className="text-xl font-extrabold text-brand-navy">₹25 <span className="text-xs font-normal text-slate-500">/ page</span></span>
              </div>

              <Link
                href="/assignments"
                className="bg-brand-blue hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 group-hover:translate-x-1"
              >
                <span>Upload Assignment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* SERVICE CARD 2: CAD SHEETS */}
          <div className="bg-white rounded-3xl p-8 border-2 border-slate-200/80 shadow-card hover:border-emerald-500 card-hover-effect flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-100 transition" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-6 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
                <Compass className="w-7 h-7" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Service B
                </span>
                <span className="text-xs font-medium text-slate-500">Priced per sheet</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mb-3">
                Need a CAD Sheet?
              </h2>

              <p className="text-slate-600 text-base mb-6 leading-relaxed">
                Browse sample engineering drawing sheets, select what you need, upload your question sheet, and collect your completed physical drawing sheet on campus.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 font-medium block">Starting at</span>
                <span className="text-xl font-extrabold text-brand-navy">₹119 <span className="text-xs font-normal text-slate-500">/ sheet</span></span>
              </div>

              <Link
                href="/cad"
                className="bg-brand-navy hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 group-hover:translate-x-1"
              >
                <span>Browse CAD Sheets</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: HOW IT WORKS ================= */}
      <section id="how-it-works" className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              How It Works
            </h2>
            <p className="text-slate-400 text-base">
              Transparent, hassle-free process designed specifically for busy college students.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* FLOW 1: ASSIGNMENT */}
            <div className="bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-700 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <h3 className="text-xl font-bold">Assignment Writing Flow</h3>
                </div>
                <span className="text-xs text-blue-300 font-semibold bg-blue-900/50 px-2.5 py-1 rounded-full border border-blue-700/50">
                  Per-Page Verification
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
                {[
                  { step: "1", title: "Upload", desc: "PDF / Images" },
                  { step: "2", title: "Verify", desc: "Page Count & Price" },
                  { step: "3", title: "Pay", desc: "Online Payment" },
                  { step: "4", title: "We Write", desc: "Physical Writing" },
                  { step: "5", title: "Pickup", desc: "Campus Location" },
                ].map((s, idx) => (
                  <div key={s.step} className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 flex flex-col items-center justify-center">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-2">
                      {s.step}
                    </span>
                    <span className="text-xs font-bold text-slate-100">{s.title}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FLOW 2: CAD */}
            <div className="bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-700 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-xl font-bold">CAD Sheet Flow</h3>
                </div>
                <span className="text-xs text-emerald-300 font-semibold bg-emerald-900/50 px-2.5 py-1 rounded-full border border-emerald-700/50">
                  Instant Checkout
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
                {[
                  { step: "1", title: "Browse", desc: "Sample Sheets" },
                  { step: "2", title: "Select", desc: "Choose Sheet" },
                  { step: "3", title: "Pay", desc: "Online Payment" },
                  { step: "4", title: "Drafting", desc: "Expert Creators" },
                  { step: "5", title: "Pickup", desc: "Campus Location" },
                ].map((s, idx) => (
                  <div key={s.step} className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 flex flex-col items-center justify-center">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mb-2">
                      {s.step}
                    </span>
                    <span className="text-xs font-bold text-slate-100">{s.title}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: ASSIGNMENT SERVICE HIGHLIGHT ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-900 via-brand-navy to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Assignment Writing Service
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                Assignments without the last-minute panic.
              </h2>

              <p className="text-slate-300 text-base leading-relaxed">
                Got a multi-page physics or coding assignment due tomorrow? Upload the PDF, sit back, and pick up your hand-written physical submission from Central Library.
              </p>

              <ul className="space-y-3 text-sm text-slate-200">
                {[
                  "Dynamic per-page pricing (verified by admin team)",
                  "Select your deadline date & exact campus pickup spot",
                  "Neat handwriting guaranteed by rated campus creators",
                  "Full confidentiality & tracking updates at every step",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <Link
                  href="/assignments"
                  className="inline-flex items-center gap-2 bg-brand-blue hover:bg-blue-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Assignment Now</span>
                </Link>
              </div>
            </div>

            {/* Visual Pricing Card Mockup */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-white space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-sm font-semibold text-blue-200">Sample Price Calculation</span>
                <span className="bg-emerald-400/20 text-emerald-300 text-xs font-bold px-2 py-0.5 rounded border border-emerald-400/30">
                  Verified Page Rate
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-300">Assignment File:</span>
                  <span className="font-semibold text-white">Physics_Unit2.pdf</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Verified Billable Pages:</span>
                  <span className="font-semibold text-white">12 Pages</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Price per page:</span>
                  <span className="font-semibold text-white">₹25 / page</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-300 block">Total Payable</span>
                  <span className="text-2xl font-extrabold text-white">12 × ₹25 = ₹300</span>
                </div>
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  Ready to Pay
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: CAD SERVICE BROWSER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4" />
              CAD & Engineering Drawing
            </div>
            <h2 className="text-3xl font-extrabold text-brand-navy">
              Need a CAD Sheet?
            </h2>
            <p className="text-slate-600 text-base mt-1">
              Browse reference sample sheets, pick your drawing type, and order instant drafting.
            </p>
          </div>

          <Link
            href="/cad"
            className="inline-flex items-center gap-2 text-brand-blue font-bold hover:underline text-base"
          >
            <span>View All CAD Sheets</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* CAD Sample Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleCadItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden card-hover-effect flex flex-col justify-between"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden group">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-3 left-3 bg-brand-navy/90 text-white text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  {item.category}
                </span>
                <span className="absolute bottom-3 right-3 bg-white/90 text-slate-800 text-xs font-bold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                  <Clock className="w-3 h-3 text-brand-blue" />
                  {item.turnaround}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-brand-navy line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1">
                    IS standard dimensions, title block layout, and clean linework.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Price</span>
                    <span className="text-lg font-extrabold text-brand-navy">
                      {formatCurrency(item.price)}
                    </span>
                  </div>

                  <Link
                    href={`/cad/${item.id}`}
                    className="bg-slate-900 hover:bg-brand-blue text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>View Sheet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SECTION 5: WHY STUDENTS USE US ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-3xl font-extrabold text-brand-navy">
            Why Students Use Us
          </h2>
          <p className="text-slate-600 text-base">
            Built by students, for students. Safe, fast, and 100% campus-native.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: MapPin,
              title: "Campus Based",
              desc: "Zero shipping hassle. Pick up completed work at your library, canteen, or hostel desk.",
              color: "text-blue-600 bg-blue-50",
            },
            {
              icon: Zap,
              title: "Transparent Pricing",
              desc: "Clear per-page rate for assignments and upfront per-sheet price for CAD.",
              color: "text-emerald-600 bg-emerald-50",
            },
            {
              icon: Upload,
              title: "Easy Ordering",
              desc: "Upload question sheets from your phone or laptop in less than 30 seconds.",
              color: "text-purple-600 bg-purple-50",
            },
            {
              icon: ShieldCheck,
              title: "Convenient Pickup",
              desc: "Flexible timing slots matched to your college class schedule.",
              color: "text-amber-600 bg-amber-50",
            },
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-3 hover:border-slate-300 transition"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-brand-navy">{card.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= SECTION 6: ORDER TRACKING PREVIEW ================= */}
      <section id="track" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 lg:p-12 space-y-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider bg-blue-100/60 px-3 py-1 rounded-full">
              Live Order Tracker
            </span>
            <h2 className="text-3xl font-extrabold text-brand-navy">
              Track Your Order Status
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Enter your Order Number (e.g. <span className="font-mono bg-white px-1.5 py-0.5 rounded border text-brand-blue font-bold">ASG1024</span> or <span className="font-mono bg-white px-1.5 py-0.5 rounded border text-brand-blue font-bold">CAD1001</span>) to see real-time progress.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="text"
              placeholder="Enter Order ID (e.g. ASG1024)"
              value={trackIdInput}
              onChange={(e) => setTrackIdInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm font-mono"
            />
            <Link
              href={trackIdInput ? `/orders/${trackIdInput.toUpperCase()}` : "/orders/ASG1024"}
              className="bg-brand-navy hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Track Now</span>
            </Link>
          </div>

          {/* Interactive Order Card Preview */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle max-w-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Example Order</span>
                <h3 className="text-xl font-bold text-brand-navy font-mono">#ASG1024</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-50 text-brand-blue font-bold text-xs px-2.5 py-1 rounded-full border border-blue-200">
                  Assignment Writing (12 Pages)
                </span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  ₹300 Paid
                </span>
              </div>
            </div>

            {/* Stepper sequence */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
              {[
                { label: "Uploaded", state: "done" },
                { label: "Page Count Verified", state: "done" },
                { label: "Payment Confirmed", state: "done" },
                { label: "Being Prepared", state: "active" },
                { label: "Quality Check", state: "pending" },
                { label: "Ready for Pickup", state: "pending" },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-center font-medium ${
                    s.state === "done"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : s.state === "active"
                      ? "bg-brand-blue text-white border-brand-blue font-bold shadow-xs animate-pulse"
                      : "bg-slate-50 text-slate-400 border-slate-200"
                  }`}
                >
                  <span className="block font-bold text-[10px] uppercase opacity-70 mb-0.5">
                    Step {idx + 1}
                  </span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 7: FINAL CTA ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-navy text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Got a deadline?</h2>
            <p className="text-slate-300 text-base">
              Get your assignment or CAD sheet sorted today right inside your college campus.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/assignments"
              className="w-full sm:w-auto bg-brand-blue hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-xl text-base shadow-lg transition flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              <span>Upload Assignment</span>
            </Link>

            <Link
              href="/cad"
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-4 rounded-xl text-base border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5 text-emerald-400" />
              <span>Browse CAD Sheets</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
