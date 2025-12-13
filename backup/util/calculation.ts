import Decimal from "decimal.js";

export class PreciseCalculation {
  static addition(a: number, b: number, precision = 6): number {
    const aInt = new Decimal(a);
    const bInt = new Decimal(b);

    const result = aInt.add(bInt).toDecimalPlaces(precision);
    return result.toNumber();
  }

  static subtraction(a: number, b: number, precision = 6): number {
    const aInt = new Decimal(a);
    const bInt = new Decimal(b);

    const result = aInt.sub(bInt).toDecimalPlaces(precision);
    return result.toNumber();
  }

  static multiplication(a: number, b: number, precision = 6): number {
    const aInt = new Decimal(a);
    const bInt = new Decimal(b);

    const result = aInt.mul(bInt).toDecimalPlaces(precision);
    return result.toNumber();
  }

  static division(a: number, b: number, precision = 6): number {
    const aInt = new Decimal(a);
    const bInt = new Decimal(b);

    const result = aInt.div(bInt).toDecimalPlaces(precision);
    return result.toNumber();
  }

  static round(number: number, precision = 6): number {
    const numInt = new Decimal(number);

    return numInt.toDecimalPlaces(precision).toNumber();
  }
}
