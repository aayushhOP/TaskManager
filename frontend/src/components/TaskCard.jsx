import { STAGE_LABELS, STAGES } from '../constants/stages';

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStageChange,
  deleting = false,
  updating = false,
}) {
  const currentIndex = STAGES.indexOf(task.stage);

  return (
    <article className={`task-card ${updating ? 'task-card-busy' : ''}`}>
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
            ✎
          </button>
          <button
            type="button"
            className="btn-icon btn-icon-danger"
            onClick={() => onDelete(task._id)}
            aria-label="Delete task"
            disabled={deleting || updating}
          >
            {deleting ? '…' : '×'}
          </button>
        </div>
      </div>
      {task.description && <p className="task-card-desc">{task.description}</p>}
      <div className="task-card-footer">
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
        <div className="stage-dots" aria-hidden="true">
          {STAGES.map((stage, i) => (
            <span
              key={stage}
              className={`stage-dot ${i <= currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
