import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const baseURL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${baseURL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {

      // Simpan ke localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      // Navigasi ke dashboard
      navigate('/dashboard');
    } else {
      setMessage(data.message || 'Login gagal');
    }
  } catch (error) {
    console.error('Login error:', error);
    setMessage('Terjadi kesalahan server');
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {message && <p className="mb-2 text-red-600">{message}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border mb-3"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border mb-3"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
