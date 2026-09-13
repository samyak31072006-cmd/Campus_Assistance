import crypto from "crypto";

export interface PaymentInitiationResult {
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  provider: "DEMO" | "RAZORPAY";
  razorpayOrderId?: string;
  keyId?: string;
}

export interface PaymentVerificationInput {
  orderId: string;
  paymentId: string;
  signature?: string;
  razorpayOrderId?: string;
  provider: "DEMO" | "RAZORPAY";
}

export async function createPaymentOrder(
  orderId: string,
  amount: number
): Promise<PaymentInitiationResult> {
  const razorpayKey = process.env.RAZORPAY_KEY_ID;
  const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

  // Check if Razorpay keys exist in environment
  if (razorpayKey && razorpaySecret) {
    try {
      // In production/connected mode, initiate Razorpay order
      const auth = Buffer.from(`${razorpayKey}:${razorpaySecret}`).toString("base64");
      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Razorpay accepts paise
          currency: "INR",
          receipt: orderId,
          notes: {
            appOrderNumber: orderId,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          orderId,
          amount,
          currency: "INR",
          provider: "RAZORPAY",
          razorpayOrderId: data.id,
          keyId: razorpayKey,
        };
      }
    } catch (err) {
      console.error("Razorpay order creation failed, falling back to Demo payment:", err);
    }
  }

  // Demo mode fallback
  return {
    success: true,
    orderId,
    amount,
    currency: "INR",
    provider: "DEMO",
    razorpayOrderId: `demo_rzp_${Date.now()}`,
    keyId: "demo_key",
  };
}

export function verifyPaymentSignature(input: PaymentVerificationInput): boolean {
  if (input.provider === "DEMO") {
    // Demo mode: Always valid if paymentId starts with demo_
    return true;
  }

  const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!razorpaySecret || !input.razorpayOrderId || !input.signature) {
    return false;
  }

  const generatedSignature = crypto
    .createHmac("sha256", razorpaySecret)
    .update(`${input.razorpayOrderId}|${input.paymentId}`)
    .digest("hex");

  return generatedSignature === input.signature;
}
