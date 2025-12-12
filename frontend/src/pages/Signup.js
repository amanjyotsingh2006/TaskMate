import React, { useState } from 'react';
import API, { setAuthToken } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await API.post('/auth/signup', form);
      // optionally auto-login
      setAuthToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (error) {
      setErr(error.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Sign up</h2>
        {err && <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">{err}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="name" value={form.name} onChange={onChange} placeholder="Name" className="w-full p-2 border rounded" />
          <input name="email" value={form.email} onChange={onChange} placeholder="Email" className="w-full p-2 border rounded" />
          <input name="password" value={form.password} onChange={onChange} placeholder="Password" type="password" className="w-full p-2 border rounded" />
          <button className="w-full bg-blue-600 text-white p-2 rounded">Create account</button>
        </form>
        <p className="mt-3">Already have an account? <Link className="text-blue-600" to="/login">Login</Link></p>
      </div>
    </div>
  );
}
