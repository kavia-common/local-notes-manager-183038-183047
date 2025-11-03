import React from 'react';

function formatDate(ts) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return '';
  }
}

/**
 * A single note card showing title, partial content and updated time.
 */
// PUBLIC_INTERFACE
export default function NoteCard({ note, onEdit, onDelete }) {
  const snippet = note.content?.length ? note.content.slice(0, 140) + (note.content.length > 140 ? '…' : '') : '';

  return (
    <article className="card note-card" aria-label={`Note ${note.title}`}>
      <div className="note-title">{note.title}</div>
      {snippet && <div className="note-snippet">{snippet}</div>}
      <div className="note-meta">
        <span aria-label="Last updated">Updated {formatDate(note.updatedAt)}</span>
      </div>
      <div className="note-actions">
        <button
          className="btn btn-primary"
          onClick={() => onEdit(note)}
          aria-label={`Edit note ${note.title}`}
        >
          Edit
        </button>
        <button
          className="btn btn-danger"
          onClick={() => onDelete(note.id)}
          aria-label={`Delete note ${note.title}`}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
