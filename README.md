# HRIS Frontend

Frontend aplikasi Human Resource Information System (HRIS) yang dibangun dengan Next.js dan Tailwind CSS.

## Fitur

### 🏠 Dashboard
- Statistik real-time pegawai dan cuti dari database
- Quick actions ke fitur utama
- Aktivitas terbaru dari data live

### 👥 Manajemen Pegawai
- **CRUD Operations**: Create, Read, Update, Delete pegawai
- **Validasi**: Email, nomor telepon, dan form validation
- **Pencarian**: Search dan filter pegawai
- **Pagination**: Navigasi halaman untuk data besar

### 📅 Manajemen Cuti
- **CRUD Operations**: Create, Read, Update, Delete cuti
- **Business Rules**: Validasi 1 hari/bulan, 12 hari/tahun
- **Validasi Tanggal**: Start/end date validation
- **Tracking**: Durasi cuti otomatis terhitung

### 📊 Kehadiran
- Dashboard kehadiran pegawai
- Summary penggunaan cuti per pegawai

### 🔐 Autentikasi
- JWT-based authentication
- Protected routes
- Auto-redirect untuk unauthorized access

## Teknologi

- **Framework**: Next.js 15 dengan App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Icons**: Heroicons v2
- **State Management**: React Context API
- **HTTP Client**: Custom API client dengan fetch
- **Authentication**: JWT token management

## Cara Menjalankan

### Prerequisites

- Node.js 18 atau lebih tinggi
- Backend HRIS sudah berjalan di port 3001

### Instalasi

1. Install dependencies:
```bash
npm install
```

2. Buat file `.env.local` di root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Pastikan backend sudah running di port 3001

### Development

```bash
# Jalankan development server
npm run dev
```

Aplikasi akan berjalan di http://localhost:3000

### Build & Production

```bash
# Build untuk production
npm run build

# Jalankan production server
npm start
```

## API Integration

Frontend terintegrasi dengan backend melalui:

- **Authentication**: Login/logout admin dengan JWT
- **Admin Management**: CRUD operasi admin (profile, create, update, delete)
- **Employee Management**: CRUD operasi pegawai dengan validasi
- **Leave Management**: CRUD operasi cuti dengan business rules
- **Dashboard Data**: Real-time statistics dari database

### Endpoint Integration
- Base URL: `http://localhost:3001/api`
- Authentication: Bearer token di header
- Error handling: User-friendly error messages
- Loading states: Skeleton loading untuk UX yang baik

## Struktur Halaman

```
/                           # Redirect ke dashboard
/login                      # Halaman login admin
/dashboard                  # Dashboard utama dengan statistik
/dashboard/employees        # List semua pegawai
/dashboard/employees/create # Form tambah pegawai baru
/dashboard/employees/[id]/edit # Form edit pegawai
/dashboard/leave           # List semua cuti
/dashboard/leave/create    # Form tambah cuti baru
/dashboard/leave/[id]/edit # Form edit cuti
/dashboard/attendance      # Dashboard kehadiran
```

## Fitur Keamanan

- **Protected Routes**: Semua halaman dashboard dilindungi autentikasi
- **JWT Token Management**: Automatic token handling dan refresh
- **Auto-redirect**: Redirect otomatis ke login jika tidak authenticated
- **Route Guards**: ProtectedRoute component untuk securing pages
- **Context-based Auth**: Centralized authentication state management

## Business Rules Implementation

### Leave Management
- **Annual Limit**: Maksimal 12 hari cuti per tahun (validasi frontend + backend)
- **Monthly Limit**: Maksimal 1 hari cuti per bulan (validasi frontend + backend)  
- **Date Validation**: Tanggal mulai tidak boleh setelah tanggal selesai
- **Same Month**: Cuti harus dalam bulan yang sama
- **Real-time Calculation**: Durasi cuti dihitung otomatis

### Form Validation
- **Email Format**: Validasi format email yang proper
- **Phone Number**: Validasi format nomor telepon Indonesia
- **Required Fields**: Semua field wajib diisi sesuai business requirements
- **Error Feedback**: Real-time error messages untuk user guidance

## Komponen & Utilities

### Core Components
- **AuthContext**: Centralized authentication state management
- **ProtectedRoute**: Route protection wrapper component
- **Sidebar**: Navigation sidebar dengan menu items

### Utility Functions
- **API Client**: Centralized HTTP client dengan error handling
- **Utils**: Helper functions untuk:
  - Date formatting (formatDate)
  - Leave days calculation (calculateLeaveDays)
  - Email validation (validateEmail)
  - Phone validation (validatePhone)
  - Gender options mapping (GENDER_OPTIONS)

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first responsive layout
- **Loading States**: Skeleton loaders untuk better UX
- **Interactive Elements**: Hover states dan transitions
