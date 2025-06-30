import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeaveDto, UpdateLeaveDto } from './dto';
import { PaginationDto } from '../common/dto';

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}

  async create(createLeaveDto: CreateLeaveDto) {
    const { startDate, endDate, employeeId, reason } = createLeaveDto;

    // Validate employee exists
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate date range
    if (start > end) {
      throw new BadRequestException('Start date cannot be after end date');
    }

    // Calculate days (inclusive)
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    const year = start.getFullYear();
    const month = start.getMonth() + 1;

    // Business Rule 1: Check annual leave limit (12 days per year)
    const existingLeaves = await this.prisma.leave.findMany({
      where: {
        employeeId,
        year,
      },
    });

    const totalUsedDays = existingLeaves.reduce((sum, leave) => sum + leave.days, 0);
    if (totalUsedDays + days > 12) {
      throw new BadRequestException(
        `Employee has exceeded annual leave limit. Used: ${totalUsedDays}/12 days. Requested: ${days} days.`
      );
    }

    // Business Rule 2: Check monthly leave limit (1 day per month)
    const monthlyLeaves = await this.prisma.leave.findMany({
      where: {
        employeeId,
        year,
        month,
      },
    });

    const totalMonthlyDays = monthlyLeaves.reduce((sum, leave) => sum + leave.days, 0);
    if (totalMonthlyDays + days > 1) {
      throw new ConflictException(
        `Employee can only take 1 day leave per month. Already used: ${totalMonthlyDays} day(s) in this month.`
      );
    }

    // Create leave
    const leave = await this.prisma.leave.create({
      data: {
        reason,
        startDate: start,
        endDate: end,
        days,
        year,
        month,
        employeeId,
      },
      include: {
        employee: true,
      },
    });

    return leave;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search, startDate, endDate } = paginationDto;
    const skip = (page - 1) * limit;

    let where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { reason: { contains: search } },
        {
          employee: {
            OR: [
              { firstName: { contains: search } },
              { lastName: { contains: search } },
              { email: { contains: search } },
            ],
          },
        },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      where.AND = where.AND || [];
      
      if (startDate) {
        where.AND.push({
          startDate: {
            gte: new Date(startDate),
          },
        });
      }

      if (endDate) {
        where.AND.push({
          endDate: {
            lte: new Date(endDate),
          },
        });
      }
    }

    const [leaves, total] = await Promise.all([
      this.prisma.leave.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          employee: true,
        },
      }),
      this.prisma.leave.count({ where }),
    ]);

    return {
      data: leaves,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const leave = await this.prisma.leave.findUnique({
      where: { id },
      include: {
        employee: true,
      },
    });

    if (!leave) {
      throw new NotFoundException('Leave not found');
    }

    return leave;
  }

  async findByEmployee(employeeId: number, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    // Validate employee exists
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const [leaves, total] = await Promise.all([
      this.prisma.leave.findMany({
        where: { employeeId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          employee: true,
        },
      }),
      this.prisma.leave.count({ where: { employeeId } }),
    ]);

    // Calculate leave summary
    const currentYear = new Date().getFullYear();
    const yearlyLeaves = await this.prisma.leave.findMany({
      where: {
        employeeId,
        year: currentYear,
      },
    });

    const totalUsedDays = yearlyLeaves.reduce((sum, leave) => sum + leave.days, 0);

    return {
      data: leaves,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      summary: {
        totalUsedDays,
        remainingDays: 12 - totalUsedDays,
        totalRequests: yearlyLeaves.length,
      },
    };
  }

  async update(id: number, updateLeaveDto: UpdateLeaveDto) {
    const existingLeave = await this.prisma.leave.findUnique({
      where: { id },
    });

    if (!existingLeave) {
      throw new NotFoundException('Leave not found');
    }

    // If dates are being updated, validate business rules again
    if (updateLeaveDto.startDate || updateLeaveDto.endDate) {
      const startDate = updateLeaveDto.startDate 
        ? new Date(updateLeaveDto.startDate) 
        : existingLeave.startDate;
      const endDate = updateLeaveDto.endDate 
        ? new Date(updateLeaveDto.endDate) 
        : existingLeave.endDate;

      // Validate date range
      if (startDate > endDate) {
        throw new BadRequestException('Start date cannot be after end date');
      }

      // Calculate new days
      const timeDiff = endDate.getTime() - startDate.getTime();
      const newDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

      const year = startDate.getFullYear();
      const month = startDate.getMonth() + 1;

      // Check annual leave limit (excluding current leave)
      const otherLeaves = await this.prisma.leave.findMany({
        where: {
          employeeId: existingLeave.employeeId,
          year,
          id: { not: id },
        },
      });

      const totalOtherDays = otherLeaves.reduce((sum, leave) => sum + leave.days, 0);
      if (totalOtherDays + newDays > 12) {
        throw new BadRequestException(
          `Employee has exceeded annual leave limit. Other leaves: ${totalOtherDays}/12 days. Requested: ${newDays} days.`
        );
      }

      // Check monthly leave limit (excluding current leave)
      const otherMonthlyLeaves = await this.prisma.leave.findMany({
        where: {
          employeeId: existingLeave.employeeId,
          year,
          month,
          id: { not: id },
        },
      });

      const totalOtherMonthlyDays = otherMonthlyLeaves.reduce((sum, leave) => sum + leave.days, 0);
      if (totalOtherMonthlyDays + newDays > 1) {
        throw new ConflictException(
          `Employee can only take 1 day leave per month. Other leaves in month: ${totalOtherMonthlyDays} day(s).`
        );
      }

      // Update with new calculated values
      updateLeaveDto = {
        ...updateLeaveDto,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      // Add calculated fields
      (updateLeaveDto as any).days = newDays;
      (updateLeaveDto as any).year = year;
      (updateLeaveDto as any).month = month;
    }

    const updatedLeave = await this.prisma.leave.update({
      where: { id },
      data: {
        ...updateLeaveDto,
        startDate: updateLeaveDto.startDate ? new Date(updateLeaveDto.startDate) : undefined,
        endDate: updateLeaveDto.endDate ? new Date(updateLeaveDto.endDate) : undefined,
      },
      include: {
        employee: true,
      },
    });

    return updatedLeave;
  }

  async remove(id: number) {
    const leave = await this.prisma.leave.findUnique({
      where: { id },
    });

    if (!leave) {
      throw new NotFoundException('Leave not found');
    }

    await this.prisma.leave.delete({
      where: { id },
    });

    return { message: 'Leave deleted successfully' };
  }

  // Get leave statistics
  async getLeaveStats() {
    const currentYear = new Date().getFullYear();

    const [totalEmployees, totalLeaves, totalLeaveDays] = await Promise.all([
      this.prisma.employee.count(),
      this.prisma.leave.count({
        where: { year: currentYear },
      }),
      this.prisma.leave.aggregate({
        where: { year: currentYear },
        _sum: { days: true },
      }),
    ]);

    // Monthly leave statistics
    const monthlyStats = await this.prisma.leave.groupBy({
      by: ['month'],
      where: { year: currentYear },
      _count: { id: true },
      _sum: { days: true },
      orderBy: { month: 'asc' },
    });

    return {
      totalEmployees,
      totalLeaves,
      totalLeaveDays: totalLeaveDays._sum.days || 0,
      averageLeaveDaysPerEmployee: totalEmployees > 0 
        ? Math.round((totalLeaveDays._sum.days || 0) / totalEmployees * 100) / 100 
        : 0,
      monthlyStats,
    };
  }
}
