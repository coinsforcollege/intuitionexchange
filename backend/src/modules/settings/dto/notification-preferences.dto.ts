import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationPreferencesDto {
  // Email Notifications
  @IsOptional()
  @IsBoolean()
  emailMarketing?: boolean;

  @IsOptional()
  @IsBoolean()
  emailSecurityAlerts?: boolean;

  @IsOptional()
  @IsBoolean()
  emailTransactions?: boolean;

  @IsOptional()
  @IsBoolean()
  emailPriceAlerts?: boolean;

  @IsOptional()
  @IsBoolean()
  emailNewsUpdates?: boolean;

  // Push Notifications
  @IsOptional()
  @IsBoolean()
  pushEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  pushSecurityAlerts?: boolean;

  @IsOptional()
  @IsBoolean()
  pushTransactions?: boolean;

  @IsOptional()
  @IsBoolean()
  pushPriceAlerts?: boolean;

  @IsOptional()
  @IsBoolean()
  pushNewsUpdates?: boolean;

  // SMS Notifications
  @IsOptional()
  @IsBoolean()
  smsEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  smsSecurityAlerts?: boolean;

  @IsOptional()
  @IsBoolean()
  smsTransactions?: boolean;
}

