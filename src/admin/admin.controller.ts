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
  Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, UpdateAdminDto } from './dto';
import { PaginationDto } from '../common/dto';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.adminService.findAll(paginationDto);
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.adminService.findOne(req.user.sub);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch('profile')
  async updateProfile(@Request() req, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(req.user.sub, updateAdminDto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
