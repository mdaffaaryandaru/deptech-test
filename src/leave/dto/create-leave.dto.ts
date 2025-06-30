import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';

export class CreateLeaveDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsInt()
  @Min(1)
  employeeId: number;
}
