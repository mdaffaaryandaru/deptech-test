# HRIS Backend - Quick Start Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MySQL** server running on localhost:3306
3. **Database** named `hris_db`

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Update `.env` file with your MySQL credentials:
```env
DATABASE_URL="mysql://root:your_password@localhost:3306/hris_db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 4. Start Application
```bash
# Development mode with hot reload
npm run start:dev
```

## Default Admin Credentials

After seeding, you can login with:
- **Email**: admin@hris.com
- **Password**: admin123

## API Documentation

The API will be available at: `http://localhost:3001/api`

### Key Endpoints:
- `POST /api/auth/login` - Admin login
- `GET /api/admin` - List admins
- `GET /api/employee` - List employees
- `GET /api/leave` - List leaves
- `GET /api/employee/with-leave-summary` - Employees with leave summary

## Business Rules Implemented

1. **Leave Annual Limit**: Maximum 12 days per employee per year
2. **Leave Monthly Limit**: Maximum 1 day per employee per month
3. **Date Validation**: Proper start/end date validation
4. **Employee Management**: Complete CRUD with search and pagination

## Frontend Integration

This backend is designed to work with the deptech-front React application. 
CORS is configured to accept requests from:
- http://localhost:3000 (React dev server)
- http://localhost:5173 (Vite dev server)
- http://localhost:4173 (Vite preview)

## Troubleshooting

### Database Connection Issues
1. Ensure MySQL server is running
2. Check database credentials in `.env`
3. Verify database `hris_db` exists

### Port Conflicts
- Backend runs on port 3001 by default
- Change `PORT` in `.env` if needed
