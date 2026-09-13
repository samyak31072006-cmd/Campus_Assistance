import React from "react";
import { CheckCircle2, Clock, MapPin, AlertCircle, FileCheck, CreditCard, UserCheck, PenTool, Award, PackageCheck } from "lucide-react";

export interface TimelineStep {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const ASSIGNMENT_STEPS: TimelineStep[] = [
  { key: "UPLOADED", label: "Assignment Uploaded", description: "Document received in system", icon: FileCheck },
  { key: "PAGE_COUNT_VERIFIED", label: "Page Count Verified", description: "Admin reviewed total billable pages", icon: CheckCircle2 },
  { key: "PAID", label: "Payment Confirmed", description: "Online transaction verified", icon: CreditCard },
  { key: "CREATOR_ASSIGNED", label: "Creator Assigned", description: "Handed over to top campus creator", icon: UserCheck },
  { key: "IN_PROGRESS", label: "Being Prepared", description: "Physical writing in progress", icon: PenTool },
  { key: "QUALITY_CHECK", label: "Quality Check", description: "Handwriting & page completeness review", icon: Award },
  { key: "READY_FOR_PICKUP", label: "Ready for Pickup", description: "Dispatched to designated campus location", icon: MapPin },
  { key: "DELIVERED", label: "Completed", description: "Handed over to student", icon: PackageCheck },
];

const CAD_STEPS: TimelineStep[] = [
  { key: "SELECTED", label: "Sheet Selected", description: "Sheet requirement & reference uploaded", icon: FileCheck },
  { key: "PAID", label: "Payment Confirmed", description: "Online transaction verified", icon: CreditCard },
  { key: "CREATOR_ASSIGNED", label: "Creator Assigned", description: "Draftsman assigned", icon: UserCheck },
  { key: "IN_PROGRESS", label: "Drafting Sheet", description: "Manual drawing/AutoCAD plotting in progress", icon: PenTool },
  { key: "QUALITY_CHECK", label: "Quality Check", description: "Dimensions & IS standards review", icon: Award },
  { key: "READY_FOR_PICKUP", label: "Ready for Pickup", description: "Available at selected campus spot", icon: MapPin },
  { key: "DELIVERED", label: "Collected", description: "Physical sheet collected", icon: PackageCheck },
];

export function OrderTimeline({
  serviceType,
  currentStatus,
}: {
  serviceType: "ASSIGNMENT" | "CAD";
  currentStatus: string;
}) {
  const steps = serviceType === "ASSIGNMENT" ? ASSIGNMENT_STEPS : CAD_STEPS;

  // Determine active step index
  const statusOrder = steps.map((s) => s.key);
  let activeIndex = statusOrder.indexOf(currentStatus);
  
  if (currentStatus === "PAGE_COUNT_PENDING") {
    activeIndex = 0; // After upload, before page count verified
  } else if (currentStatus === "PAYMENT_PENDING") {
    activeIndex = serviceType === "ASSIGNMENT" ? 1 : 0;
  } else if (activeIndex === -1) {
    activeIndex = 0;
  }

  return (
    <div className="py-4">
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {steps.map((step, idx) => {
          const isDone = idx < activeIndex || currentStatus === "DELIVERED" || currentStatus === "COMPLETED";
          const isCurrent = idx === activeIndex && currentStatus !== "DELIVERED" && currentStatus !== "COMPLETED";
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative flex items-start group">
              {/* Circle Marker */}
              <div
                className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition ${
                  isDone
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                    : isCurrent
                    ? "bg-brand-blue border-brand-blue text-white shadow-glow animate-pulse"
                    : "bg-white border-slate-300 text-slate-400"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Step Info */}
              <div className="ml-2 sm:ml-3">
                <div className="flex items-center gap-2">
                  <h4
                    className={`text-sm sm:text-base font-semibold ${
                      isDone
                        ? "text-slate-900"
                        : isCurrent
                        ? "text-brand-blue font-bold"
                        : "text-slate-500"
                    }`}
                  >
                    {step.label}
                  </h4>

                  {isCurrent && (
                    <span className="bg-blue-100 text-brand-blue text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Current State
                    </span>
                  )}
                  {step.key === "PAGE_COUNT_VERIFIED" && currentStatus === "PAGE_COUNT_PENDING" && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Pending Admin Review
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
