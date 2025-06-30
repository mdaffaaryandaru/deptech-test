# HRIS Backend API

A comprehensive Human Resource Information System (HRIS) backend built with NestJS, MySQL, and Prisma.

## Features

### 🔐 Authentication & Admin Management
- JWT-based authentication
- Admin CRUD operations
- Profile management
- Secure login/logout functionality

### 👥 Employee Management
- Complete employee CRUD operations
- Employee data including personal information and contact details
- Employee leave tracking and summaries

### 📅 Leave Management with Business Rules
- **Annual Leave Limit**: Maximum 12 days per employee per year
- **Monthly Leave Limit**: Maximum 1 day per employee per month
- Automatic validation of leave requests
- Leave statistics and reporting
- Date range validation

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer
- **Language**: TypeScript

## Installation

```bash
# Install dependencies
npm install
```

## Database Setup

1. Create a MySQL database named `hris_db`
2. Create a `.env` file in the root directory with your database credentials:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/hris_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="24h"

# Application
PORT=3001
```

3. Generate Prisma client and run migrations:

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database (optional)
npm run db:seed

# Or reset database (if needed)
npm run db:reset
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Build the application
npm run build
```

The API will be available at `http://localhost:3001/api`

> **Note**: The application runs on port 3001 by default and has `/api` prefix for all endpoints. CORS is enabled for frontend integration on ports 3000, 5173, and 4173.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Admin Management
- `POST /api/admin` - Create admin
- `GET /api/admin` - Get all admins (paginated)
- `GET /api/admin/profile` - Get current admin profile
- `GET /api/admin/:id` - Get admin by ID
- `PATCH /api/admin/profile` - Update current admin profile
- `PATCH /api/admin/:id` - Update admin by ID
- `DELETE /api/admin/:id` - Delete admin

### Employee Management
- `POST /api/employee` - Create employee
- `GET /api/employee` - Get all employees (paginated)
- `GET /api/employee/with-leave-summary` - Get employees with leave summary
- `GET /api/employee/:id` - Get employee by ID
- `PATCH /api/employee/:id` - Update employee
- `DELETE /api/employee/:id` - Delete employee

### Leave Management
- `POST /api/leave` - Create leave request
- `GET /api/leave` - Get all leaves (paginated, filterable)
- `GET /api/leave/stats` - Get leave statistics
- `GET /api/leave/employee/:employeeId` - Get leaves by employee
- `GET /api/leave/:id` - Get leave by ID
- `PATCH /api/leave/:id` - Update leave
- `DELETE /api/leave/:id` - Delete leave

## Business Rules

### Leave Management Rules
1. **Annual Limit**: Each employee can take maximum 12 days of leave per year
2. **Monthly Limit**: Each employee can take maximum 1 day of leave per month
3. **Date Validation**: Start date cannot be after end date
4. **Same Month Requirement**: Leave start and end dates must be in the same month
5. **Automatic Calculation**: Leave days are automatically calculated from date range
6. **Business Rule Enforcement**: All validations are enforced at the service layer

## Data Models

### Admin
- First Name, Last Name
- Email (unique)
- Birth Date
- Gender (MALE/FEMALE)
- Password (hashed)

### Employee
- First Name, Last Name
- Email (unique)
- Phone Number (formatted validation)
- Address
- Gender (MALE/FEMALE)
- Creation and update timestamps

### Leave
- Reason (text description)
- Start Date, End Date
- Days (automatically calculated)
- Year, Month (extracted for validation rules)
- Employee relation (foreign key)
- Creation and update timestamps

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Development

```bash
# Run in development mode with hot reload
npm run start:dev

# Build the application
npm run build

# Database operations
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
npm run db:seed        # Seed database
npm run db:reset       # Reset database

# Code quality
npm run format         # Format code with Prettier
npm run lint           # Lint code with ESLint
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="mysql://root:password@localhost:3306/hris_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="24h"

# Application Configuration
PORT=3001
```

> **Security Note**: Make sure to use a strong JWT secret in production and never commit your actual `.env` file to version control.

## Project Structure

```
src/
├── admin/              # Admin module
├── auth/               # Authentication module
├── common/             # Shared DTOs and enums
├── employee/           # Employee module
├── leave/              # Leave management module
├── prisma/             # Prisma service
├── app.module.ts       # Main application module
└── main.ts             # Application entry point

prisma/
└── schema.prisma       # Database schema
```
