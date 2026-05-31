import { useState, useEffect, useCallback } from 'react';
import { tasksApi, ApiError } from '../services/api';
import Navbar from '../components/Navbar';
import DashboardHero from '../components/DashboardHero';
import TaskBoard from '../components/TaskBoard';
import TaskForm from '../components/TaskForm';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchTasks = useCallback(async () => {
    setError(null);
    try {
      const data = await tasksApi.getAll();
      setTasks(data.tasks);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async (formData) => {
    setSubmitting(true);
    setError(null);
    try {
      const data = await tasksApi.create(formData);
      setTasks((prev) => [data.task, ...prev]);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (formData) => {
    if (!editingTask) return;
    setSubmitting(true);
    setError(null);
    try {
      const data = await tasksApi.update(editingTask._id, formData);
      setTasks((prev) => prev.map((t) => (t._id === data.task._id ? data.task : t)));
      setEditingTask(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    setDeletingId(id);
    setError(null);
    try {
      await tasksApi.delete(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete task');
    } finally {
      setDeletingId(null);
    }
  };

  const handleStageChange = async (id, stage) => {
    setUpdatingId(id);
    setError(null);
    const previous = tasks.find((t) => t._id === id);
    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, stage } : t)));

    try {
      const data = await tasksApi.update(id, { stage });
      setTasks((prev) => prev.map((t) => (t._id === id ? data.task : t)));
    } catch (err) {
      if (previous) {
        setTasks((prev) => prev.map((t) => (t._id === id ? previous : t)));
      }
      setError(err instanceof ApiError ? err.message : 'Failed to update stage');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-main">
        {!loading && <DashboardHero tasks={tasks} />}

        <div className="dashboard-toolbar animate-fade-in">
          <div className="dashboard-toolbar-text">
            <h3>Task board</h3>
            <p className="dashboard-subtitle">Organize work across three stages</p>
          </div>
          {!showForm && !editingTask && (
            <button
              type="button"
              className="btn btn-primary btn-glow"
              onClick={() => setShowForm(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              New task
            </button>
          )}
        </div>

        <Alert message={error} onDismiss={() => setError(null)} />

        {showForm && (
          <div className="form-panel animate-expand">
            <h3>New task</h3>
            <TaskForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
              submitting={submitting}
            />
          </div>
        )}

        {editingTask && (
          <div className="form-panel animate-expand">
            <h3>Edit task</h3>
            <TaskForm
              initial={editingTask}
              onSubmit={handleUpdate}
              onCancel={() => setEditingTask(null)}
              submitting={submitting}
            />
          </div>
        )}

        {loading ? (
          <div className="dashboard-loading">
            <LoadingSpinner label="Loading your tasks..." />
          </div>
        ) : (
          <TaskBoard
            tasks={tasks}
            onEdit={setEditingTask}
            onDelete={handleDelete}
            onStageChange={handleStageChange}
            deletingId={deletingId}
            updatingId={updatingId}
          />
        )}
      </main>
    </div>
  );
}
