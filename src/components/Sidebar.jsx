// src/components/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Package,
  ShoppingCart,
  TrendingUp,
  Settings as SettingsIcon,
  LogOut,
  FileText
} from 'lucide-react';

const baseURL = import.meta.env.VITE_API_URL;

const Sidebar = ({ userImage }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const currentPath = location.pathname.replace('/', '');

  const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'products', label: 'Produk', icon: Package },
  { id: 'sales', label: 'Penjualan', icon: ShoppingCart },
  { id: 'reports', label: 'Laporan', icon: TrendingUp },
  { id: 'activity', label: 'Aktivitas', icon: FileText }, // 👈 Tambahan tab activity
  { id: 'settings', label: 'Pengaturan', icon: SettingsIcon },
];


  const handleLogout = async () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user?.email) {
    try {
      await fetch(`${baseURL}/api/users/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
    } catch (error) {
      console.error('Gagal update last login saat logout:', error);
    }
  }

  localStorage.removeItem('user');
  window.location.href = '/'; // atau navigate('/')
};

  

  if (!user) {
    return (
      <div className="w-64 p-6 text-gray-500 text-sm">
        Memuat data pengguna...
      </div>
    );
  }

  const userName = user?.name || 'Admin';
  const lastLogout = user?.last_logout;
  const userRole = user?.role || 'admin';

 return (
  <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg flex flex-col justify-between">
    
    {/* === Bagian Atas: Header dan Navigasi === */}
    <div>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900">TB 453</h2>
        <p className="text-sm text-gray-600 mt-1">Shop Management System</p>
        <div className="mt-6 bg-blue-50 text-blue-700 p-3 rounded-lg text-sm font-semibold">
          YOU'RE LOGIN AS {userRole.toUpperCase()}
        </div>
      </div>

      <nav className="mt-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(`/${tab.id}`)}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
              currentPath === tab.id
                ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-700'
                : 'text-gray-600'
            }`}
          >
            <tab.icon className="w-5 h-5 mr-3" />
            {tab.label}
          </button>
        ))}
      </nav>
    </div>

    {/* === Bagian Bawah: Profil & Logout === */}
    <div className="border-t">
      {/* Profile Clickable */}
      <div
        onClick={() => navigate('/profile')}
        className="p-4 flex items-center space-x-3 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
      >
        <img
          src={
            userImage ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`
          }
          alt="User profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-medium text-gray-800">
            {lastLogout ? 'Welcome Back!' : 'Welcome!'}
          </p>
          <p className="text-xs text-gray-500">{userName}</p>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-gray-500 hover:bg-red-600 text-white py-2 px-4 transition-colors duration-200 rounded-lg text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  </div>
);

};

export default Sidebar;
