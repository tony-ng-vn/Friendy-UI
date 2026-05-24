/** Normalize US numbers to E.164 (+1XXXXXXXXXX). */
export function normalizeUsPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");

  let national: string;
  if (digits.length === 10) {
    national = digits;
  } else if (digits.length === 11 && digits.startsWith("1")) {
    national = digits.slice(1);
  } else {
    return null;
  }

  if (!/^[2-9]\d{9}$/.test(national)) {
    return null;
  }

  return `+1${national}`;
}

export function formatUsPhoneDisplay(e164: string): string {
  const digits = e164.replace(/\D/g, "").slice(-10);
  if (digits.length !== 10) return e164;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
