export type DecodedToken = {
  sub?: string;
  exp?: number;
  [key: string]: unknown;
};

const decodeBase64Url = (value: string): string => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");

  if (typeof atob === "function") {
    return atob(normalized);
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(normalized, "base64").toString("utf8");
  }

  throw new Error("No base64 decoder available in this runtime.");
};

export const decodeJwtPayload = (token: string): DecodedToken | null => {
  try {
    const [, payloadSegment] = token.split(".");
    if (!payloadSegment) {
      return null;
    }

    const payloadJson = decodeBase64Url(payloadSegment);
    return JSON.parse(payloadJson) as DecodedToken;
  } catch {
    return null;
  }
};

export const isTokenExpired = (payload: DecodedToken | null): boolean => {
  if (!payload?.exp) {
    return false;
  }

  return payload.exp * 1000 < Date.now();
};
