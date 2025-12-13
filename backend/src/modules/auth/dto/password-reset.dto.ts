import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class ResetRequestDto {
  @IsEmail()
  email: string;
}

export class ResetVerifyDto {
  @IsString()
  otp: string;

  @IsString()
  token: string;
}

export class ResetNewPasswordDto {
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^\&\*])(?=.{8,})/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  password: string;

  @IsString()
  token: string;
}
