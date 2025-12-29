import {
  IsString,
  IsEnum,
  IsArray,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class OpenDisputeDto {
  @IsString()
  @MaxLength(2000)
  reason: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  evidence?: string[]; // URLs to evidence files
}

export enum DisputeOutcome {
  RELEASE_TO_BUYER = 'RELEASE_TO_BUYER',
  REFUND_TO_SELLER = 'REFUND_TO_SELLER',
}

export class ResolveDisputeDto {
  @IsEnum(DisputeOutcome)
  outcome: DisputeOutcome;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  resolution?: string; // Admin notes
}

