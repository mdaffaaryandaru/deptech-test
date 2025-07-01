'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  UsersIcon,
  ClockIcon,
  CalendarIcon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Pegawai',
    href: '/dashboard/employees',
    icon: UsersIcon,
  },
  {
    name: 'Kehadiran',
    href: '/dashboard/attendance',
    icon: ClockIcon,
  },
  {
    name: 'Manajemen Cuti',
    href: '/dashboard/leave',
    icon: CalendarIcon,
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: UserCircleIcon,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="w-64 bg-white shadow-xl h-full flex flex-col">
      {/* Logo section */}
      <div className="flex items-center justify-center h-20 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
            <span className="text-blue-600 font-bold text-lg">H</span>
          </div>
          <span className="text-white font-bold text-xl">HRIS Portal</span>
        </div>
      </div>

      {/* User profile section */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard/profile" className="flex items-center hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors group">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center group-hover:bg-gray-400 transition-colors">
            <UserCircleIcon className="w-6 h-6 text-gray-600 group-hover:text-gray-700" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700">
              {user ? `${user.firstName} ${user.lastName}` : 'Admin'}
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-3 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 transition-colors ${
                  isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              {item.name}
              {item.name === 'Kehadiran' && (
                <span className="ml-auto inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  3
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Admin Panel</span>
          <BellIcon className="h-5 w-5 text-gray-400" />
        </div>
        <button 
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md flex items-center justify-center"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
}