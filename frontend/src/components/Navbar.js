import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onAdd }) {
  const { user, logout } = useAuth();
  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <div className="font-semibold">WavesNotes</div>
      <div className="flex items-center gap-4">
        <div className="text-sm">Hi, {user?.name}</div>
        <button onClick={onAdd} className="px-3 py-1 border rounded">Add</button>
        <button onClick={logout} className="px-3 py-1 bg-red-100 rounded">Logout</button>
      </div>
    </div>
  );
}
