import { STAGES, STAGE_LABELS } from '../constants/stages';
import TaskCard from './TaskCard';

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
      {STAGES.map((stage) => (
        <section key={stage} className="board-column" data-stage={stage}>
          <header className="board-column-header">
            <h2>{STAGE_LABELS[stage]}</h2>
            <span className="board-count">{grouped[stage].length}</span>
          </header>
          <div className="board-column-body">
            {grouped[stage].length === 0 ? (
              <p className="board-empty">No tasks</p>
            ) : (
              grouped[stage].map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStageChange={onStageChange}
                  deleting={deletingId === task._id}
                  updating={updatingId === task._id}
                />
              ))
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
