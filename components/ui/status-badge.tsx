import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
  let label = status.replace(/_/g, " ");

  switch (status) {
    case "UPLOADED":
    case "SELECTED":
      badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
      label = "Uploaded / Selected";
      break;
    case "PAGE_COUNT_PENDING":
      badgeStyle = "bg-amber-50 text-amber-700 border-amber-300 animate-pulse";
      label = "Page Count Verification Pending";
      break;
    case "PAGE_COUNT_VERIFIED":
      badgeStyle = "bg-sky-50 text-sky-700 border-sky-300";
      label = "Page Count Verified — Ready for Payment";
      break;
    case "PAYMENT_PENDING":
      badgeStyle = "bg-purple-50 text-purple-700 border-purple-200";
      label = "Payment Pending";
      break;
    case "PAID":
      badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-300";
      label = "Payment Confirmed";
      break;
    case "CREATOR_ASSIGNED":
      badgeStyle = "bg-indigo-50 text-indigo-700 border-indigo-200";
      label = "Creator Assigned";
      break;
    case "IN_PROGRESS":
      badgeStyle = "bg-blue-100 text-blue-800 border-blue-300 font-semibold";
      label = "In Progress";
      break;
    case "QUALITY_CHECK":
      badgeStyle = "bg-teal-50 text-teal-700 border-teal-300";
      label = "Quality Check";
      break;
    case "READY_FOR_PICKUP":
      badgeStyle = "bg-emerald-100 text-emerald-800 border-emerald-400 font-bold animate-bounce";
      label = "Ready for Campus Pickup! 🎉";
      break;
    case "DELIVERED":
    case "COMPLETED":
      badgeStyle = "bg-slate-800 text-white border-slate-900";
      label = "Completed & Collected";
      break;
    case "CANCELLED":
      badgeStyle = "bg-red-50 text-red-700 border-red-200";
      label = "Cancelled";
      break;
    default:
      break;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border shadow-xs tracking-tight",
        badgeStyle,
        className
      )}
    >
      {label}
    </span>
  );
}
