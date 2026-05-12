import { createHmac, createHash, randomUUID } from "crypto";

export function generateSignature({
  clientId,
  secretKey,
  requestId,
  requestTimestamp,
  requestTarget,
  requestBody,
}) {
  const digest = "SHA-256=" + createHash("sha256").update(requestBody).digest("base64");
  const componentToSign = [
    `Client-Id:${clientId}`,
    `Request-Id:${requestId}`,
    `Request-Timestamp:${requestTimestamp}`,
    `Request-Target:${requestTarget}`,
    `Digest:${digest}`,
  ].join("\n");
  const signature = createHmac("sha256", secretKey).update(componentToSign).digest("base64");
  return `HMAC-SHA256=${signature}`;
}

export function verifyNotificationSignature({
  clientId,
  secretKey,
  requestId,
  requestTimestamp,
  requestTarget,
  rawBody,
  signature,
}) {
  if (!signature) return false;
  const expected = generateSignature({
    clientId, secretKey, requestId, requestTimestamp, requestTarget,
    requestBody: rawBody,
  });
  return expected === signature;
}

export async function createPayment({ orderId, customer, items, total }) {
  const clientId = process.env.DOKU_CLIENT_ID;
  const secretKey = process.env.DOKU_SECRET_KEY;
  const baseUrl = process.env.DOKU_BASE_URL;
  const appUrl = process.env.BASE_URL || "http://localhost:3000";

  if (!clientId || !secretKey || !baseUrl) throw new Error("DOKU env not configured");

  const requestId = randomUUID();
  const requestTimestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const requestTarget = "/checkout/v1/payment";

  const payload = {
    order: {
      invoice_number: orderId,
      line_items: items.map((it) => ({
        name: String(it.name).slice(0, 50),
        price: it.priceNum | 0,
        quantity: it.quantity || 1,
      })),
      amount: total | 0,
    },
    payment: { payment_due_date: 60 },
    customer: {
      id: `CUST-${Date.now()}`,
      name: customer.name,
      email: customer.email,
    },
    additional_info: {
      success_return_url: `${appUrl}/checkout/success?order=${orderId}`,
      failed_return_url: `${appUrl}/checkout?error=payment_failed`,
      callback_url: `${appUrl}/api/doku/notify`,
    },
  };

  const body = JSON.stringify(payload);
  const signature = generateSignature({
    clientId, secretKey, requestId, requestTimestamp, requestTarget, requestBody: body,
  });

  const res = await fetch(`${baseUrl}${requestTarget}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Client-Id": clientId,
      "Request-Id": requestId,
      "Request-Timestamp": requestTimestamp,
      Signature: signature,
    },
    body,
  });

  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch { /* keep text */ }

  if (!res.ok) {
    const reason = data?.message || text;
    throw new Error(`DOKU ${res.status}: ${reason}`);
  }
  const url = data?.response?.payment?.url;
  if (!url) throw new Error("DOKU response missing payment.url");
  return { paymentUrl: url, raw: data };
}
