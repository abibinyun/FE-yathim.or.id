// src/utils/index.ts

/**
 * Menghitung persentase progress dari penggalangan dana.
 * @param amount_raised Jumlah yang terkumpul.
 * @param goal Target jumlah.
 * @returns Persentase progress (0-100).
 */
export const progressPercent = (
  amount_raised: number | string,
  goal: number | string
): number => {
  const raised =
    typeof amount_raised === "string"
      ? parseFloat(amount_raised)
      : amount_raised;
  const target = typeof goal === "string" ? parseFloat(goal) : goal;
  if (isNaN(raised) || isNaN(target) || target === 0) return 0;
  return Math.min((raised / target) * 100, 100); // Pastikan tidak lebih dari 100
};

/**
 * Memformat angka menjadi format mata uang Rupiah.
 * @param value Nilai angka (string atau number).
 * @returns String format Rupiah.
 */
export const formatRupiah = (value: string | number): string => {
  const number =
    typeof value === "string"
      ? parseFloat(value.replace(/[^0-9.-]+/g, ""))
      : value;
  if (isNaN(number)) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

/**
 * Mengekstrak ID video YouTube dari URL.
 * @param url URL video YouTube.
 * @returns ID video YouTube atau null jika tidak valid.
 */
export const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export function formatCurrency(amount: any) {
  const number = parseFloat(amount) || 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

export function calculateProgress(raised: any, goal: any) {
  const raisedNum = parseFloat(raised) || 0;
  const goalNum = parseFloat(goal) || 1;
  return Math.min((raisedNum / goalNum) * 100, 100);
}
