import { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, X, User, Mail, Shield, Clock  } from 'lucide-react';
const baseURL = import.meta.env.VITE_API_URL;


const AccountSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [assignedRole, setAssignedRole] = useState('kasir');
  const [newPassword, setNewPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch(`${baseURL}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data.users))
      .catch(err => console.error('Gagal memuat data pengguna:', err));
  }, []);

  useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    setCurrentUser(JSON.parse(storedUser));
  }
}, []);

  const resetForm = () => {
    setName('');
    setEmail('');
    setAssignedRole('kasir');
    setNewPassword('');
    setEditingUserId(null);
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddAccount = async () => {
    if (!name.trim() || !email.trim() || !newPassword.trim()) {
      return alert('Lengkapi semua data');
    }

    try {
      const res = await fetch(`${baseURL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: newPassword, role: assignedRole })
      });

      if (res.ok) {
        showMessage('Akun berhasil ditambahkan');
        resetForm();
        const updated = await fetch(`${baseURL}/api/users`).then(r => r.json());
        setUsers(updated.users);
      } else {
        const err = await res.json();
        alert(err.message || 'Email pengguna telah digunakan');
      }
    } catch (error) {
      console.error('Gagal menambahkan akun:', error);
    }
  };

  const handleEditAccount = async () => {
  if (!name || !email || !assignedRole) return alert('Lengkapi semua data');

  try {
    const res = await fetch(`${baseURL}/api/users/${editingUserId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: newPassword, role: assignedRole }),
    });

    if (res.ok) {
      alert('Berhasil Edit Akun');
      resetForm(); // clear state
      const updated = await fetch(`${baseURL}/api/users`).then(r => r.json());
      setUsers(updated.users);
    } else {
      const err = await res.json();
      alert(err.message || 'Gagal Edit Akun');
    }
  } catch (err) {
    console.error('Gagal edit akun:', err);
  }
};


  const handleDeleteAccount = async (userId) => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus akun ini?');
    if (!confirmed) return;

    try {
      await fetch(`${baseURL}/api/users/${userId}`, {
        method: 'DELETE'
      });
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Gagal menghapus akun:', error);
    }
  };


  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Manajemen Akun</h3>

      {message && (
        <div className="bg-green-100 text-green-800 p-2 rounded text-sm mb-3">
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Pengguna</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email Pengguna</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Pilih Role</label>
          <select
            value={assignedRole}
            onChange={(e) => setAssignedRole(e.target.value)}
            className="mt-1 w-full border rounded-md p-2"
          >
            <option value="admin">Admin</option>
            <option value="kasir">Kasir</option>
            <option value="gudang">Gudang</option>
          </select>
        </div>

        <div className="flex space-x-4">
          <button
          onClick={handleAddAccount}
          className={`px-4 py-2 rounded flex items-center space-x-2 ${
            editingUserId
              ? 'bg-gray-200 text-gray-00 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          disabled={editingUserId !== null}
        >
          {editingUserId ? (
            <>
              <span>Tambahkan Akun</span>
            </>
          ) : (
            <span>Tambahkan Akun</span>
          )}
        </button>

          <button
            onClick={handleEditAccount}
            className={`${
              editingUserId ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
            } text-white px-4 py-2 rounded`}
            disabled={!editingUserId}
          >
            Edit Akun
          </button>
        </div>
        {editingUserId && (
  <>
    <button
      onClick={resetForm}
      className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
    >
      Batal Edit
    </button>

    <p className="text-sm text-gray-500 mt-1">
      Anda sedang dalam mode edit. Klik <strong>Batal Edit</strong> untuk menambahkan akun baru.
    </p>
  </>
)}
{selectedUser && (
  <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 mb-6">
      {/* Header with close button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h4 className="font-bold text-xl text-gray-800">Informasi Pengguna</h4>
        </div>
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
          onClick={() => setSelectedUser(null)}
        >
          <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
        </button>
      </div>
      
      {/* User Information Grid */}
      <div className="space-y-4">
  {/* Nama */}
  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100">
    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
      <User className="w-5 h-5 text-blue-600" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">Nama</p>
      <p className="font-semibold text-gray-800">{selectedUser.name}</p>
    </div>
  </div>

  {/* Email */}
  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100">
    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
      <Mail className="w-5 h-5 text-green-600" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">Email</p>
      <p className="font-semibold text-gray-800">{selectedUser.email}</p>
    </div>
  </div>

        {/* Role */}
        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">Role</p>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-800">{selectedUser.role}</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full capitalize">
  {selectedUser.role}
</span>
            </div>
          </div>
        </div>

        {/* Last Login */}
        {selectedUser && (
       <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100">
  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
    <Clock className="w-5 h-5 text-orange-600" />
  </div>
  <div>
    <p className="text-sm font-medium text-gray-500">Terakhir Logout</p>
    <p className="text-sm text-gray-600">
      {selectedUser.last_logout
        ? new Date(selectedUser.last_logout).toLocaleString('id-ID')
        : 'Belum logout'}
    </p>
  </div>
</div>
)}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-100 to-blue-100 rounded-full -ml-8 -mb-8 opacity-30"></div>
    </div>
)}
      </div>

      <div className="mt-8">
  <h4 className="text-md font-semibold mb-2">Daftar Pengguna</h4>
  <table className="min-w-full text-sm border">
    <thead>
      <tr className="bg-gray-100 text-left">
        <th className="p-2 border">Nama</th>
        <th className="p-2 border">Role</th>
        <th className="p-2 border">Aksi</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user => (
        <tr key={user.id} className="border-t">
          <td className="p-2 border">{user.name}</td>
          <td className="p-2 border capitalize">{user.role}</td>
          <td className="p-2 border">
            <div className="flex items-center space-x-2">
              <button
                  className="text-blue-600 hover:text-blue-900"
                  onClick={() => {
                    setSelectedUser(user);
                    window.scrollTo({ top: 550, behavior: 'smooth' }); // scroll ke atas dengan animasi
                  }}
                >
                <Eye className="w-4 h-4" />
              </button>
                <button
                  onClick={() => {
                    setName(user.name || '');
                    setEmail(user.email);
                    setAssignedRole(user.role);
                    setEditingUserId(user.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' }); // 👈 ini bagian yang scroll ke atas
              }}
                  className="text-green-600 hover:text-green-900"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteAccount(user.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountSection;
