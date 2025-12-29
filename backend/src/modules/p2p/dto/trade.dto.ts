import {
  IsString,
  IsNumber,
  IsUUID,
  IsEnum,
  IsOptional,
  IsArray,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethodType } from './payment-method.dto';

export class CreateTradeDto {
  @IsUUID('4')
  adId: string;

  @IsNumber()
  @Min(0.00000001)
  @Type(() => Number)
  qty: number;

  @IsEnum(PaymentMethodType)
  paymentMethodType: PaymentMethodType;

  @IsString()
  @IsOptional()
  idempotencyKey?: string;
}

export class UploadProofDto {
  @IsArray()
  @IsString({ each: true })
  proofUrls: string[];
}

export class MarkPaidDto {
  @IsString()
  @IsOptional()
  idempotencyKey?: string;
}

export class CancelTradeDto {
  @IsString()
  @IsOptional()
  idempotencyKey?: string;
}

export class ReleaseTradeDto {
  @IsString()
  @IsOptional()
  idempotencyKey?: string;
}

export enum TradeStatusFilter {
  CREATED = 'CREATED',
  CANCELLED = 'CANCELLED',
  PAID = 'PAID',
  DISPUTED = 'DISPUTED',
  RELEASED = 'RELEASED',
  REFUNDED = 'REFUNDED',
  EXPIRED = 'EXPIRED',
  ALL = 'ALL',
}

export class ListTradesQueryDto {
  @IsEnum(TradeStatusFilter)
  @IsOptional()
  status?: TradeStatusFilter;

  @IsString()
  @IsOptional()
  role?: 'buyer' | 'seller' | 'all'; // Filter by user's role in trade

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

