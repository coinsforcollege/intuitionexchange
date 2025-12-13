import { IsEmail, IsString, IsOptional, Length } from 'class-validator';

export class ResendOtpDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(10, 10)
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(1, 2)
  phoneCountry?: string;

  @IsString()
  type: string; // REGISTER, LOGIN, RESET, etc.
}
