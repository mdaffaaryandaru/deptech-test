import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsDateString,
  MinLength,
} from 'class-validator';
import { Gender } from '../../common/enums';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
