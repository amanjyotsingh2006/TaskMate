import React, { useEffect, useState } from 'react';
import API, { setAuthToken } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [err, setErr] = useState('');

  useEffect(() => {
    if (token) setAuthToken(token);
    fetchNotes();
    // eslint-disable-next-line
  }, [token]);

  const fetchNotes = async () => {
    try {
      const res = await API.get('/notes');
      setNotes(res.data);
    } catch (e) {
      console.error(e);
      if (e.response?.status === 401) logout();
    }
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const createNote = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await API.post('/notes', form);
      setNotes(prev => [res.data, ...prev]);
      setForm({ title: '', content: '' });
    } catch (err) {
      setErr(err.response?.data?.msg || 'Error creating note');
    }
  };

  const startEdit = (note) => {
    setEditing(note);
    setForm({ title: note.title, content: note.content });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/notes/${editing._id}`, form);
      setNotes(prev => prev.map(n => n._id === res.data._id ? res.data : n));
      setEditing(null);
      setForm({ title: '', content: '' });
    } catch (err) {
      setErr(err.response?.data?.msg || 'Error updating');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete note?')) return;
    try {
      await API.delete(`/notes/${id}`);
      setNotes(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };


  const filtered = notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen">
      <Navbar onAdd={() => { setEditing(null); setForm({ title: '', content: '' }); window.scrollTo(0, 0); }} />
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Your Notes</h1>
          <div className="flex gap-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title" className="border p-2 rounded" />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="font-medium mb-2">{editing ? 'Edit Note' : 'Create Note'}</h2>
          {err && <div className="bg-red-100 text-red-700 p-2 rounded mb-2">{err}</div>}
          <form onSubmit={editing ? saveEdit : createNote} className="space-y-2">
            <input name="title" value={form.title} onChange={onChange} placeholder="Title" className="w-full p-2 border rounded" />
            <textarea name="content" value={form.content} onChange={onChange} placeholder="Content (optional)" className="w-full p-2 border rounded" rows="4" />
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded">{editing ? 'Save' : 'Add Note'}</button>
              {editing && <button type="button" onClick={() => { setEditing(null); setForm({ title: '', content: '' }); }} className="px-3 py-1 border rounded">Cancel</button>}
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.length === 0 && <div className="text-gray-500">No notes yet.</div>}
          {filtered.map(note => (
            <div key={note._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{note.title}</h3>
                  <p className="text-sm text-gray-600">{note.content}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(note)} className="text-sm px-2 py-1 border rounded">Edit</button>
                  <button onClick={() => remove(note._id)} className="text-sm px-2 py-1 bg-red-100 rounded">Delete</button>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2">Created: {new Date(note.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
