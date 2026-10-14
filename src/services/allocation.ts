export interface AllocationValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Memvalidasi apakah nominal yang disisihkan ke suatu Goal sah:
 * 1. Nominal harus berupa angka positif (> 0).
 * 2. Nominal tidak boleh melebihi sisa Saldo Bebas Belanja (Free Cash Balance).
 */
export function validateDepositAllocation(
  amount: number,
  freeCash: number
): AllocationValidationResult {
  if (isNaN(amount) || amount <= 0) {
    return {
      valid: false,
      error: "Nominal yang disisihkan harus lebih dari Rp 0.",
    };
  }

  if (amount > freeCash) {
    return {
      valid: false,
      error: `Saldo bebas belanja tidak mencukupi (Tersedia: Rp ${Math.max(0, Math.round(freeCash)).toLocaleString("id-ID")}).`,
    };
  }

  return {
    valid: true,
  };
}
