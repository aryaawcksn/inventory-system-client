import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

const baseURL = import.meta.env.VITE_API_URL;
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shakePassword, setShakePassword] = useState(false);
  const [shakeEmail, setShakeEmail] = useState(false);
  const [shakeCaptcha, setShakeCaptcha] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCaptcha = (token) => {
    setCaptchaToken(token);
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setMessage('');

  if (!captchaToken) {
    setMessage('Silakan verifikasi captcha terlebih dahulu');
    setShakeCaptcha(true);
    setTimeout(() => setShakeCaptcha(false), 500);
    return;
  }

  setIsLoading(true);

  try {
    const res = await fetch(`${baseURL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, captcha: captchaToken }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } else {
      setMessage(data.message || 'Login gagal');

      if (data.message === 'Password salah') {
        setShakePassword(true);
        setTimeout(() => setShakePassword(false), 500);
      }

      if (data.message === 'User tidak ditemukan') {
        setShakeEmail(true);
        setTimeout(() => setShakeEmail(false), 500);
      }
    }
  } catch (error) {
    setMessage('Terjadi kesalahan server');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow relative">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      {message && (
        <p
          className={`mb-2 text-red-600 transition duration-300 ${
            shakeEmail || shakePassword ? 'animate-shake' : ''
          }`}
        >
          {message}
        </p>
      )}

            <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={`w-full p-2 border mb-3 transition duration-300 ${
            shakeEmail ? 'animate-shake border-red-500' : ''
          }`}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className={`w-full p-2 border mb-3 transition duration-300 ${
            shakePassword ? 'animate-shake border-red-500' : ''
          }`}
          required
        />

        <ReCAPTCHA
          sitekey={siteKey}
          onChange={handleCaptcha}
          className={`mb-3 transition-all duration-300 ${
            shakeCaptcha ? 'animate-shake' : ''
          }`}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          disabled={isLoading}
        >
          Login
        </button>
      </form>


      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="text-white font-semibold animate-pulse">Mencoba Masuk...</div>
        </div>
      )}
    </div>
  );
};

export default Login;
