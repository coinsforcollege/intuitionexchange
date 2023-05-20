export function GetPercentage(value: number, total: number): number {
  const percentage = Math.floor((value / total) * 100);
  return Number.isFinite(percentage) ? percentage : 0;
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
}

export function FormatCurrency(value: number | string, digits = 3): string {
  return Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(
    Number(value)
  );
}
