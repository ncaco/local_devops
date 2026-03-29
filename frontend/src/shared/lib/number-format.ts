export function parseNullableNumber(value: string | number): number | null {
  const raw = typeof value === "number" ? String(value) : value;
  const trimmed = raw.replaceAll(",", "").trim();
  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? Number.NaN : parsed;
}

export function parseNullableInteger(value: string | number): number | null {
  const parsed = parseNullableNumber(value);
  if (parsed == null || Number.isNaN(parsed)) {
    return parsed;
  }
  return Math.trunc(parsed);
}

function normalizeNumericInput(raw: string): { normalized: string; hasDot: boolean } {
  const cleaned = raw.replaceAll(",", "").replace(/[^\d.]/g, "");
  if (!cleaned) {
    return { normalized: "", hasDot: false };
  }

  const dotIndex = cleaned.indexOf(".");
  if (dotIndex < 0) {
    return { normalized: cleaned, hasDot: false };
  }

  const integerPart = cleaned.slice(0, dotIndex) || "0";
  const decimalPart = cleaned.slice(dotIndex + 1).replaceAll(".", "");
  return { normalized: `${integerPart}.${decimalPart}`, hasDot: true };
}

export function formatCommaNumberInput(raw: string): string {
  const { normalized, hasDot } = normalizeNumericInput(raw);
  if (!normalized) {
    return "";
  }

  const [integerPart, decimalPart = ""] = normalized.split(".");
  const formattedInteger = Number(integerPart || "0").toLocaleString("ko-KR");

  if (hasDot) {
    return `${formattedInteger}.${decimalPart}`;
  }
  return formattedInteger;
}

export function formatCommaIntegerInput(raw: string): string {
  const cleaned = raw.replaceAll(",", "").replace(/\D/g, "");
  if (!cleaned) {
    return "";
  }
  return Number(cleaned).toLocaleString("ko-KR");
}

export function formatNumberDisplay(value: string | number | null | undefined): string {
  if (value == null || value === "") {
    return "-";
  }
  const parsed = parseNullableNumber(value);
  if (parsed == null || Number.isNaN(parsed)) {
    return String(value);
  }
  return parsed.toLocaleString("ko-KR");
}
