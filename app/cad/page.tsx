"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Search,
  Filter,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const CAD_CATEGORIES = [
  "All Categories",
  "Orthographic Projection",
  "Isometric Projection",
  "Sectional Views",
  "Development of Surfaces",
  "Projection of Lines",
  "Projection of Planes",
  "AutoCAD",
];

const SAMPLE_CAD_DATA = [
  {
    id: "cad-1",
    title: "Orthographic Projection — Sheet 03",
    description: "First & Third Angle Projections of Complex Machine Blocks. Includes front, top, and side elevation views with exact IS standard dimensioning.",
    category: "Orthographic Projection",
    price: 149,
    turnaround: "24 hours",
    difficulty: "Intermediate",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cad-2",
    title: "Isometric Projection — Sheet 01",
    description: "3D Isometric view layout of stepped cylinder and slotted prism. Features isometric scale construction and hidden line representations.",
    category: "Isometric Projection",
    price: 129,
    turnaround: "18 hours",
    difficulty: "Basic",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cad-3",
    title: "Sectional View — Assembly Sheet 05",
    description: "Full Sectional and Half Sectional Views of Flange Coupling assembly. Shows hatch patterns, centerlines, and bill of materials.",
    category: "Sectional Views",
    price: 169,
    turnaround: "24 hours",
    difficulty: "Advanced",
    availability: "High Demand",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cad-4",
    title: "Development of Surfaces — Sheet 02",
    description: "Radial line and Parallel line developments for truncated cone, pyramid, and elbow pipe transitions.",
    category: "Development of Surfaces",
    price: 159,
    turnaround: "24 hours",
    difficulty: "Intermediate",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cad-5",
    title: "Projection of Lines & Planes — Sheet 04",
    description: "True length determination, inclinations (HP/VP), traces (HT/VT), and auxiliary plane projections.",
    category: "Projection of Lines",
    price: 119,
    turnaround: "12 hours",
    difficulty: "Basic",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cad-6",
    title: "AutoCAD 2D Mechanical Component Layout",
    description: "Professional AutoCAD .dwg layout print with title block, layers, line weights, and dimensioning standards.",
    category: "AutoCAD",
    price: 199,
    turnaround: "36 hours",
    difficulty: "Advanced",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
  },
];

export default function CadCataloguePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const filteredItems = SAMPLE_CAD_DATA.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All Categories" || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <Compass className="w-3.5 h-3.5" />
          Service B — CAD & Engineering Drawing Assistance
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
          Find Your CAD Sheet
        </h1>
        <p className="text-slate-600 text-base">
          Browse sample drawings, select the sheet type you need, upload your question paper, and receive a completed sheet on campus.
        </p>
      </div>

      {/* SEARCH BAR & CATEGORY FILTERS */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-subtle space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search engineering drawings by sheet name or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CAD_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? "bg-brand-navy text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* VISUAL GRID OF CAD CARDS */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Compass className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-xl font-bold text-slate-700">No sheets found</h3>
          <p className="text-slate-500 text-sm">
            Try adjusting your search terms or selecting "All Categories".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden card-hover-effect flex flex-col justify-between group"
            >
              <div className="relative h-52 bg-slate-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-3 left-3 bg-brand-navy/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  {item.category}
                </span>
                <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  {item.availability}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-extrabold text-xl text-brand-navy group-hover:text-brand-blue transition">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-4">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-brand-blue" />
                      {item.turnaround}
                    </span>
                    <span>•</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold">
                      {item.difficulty}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Priced per sheet</span>
                    <span className="text-xl font-extrabold text-brand-navy">
                      {formatCurrency(item.price)}
                    </span>
                  </div>

                  <Link
                    href={`/cad/${item.id}`}
                    className="bg-brand-navy hover:bg-brand-blue text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>View Sheet</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
