export function GetPercentage(value: number, total: number): number {
  const percentage = Math.floor((value / total) * 100);
  return Number.isFinite(percentage) ? percentage : 0;
}

export function FormatCurrency(value: number): string {
  return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function FormatAssetPrice(value: number): number {
  return Math.floor(value * 100000) / 100000;
}
