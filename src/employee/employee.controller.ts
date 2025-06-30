import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';
import { PaginationDto } from '../common/dto';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('employee')
@UseGuards(JwtGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.employeeService.findAll(paginationDto);
  }

  @Get('with-leave-summary')
  async findAllWithLeaveSummary(@Query() paginationDto: PaginationDto) {
    return this.employeeService.findAllWithLeaveSummary(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}
