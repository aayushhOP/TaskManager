import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';
import { getGreeting } from '../utils/avatar';
import { STAGES, STAGE_LABELS } from '../constants/stages';

export default function DashboardHero({ tasks }) {
  const { user } = useAuth();
  const counts = STAGES.reduce((acc, stage) => {
    acc[stage] = tasks.filter((t) => t.stage === stage).length;
    return acc;
  }, {});

  return (
    <section className="dashboard-hero animate-slide-up">
      <div className="dashboard-hero-main">
        <UserAvatar
          name={user?.name}
          email={user?.email}
          size="xl"
          showRing
          className="dashboard-hero-avatar"
        />
        <div className="dashboard-hero-text">
          <p className="dashboard-hero-greeting">{getGreeting()},</p>
          <h2 className="dashboard-hero-name">{user?.name?.split(' ')[0] || 'there'}</h2>
          <p className="dashboard-hero-subtitle">
            You have <strong>{tasks.length}</strong> task{tasks.length !== 1 ? 's' : ''} on your
            board
          </p>
        </div>
      </div>

      <div className="dashboard-stats">
        {STAGES.map((stage, i) => (
          <div
            key={stage}
            className="stat-pill"
            data-stage={stage}
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
          >
            <span className="stat-pill-value">{counts[stage]}</span>
            <span className="stat-pill-label">{STAGE_LABELS[stage]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
