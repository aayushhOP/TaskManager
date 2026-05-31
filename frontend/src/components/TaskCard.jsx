import { STAGE_LABELS, STAGES } from '../constants/stages';

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStageChange,
  deleting = false,
  updating = false,
  animationDelay = '0s',
}) {
  const currentIndex = STAGES.indexOf(task.stage);

  return (
    <article
      className={`task-card animate-card-in ${updating ? 'task-card-busy' : ''} ${deleting ? 'task-card-exit' : ''}`}
      style={{ animationDelay }}
      data-stage={task.stage}
    >
      <div className="task-card-header">
        <h3>{task.title}</h3>
        <div className="task-card-actions">
          <button
            type="button"
            className="btn-icon"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            disabled={deleting || updating}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="btn-icon btn-icon-danger"
            onClick={() => onDelete(task._id)}
            aria-label="Delete task"
            disabled={deleting || updating}
          >
            {deleting ? (
              <span className="btn-icon-spinner" />
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      {task.description && <p className="task-card-desc">{task.description}</p>}
      <div className="task-card-footer">
        <div className="stage-select-wrapper">
          <select
            className="stage-select"
            value={task.stage}
            onChange={(e) => onStageChange(task._id, e.target.value)}
            disabled={deleting || updating}
            aria-label="Change task stage"
          >
            {STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {STAGE_LABELS[stage]}
              </option>
            ))}
          </select>
        </div>
        <div className="stage-progress" aria-hidden="true">
          {STAGES.map((stage, i) => (
            <span
              key={stage}
              className={`stage-segment ${i <= currentIndex ? 'active' : ''}`}
              data-stage={stage}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
