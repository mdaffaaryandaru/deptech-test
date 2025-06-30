import { PrismaClient, Gender } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@hris.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'System',
      email: 'admin@hris.com',
      birthDate: new Date('1990-01-01'),
      gender: Gender.MALE,
      password: hashedPassword,
    },
  });

  console.log(`✅ Created admin user: ${admin.email}`);

  // Create sample employees
  const employees = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+1234567890',
      address: '123 Main Street, City, State 12345',
      gender: Gender.MALE,
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      phone: '+1234567891',
      address: '456 Oak Avenue, City, State 12346',
      gender: Gender.FEMALE,
    },
    {
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.johnson@company.com',
      phone: '+1234567892',
      address: '789 Pine Road, City, State 12347',
      gender: Gender.MALE,
    },
  ];

  for (const employeeData of employees) {
    const employee = await prisma.employee.upsert({
      where: { email: employeeData.email },
      update: {},
      create: employeeData,
    });
    console.log(`✅ Created employee: ${employee.firstName} ${employee.lastName}`);
  }

  // Create sample leave records
  const currentYear = new Date().getFullYear();
  const johnEmployee = await prisma.employee.findUnique({
    where: { email: 'john.doe@company.com' },
  });

  if (johnEmployee) {
    const leave1 = await prisma.leave.create({
      data: {
        reason: 'Annual vacation',
        startDate: new Date(`${currentYear}-03-15`),
        endDate: new Date(`${currentYear}-03-15`),
        days: 1,
        year: currentYear,
        month: 3,
        employeeId: johnEmployee.id,
      },
    });
    console.log(`✅ Created leave record for ${johnEmployee.firstName}`);

    const leave2 = await prisma.leave.create({
      data: {
        reason: 'Family event',
        startDate: new Date(`${currentYear}-06-10`),
        endDate: new Date(`${currentYear}-06-10`),
        days: 1,
        year: currentYear,
        month: 6,
        employeeId: johnEmployee.id,
      },
    });
    console.log(`✅ Created another leave record for ${johnEmployee.firstName}`);
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
