import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto, UpdateAdminDto } from './dto';
import { PaginationDto } from '../common/dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async create(createAdminDto: CreateAdminDto) {
    const { email, password, ...adminData } = createAdminDto;

    // Check if admin with email already exists
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await this.prisma.admin.create({
      data: {
        ...adminData,
        email,
        password: hashedPassword,
        birthDate: new Date(createAdminDto.birthDate),
      },
    });

    // Return admin without password
    const { password: _, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};

    const [admins, total] = await Promise.all([
      this.prisma.admin.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          birthDate: true,
          gender: true,
          createdAt: true,
          updatedAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.admin.count({ where }),
    ]);

    return {
      data: admins,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        birthDate: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { id },
    });

    if (!existingAdmin) {
      throw new NotFoundException('Admin not found');
    }

    // Check email uniqueness if email is being updated
    if (updateAdminDto.email && updateAdminDto.email !== existingAdmin.email) {
      const emailExists = await this.prisma.admin.findUnique({
        where: { email: updateAdminDto.email },
      });

      if (emailExists) {
        throw new ConflictException('Admin with this email already exists');
      }
    }

    // Prepare update data
    const updateData: any = { ...updateAdminDto };

    // Hash password if provided
    if (updateAdminDto.password) {
      updateData.password = await bcrypt.hash(updateAdminDto.password, 10);
    }

    // Convert birthDate if provided
    if (updateAdminDto.birthDate) {
      updateData.birthDate = new Date(updateAdminDto.birthDate);
    }

    const updatedAdmin = await this.prisma.admin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        birthDate: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedAdmin;
  }

  async remove(id: number) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    await this.prisma.admin.delete({
      where: { id },
    });

    return { message: 'Admin deleted successfully' };
  }
}
