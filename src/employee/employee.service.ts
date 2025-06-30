import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';
import { PaginationDto } from '../common/dto';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const { email } = createEmployeeDto;

    // Check if employee with email already exists
    const existingEmployee = await this.prisma.employee.findUnique({
      where: { email },
    });

    if (existingEmployee) {
      throw new ConflictException('Employee with this email already exists');
    }

    // Create employee
    const employee = await this.prisma.employee.create({
      data: createEmployeeDto,
    });

    return employee;
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
            { phone: { contains: search } },
          ],
        }
      : {};

    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          leaves: {
            orderBy: { createdAt: 'desc' },
            take: 5, // Get latest 5 leaves for preview
          },
        },
      }),
      this.prisma.employee.count({ where }),
    ]);

    return {
      data: employees,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        leaves: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const existingEmployee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      throw new NotFoundException('Employee not found');
    }

    // Check email uniqueness if email is being updated
    if (updateEmployeeDto.email && updateEmployeeDto.email !== existingEmployee.email) {
      const emailExists = await this.prisma.employee.findUnique({
        where: { email: updateEmployeeDto.email },
      });

      if (emailExists) {
        throw new ConflictException('Employee with this email already exists');
      }
    }

    const updatedEmployee = await this.prisma.employee.update({
      where: { id },
      data: updateEmployeeDto,
    });

    return updatedEmployee;
  }

  async remove(id: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    await this.prisma.employee.delete({
      where: { id },
    });

    return { message: 'Employee deleted successfully' };
  }

  // Get employees with their leave summary
  async findAllWithLeaveSummary(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;
    const currentYear = new Date().getFullYear();

    const where = search
      ? {
          OR: [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};

    const employees = await this.prisma.employee.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        leaves: {
          where: {
            year: currentYear,
          },
        },
      },
    });

    const total = await this.prisma.employee.count({ where });

    // Calculate leave summary for each employee
    const employeesWithSummary = employees.map(employee => {
      const totalLeaveDays = employee.leaves.reduce((sum, leave) => sum + leave.days, 0);
      const remainingLeaveDays = 12 - totalLeaveDays;

      return {
        ...employee,
        leaveSummary: {
          totalLeaveDays,
          remainingLeaveDays,
          totalLeaveRequests: employee.leaves.length,
        },
      };
    });

    return {
      data: employeesWithSummary,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
