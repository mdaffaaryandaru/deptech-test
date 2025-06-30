import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
} from 'class-validator';
import { Gender } from '../../common/enums';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;
}
