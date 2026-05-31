import { STAGES, STAGE_LABELS } from '../constants/stages';
import TaskCard from './TaskCard';

const STAGE_ICONS = {
  todo: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  in_progress: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  done: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 12l2 2 4-4M12 21a9 9 0 100-18 9 9 0 000 18z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export default function TaskBoard({
  tasks,
  onEdit,
  onDelete,
  onStageChange,
  deletingId,
  updatingId,
}) {
  const grouped = STAGES.reduce((acc, stage) => {
    acc[stage] = tasks.filter((t) => t.stage === stage);
    return acc;
  }, {});

  return (
    <div className="task-board">
      {STAGES.map((stage, colIndex) => (
        <section
          key={stage}
          className="board-column animate-slide-up"
          data-stage={stage}
          style={{ animationDelay: `${0.15 + colIndex * 0.1}s` }}
        >
          <header className="board-column-header">
            <div className="board-column-title">
              <span className="board-column-icon">{STAGE_ICONS[stage]}</span>
              <h2>{STAGE_LABELS[stage]}</h2>
            </div>
            <span className="board-count">{grouped[stage].length}</span>
          </header>
          <div className="board-column-body">
            {grouped[stage].length === 0 ? (
              <div className="board-empty">
                <span className="board-empty-icon">📋</span>
                <p>No tasks yet</p>
                <span className="board-empty-hint">Add one or drag here</span>
              </div>
            ) : (
              grouped[stage].map((task, cardIndex) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStageChange={onStageChange}
                  deleting={deletingId === task._id}
                  updating={updatingId === task._id}
                  animationDelay={`${0.05 * cardIndex}s`}
                />
              ))
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
