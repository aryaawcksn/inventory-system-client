// src/components/AccessDenied.jsx
import React from 'react';
import { Lock } from 'lucide-react';

const AccessDenied = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-20">
      <Lock className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800">Akses Ditolak</h2>
      <p className="text-gray-600 mt-2">Anda tidak memiliki hak akses untuk melihat halaman ini.</p>
    </div>
  );
};

export default AccessDenied;
