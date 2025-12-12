import React, { useState } from 'react';
import API, { setAuthToken } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await API.post('/auth/login', form);
      const { token, user } = res.data;
      setAuthToken(token);
      login(token, user);
      navigate('/dashboard');
    } catch (error) {
      setErr(error.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Login</h2>
        {err && <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">{err}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="email" value={form.email} onChange={onChange} placeholder="Email" className="w-full p-2 border rounded" />
          <input name="password" value={form.password} onChange={onChange} placeholder="Password" type="password" className="w-full p-2 border rounded" />
          <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
        </form>
        <p className="mt-3">No account? <Link className="text-blue-600" to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
}
