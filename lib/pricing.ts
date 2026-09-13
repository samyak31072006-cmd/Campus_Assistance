import { db } from "@/lib/db";

export interface CalculateAssignmentPriceInput {
  billablePages: number;
  rushFee?: number;
  additionalFee?: number;
  collegeId?: string;
}

export interface CalculateCadPriceInput {
  pricePerSheet: number;
  quantity?: number;
  rushFee?: number;
  additionalFee?: number;
}

/**
 * Retrieves the current assignment price per page from database config.
 * Falls back to 25 if no DB pricing rule found.
 */
export async function getAssignmentPricePerPage(collegeId?: string): Promise<number> {
  try {
    const rule = await db.pricingRule.findFirst({
      where: {
        serviceType: "ASSIGNMENT",
        active: true,
        ...(collegeId ? { collegeId } : {}),
      },
      orderBy: { effectiveFrom: "desc" },
    });
    return rule ? rule.price : 25;
  } catch (error) {
    console.error("Error fetching pricing rule from DB:", error);
    return 25; // fallback
  }
}

export async function calculateAssignmentTotal(input: CalculateAssignmentPriceInput): Promise<{
  pricePerPage: number;
  subtotal: number;
  rushFee: number;
  additionalFee: number;
  total: number;
}> {
  const pricePerPage = await getAssignmentPricePerPage(input.collegeId);
  const rushFee = input.rushFee || 0;
  const additionalFee = input.additionalFee || 0;
  const subtotal = input.billablePages * pricePerPage;
  const total = subtotal + rushFee + additionalFee;

  return {
    pricePerPage,
    subtotal,
    rushFee,
    additionalFee,
    total,
  };
}

export function calculateCadTotal(input: CalculateCadPriceInput): {
  pricePerSheet: number;
  quantity: number;
  subtotal: number;
  rushFee: number;
  additionalFee: number;
  total: number;
} {
  const quantity = input.quantity || 1;
  const rushFee = input.rushFee || 0;
  const additionalFee = input.additionalFee || 0;
  const subtotal = input.pricePerSheet * quantity;
  const total = subtotal + rushFee + additionalFee;

  return {
    pricePerSheet: input.pricePerSheet,
    quantity,
    subtotal,
    rushFee,
    additionalFee,
    total,
  };
}
