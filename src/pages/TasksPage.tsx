import { useEffect, useState } from "react";
import type { ProductTaskRecord } from "../types";

interface TasksPageProps {
  tasks: ProductTaskRecord[];
  onDeleteTask: (taskId: string) => void;
}

export function TasksPage({ tasks, onDeleteTask }: TasksPageProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id ?? "");
  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? tasks[0] ?? null;

  useEffect(() => {
    if (!tasks.length) {
      setSelectedTaskId("");
      return;
    }

    if (!tasks.some((task) => task.id === selectedTaskId)) {
      setSelectedTaskId(tasks[0].id);
    }
  }, [selectedTaskId, tasks]);

  return (
    <section className="page-stack">
      <div className="page-intro">
        <p className="eyebrow">History</p>
        <h3>Product Task History</h3>
        <p className="panel-intro">A mocked task log for generated product copy and poster outputs, useful for browsing previous runs and reviewing historical drafts.</p>
      </div>

      {tasks.length === 0 ? (
        <article className="panel state-card">
          <div className="state-graphic state-graphic-empty" />
          <h3>No task history yet</h3>
          <p>Generate a draft to create a new task record in local storage.</p>
        </article>
      ) : (
        <div className="library-layout">
          <article className="panel library-list-panel">
            <div className="library-list-header">
              <div>
                <p className="eyebrow">History</p>
                <h3>{tasks.length} stored tasks</h3>
              </div>
              <p className="library-meta">Select a run to inspect its input and generated output.</p>
            </div>

            <div className="history-list">
              {tasks.map((task) => {
                const isActive = task.id === selectedTask?.id;
                return (
                  <button
                    key={task.id}
                    type="button"
                    className={`history-row ${isActive ? "history-row-active" : ""}`}
                    onClick={() => setSelectedTaskId(task.id)}
                  >
                    <div className="history-row-main">
                      <strong>{task.name}</strong>
                      <small>{task.input.category} · {task.createdAt.slice(0, 10)}</small>
                    </div>
                    <span className={`result-status-badge result-status-${task.status}`}>{task.status}</span>
                  </button>
                );
              })}
            </div>
          </article>

          {selectedTask ? (
            <article className="panel task-detail-panel">
              <div className="task-card-top">
                <div>
                  <p className="eyebrow">Task Detail</p>
                  <h3>{selectedTask.name}</h3>
                </div>
                <span className={`result-status-badge result-status-${selectedTask.status}`}>{selectedTask.status}</span>
              </div>

              <div className="task-card-grid">
                <div className="task-image-pair">
                  <figure className="task-image-card">
                    <img src={selectedTask.input.originalImage} alt={`${selectedTask.name} input`} className="task-image" />
                    <figcaption>Input image</figcaption>
                  </figure>
                  <figure className="task-image-card">
                    <img src={selectedTask.output.generatedPosterImage} alt={`${selectedTask.name} output`} className="task-image" />
                    <figcaption>Generated poster</figcaption>
                  </figure>
                </div>

                <div className="task-copy-block">
                  <p className="library-meta">{selectedTask.input.category} · Created {selectedTask.createdAt.slice(0, 10)}</p>
                  <div className="tag-row">
                    {selectedTask.input.features.map((feature) => (
                      <span key={feature} className="tag-pill">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="task-copy-section">
                    <strong>Generated title</strong>
                    <p>{selectedTask.output.generatedTitle}</p>
                  </div>
                  <div className="task-copy-section">
                    <strong>Generated copy</strong>
                    <p className="library-copy">{selectedTask.output.generatedCopy}</p>
                  </div>
                  <div className="button-row">
                    <button type="button" className="button button-secondary" onClick={() => onDeleteTask(selectedTask.id)}>
                      Delete Task
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ) : null}
        </div>
      )}
    </section>
  );
}
