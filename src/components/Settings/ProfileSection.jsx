import React, { useState, useEffect } from 'react';


const baseURL = import.meta.env.VITE_API_URL;


const ProfileSection = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const email = user?.email;

  useEffect(() => {
    // Inisialisasi nama dari localStorage saat komponen dimuat
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const res = await fetch(`${baseURL}/api/users/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage('Perubahan berhasil disimpan.');
        localStorage.setItem('user', JSON.stringify({ ...user, name }));
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setSuccessMessage(data.message || 'Gagal menyimpan perubahan.');
      }
    } catch (err) {
      setSuccessMessage('Terjadi kesalahan server.');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Profil Pengguna</h3>

      {successMessage && (
        <div className="bg-green-100 text-green-800 p-2 rounded text-sm mb-2">
          {successMessage}
        </div>
      )}

      
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border rounded-md p-2"
          />
        </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password Baru</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border rounded-md p-2"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;
