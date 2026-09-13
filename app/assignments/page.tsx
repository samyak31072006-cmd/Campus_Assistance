"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Calendar,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
}

export default function AssignmentUploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<UploadedFile[]>([
    {
      id: "f-1",
      name: "Engineering_Physics_Unit3.pdf",
      size: "2.4 MB",
      type: "application/pdf",
      url: "/uploads/sample.pdf",
    },
  ]);
  
  const [formData, setFormData] = useState({
    studentName: "Rohan Sharma",
    rollNumber: "21BCE1042",
    branch: "Computer Science",
    section: "CS-B",
    phone: "+91 98765 43210",
    pickupLocationId: "",
    deadline: "2026-09-08T17:00",
    instructions: "Please write neatly using blue pen with clear section headings.",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<any>(null);

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      const newUploaded: UploadedFile[] = selected.map((file, idx) => ({
        id: `f-${Date.now()}-${idx}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type,
        url: URL.createObjectURL(file),
      }));
      setFiles((prev) => [...prev, ...newUploaded]);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please upload at least one assignment document or image.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/assignments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          files: files.map((f) => ({ name: f.name, url: f.url })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedOrder(data.order);
      } else {
        alert("Failed to submit assignment. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during upload.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-bold border border-blue-200">
          <FileText className="w-3.5 h-3.5" />
          Service A — Assignment Assistance
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">
          Upload Your Assignment
        </h1>
        <p className="text-slate-600 text-base">
          Upload your assignment documents (PDF, JPG, PNG). Our team will verify the page count and price before payment.
        </p>
      </div>

      {/* Success View after Submission */}
      {submittedOrder ? (
        <div className="bg-white rounded-3xl p-8 border-2 border-emerald-500 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Your assignment has been uploaded!
              </h2>
              <p className="text-slate-600 text-sm">
                Order ID: <span className="font-mono font-bold text-brand-blue">{submittedOrder.orderNumber}</span>
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3 text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-bold">Page count will be verified by our team before payment.</p>
              <p className="text-amber-800">
                You do not need to pay right now. Our campus admin will inspect the document, enter the final billable page count (e.g. 12 pages × ₹25 = ₹300), and notify you to proceed with payment.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
            <h3 className="font-bold text-base text-brand-navy">Order Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500 block text-xs">Uploaded Files</span>
                <span className="font-semibold text-slate-800">
                  {submittedOrder.files?.length || 1} Document(s)
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Page Count Status</span>
                <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded text-xs">
                  Awaiting Admin Review
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Rate Rule</span>
                <span className="font-semibold text-slate-800">₹25 / Verified Page</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Pickup Location</span>
                <span className="font-semibold text-slate-800">
                  Central Library (Ground Floor Desk)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              href={`/orders/${submittedOrder.orderNumber}`}
              className="flex-1 bg-brand-blue hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl text-center shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Track Order & View Updates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-6 rounded-xl text-center transition"
            >
              Go to My Dashboard
            </Link>
          </div>
        </div>
      ) : (
        /* Upload Form */
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* UPLOAD BOX */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-dashed border-slate-300 hover:border-brand-blue transition text-center space-y-4 relative group">
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileDrop}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mx-auto group-hover:scale-110 transition duration-200">
              <Upload className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-brand-navy">
                Drop your assignment here
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Supports <span className="font-semibold text-slate-700">PDF, JPG, JPEG, or PNG</span> (Up to 25 MB per file)
              </p>
            </div>

            <button
              type="button"
              className="bg-brand-navy hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-sm transition inline-flex items-center gap-2 pointer-events-none"
            >
              <span>Browse Files</span>
            </button>
          </div>

          {/* UPLOADED FILE CARDS */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Uploaded Files ({files.length})
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0 font-bold text-xs">
                        PDF
                      </div>
                      <div className="truncate">
                        <h4 className="text-sm font-bold text-slate-800 truncate">
                          {file.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span className="bg-amber-50 text-amber-700 px-2 py-0.2 rounded font-semibold text-[11px]">
                            Page count pending verification
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STUDENT DETAILS & OPTIONS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
            <h3 className="text-xl font-extrabold text-brand-navy border-b border-slate-100 pb-3">
              Student & Order Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Roll Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Branch & Department
                </label>
                <input
                  type="text"
                  required
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Section / Group
                </label>
                <input
                  type="text"
                  required
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Deadline Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Campus Pickup Location
                </label>
                <select
                  value={formData.pickupLocationId}
                  onChange={(e) => setFormData({ ...formData, pickupLocationId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-blue outline-none bg-white"
                >
                  <option value="">Central Library (Ground Floor Desk)</option>
                  <option value="loc-2">Academic Block 1 (A-Block Canteen)</option>
                  <option value="loc-3">Hostel Complex (Block A Reception)</option>
                  <option value="loc-4">Mechanical Engineering Dept Lab</option>
                  <option value="loc-5">Sports Complex Pavilion</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Additional Instructions for Creator
              </label>
              <textarea
                rows={3}
                placeholder="Mention specific handwriting preferences, diagram rules, or guidelines..."
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-blue hover:bg-blue-700 text-white font-extrabold py-4 px-8 rounded-2xl text-base shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Uploading Assignment...</span>
              ) : (
                <>
                  <span>Upload & Send for Page Verification</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-500 mt-2 font-medium">
              No immediate payment required. Page count and price will be verified first.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
