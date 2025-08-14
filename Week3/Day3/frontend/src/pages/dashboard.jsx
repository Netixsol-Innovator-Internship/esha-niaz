import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/taskForm.jsx';
import TaskList from '../components/taskList.jsx';
import { taskAPI } from '../services/api.js';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  const DEV_MODE = false;
  const token = DEV_MODE ? 'dev-token' : localStorage.getItem('token');

  const fetchTasks = useCallback(async () => {
    setBusy(true);
    setError('');
    try {
      const data = DEV_MODE
        ? [
            { _id: '1', title: 'Mock Task 1', description: 'Sample description', status: 'pending' },
            { _id: '2', title: 'Mock Task 2', description: 'Another sample', status: 'completed' },
          ]
        : await taskAPI.list();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to fetch tasks';
      setError(msg);
    } finally {
      setBusy(false);
    }
  }, [DEV_MODE]);

  useEffect(() => {
    if (!DEV_MODE && !token) {
      navigate('/login', { replace: true });
      return;
    }
    fetchTasks();
  }, [navigate, token, DEV_MODE, fetchTasks]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const handleCreate = async (payload) => {
    setBusy(true);
    setError('');
    try {
      if (!DEV_MODE) {
        await taskAPI.create(payload); // save to backend
        await fetchTasks(); // refresh from backend so Postman sees same data
      } else {
        setTasks((prev) => [...prev, { _id: Date.now().toString(), ...payload, status: 'pending' }]);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create task';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleUpdate = async (payload) => {
    if (!editing?._id) return;
    setBusy(true);
    setError('');
    try {
      if (!DEV_MODE) {
        await taskAPI.update(editing._id, payload);
        await fetchTasks();
      } else {
        setTasks((prev) => prev.map((t) => (t._id === editing._id ? { ...t, ...payload } : t)));
      }
      setEditing(null);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update task';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    setBusy(true);
    setError('');
    try {
      if (!DEV_MODE) {
        await taskAPI.remove(id);
        await fetchTasks();
      } else {
        setTasks((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete task';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleToggle = async (task) => {
    setBusy(true);
    setError('');
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      if (!DEV_MODE) {
        await taskAPI.update(task._id, { status: newStatus });
        await fetchTasks();
      } else {
        setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t)));
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to toggle task';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 md:mb-0 tracking-tight">
            Task Manager
          </h1>
          {!DEV_MODE && (
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-red-500 text-white font-semibold rounded-xl shadow-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </header>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow text-center font-medium">
            {error}
          </div>
        )}
        {busy && (
          <div className="mb-6 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 rounded-lg shadow text-center font-medium">
            Loading…
          </div>
        )}

        {/* Task Form */}
        <div className="mb-10 bg-white shadow-xl rounded-2xl p-6 md:p-8">
          <TaskForm
            initial={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => setEditing(null)}
            loading={busy}
          />
        </div>

        {/* Task List */}
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Your Tasks</h2>
          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={(t) => setEditing(t)}
          />
        </div>

      </div>
    </div>
  );
}
