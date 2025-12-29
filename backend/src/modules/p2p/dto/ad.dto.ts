import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  IsUUID,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum AdSide {
  BUY = 'BUY',
  SELL = 'SELL',
}

export class CreateAdDto {
  @IsEnum(AdSide)
  side: AdSide;

  @IsString()
  @MaxLength(10)
  asset: string; // BTC, ETH, etc.

  @IsString()
  @MaxLength(10)
  fiatCurrency: string; // USD, EUR, etc.

  @IsNumber()
  @Min(0.00000001)
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Min(0.00000001)
  @Type(() => Number)
  totalQty: number;

  @IsNumber()
  @Min(0.00000001)
  @Type(() => Number)
  minQty: number;

  @IsNumber()
  @Min(0.00000001)
  @Type(() => Number)
  maxQty: number;

  @IsArray()
  @IsUUID('4', { each: true })
  paymentMethodIds: string[];

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  terms?: string;
}

export class UpdateAdDto {
  @IsNumber()
  @IsOptional()
  @Min(0.00000001)
  @Type(() => Number)
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0.00000001)
  @Type(() => Number)
  minQty?: number;

  @IsNumber()
  @IsOptional()
  @Min(0.00000001)
  @Type(() => Number)
  maxQty?: number;

  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true })
  paymentMethodIds?: string[];

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  terms?: string;
}

export class ListAdsQueryDto {
  @IsEnum(AdSide)
  @IsOptional()
  side?: AdSide;

  @IsString()
  @IsOptional()
  asset?: string;

  @IsString()
  @IsOptional()
  fiatCurrency?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}

