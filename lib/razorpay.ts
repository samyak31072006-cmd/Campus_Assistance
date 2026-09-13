import Razorpay from "razorpay";
import crypto from "crypto";

// Ensure server-only execution
if (typeof window !== "undefined") {
  throw new Error("lib/razorpay.ts must only be imported in server-side context!");
}

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "";
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "";
const razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

export const razorpayInstance =
  razorpayKeyId && razorpayKeySecret
    ? new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
      })
    : null;

export function getRazorpayKeyId(): string {
  return razorpayKeyId;
}

/**
 * Server-side Razorpay payment signature verification
 * Signature formula: HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, key_secret)
 */
export function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean {
  if (!razorpayKeySecret) return false;

  const generatedSignature = crypto
    .createHmac("sha256", razorpayKeySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  return generatedSignature === razorpaySignature;
}

/**
 * Server-side Razorpay webhook signature verification using RAW request body
 */
export function verifyWebhookSignature(
  rawBody: string | Buffer,
  webhookSignature: string
): boolean {
  if (!razorpayWebhookSecret) return false;

  const generatedSignature = crypto
    .createHmac("sha256", razorpayWebhookSecret)
    .update(rawBody)
    .digest("hex");

  return generatedSignature === webhookSignature;
}
