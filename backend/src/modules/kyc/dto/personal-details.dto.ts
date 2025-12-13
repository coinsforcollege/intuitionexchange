import { IsString, IsDateString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class PersonalDetailsDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  middleName?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName: string;

  @IsDateString()
  dateOfBirth: string;
}

