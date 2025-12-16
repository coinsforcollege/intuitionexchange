import { PreciseCalculation } from "./calculation";

export function GetPercentage(value: number, total: number): number {
  const percentage = Math.floor(
    PreciseCalculation.multiplication(
      PreciseCalculation.division(value, total),
      100
    )
  );
  return Number.isFinite(percentage) ? percentage : 0;
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
}

export function FormatCurrency(value: number | string, digits = 6): string {
  return Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(
    Number(value)
  );
}
