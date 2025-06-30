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
import { LeaveService } from './leave.service';
import { CreateLeaveDto, UpdateLeaveDto } from './dto';
import { PaginationDto } from '../common/dto';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('leave')
@UseGuards(JwtGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  async create(@Body() createLeaveDto: CreateLeaveDto) {
    return this.leaveService.create(createLeaveDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.leaveService.findAll(paginationDto);
  }

  @Get('stats')
  async getLeaveStats() {
    return this.leaveService.getLeaveStats();
  }

  @Get('employee/:employeeId')
  async findByEmployee(
    @Param('employeeId') employeeId: string,
    @Query() paginationDto: PaginationDto
  ) {
    return this.leaveService.findByEmployee(+employeeId, paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.leaveService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLeaveDto: UpdateLeaveDto) {
    return this.leaveService.update(+id, updateLeaveDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.leaveService.remove(+id);
  }
}
