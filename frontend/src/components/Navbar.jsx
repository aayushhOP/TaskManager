import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar animate-fade-in">
      <div className="navbar-brand">
        <span className="navbar-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 12.5l2.5 2.5L15 10"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h1>Task Manager</h1>
      </div>

      <div className="navbar-actions">
        <div className="navbar-profile">
          <UserAvatar name={user?.name} email={user?.email} size="md" showRing />
          <div className="navbar-profile-text">
            <span className="navbar-user-name">{user?.name}</span>
            <span className="navbar-user-email">{user?.email}</span>
          </div>
        </div>
        <button type="button" className="btn btn-ghost btn-logout" onClick={logout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Log out
        </button>
      </div>
    </header>
  );
}
