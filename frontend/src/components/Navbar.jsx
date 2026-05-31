import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">✓</span>
        <h1>Task Manager</h1>
      </div>
      <div className="navbar-actions">
        <span className="navbar-user">Hi, {user?.name}</span>
        <button type="button" className="btn btn-ghost" onClick={logout}>
          Log out
        </button>
      </div>
    </header>
  );
}
