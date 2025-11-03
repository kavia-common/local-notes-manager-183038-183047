import React from 'react';
import NoteCard from './NoteCard';

/**
 * NotesList renders a grid of notes.
 */
// PUBLIC_INTERFACE
export default function NotesList({ notes, onEdit, onDelete }) {
  if (!notes?.length) {
    return (
      <div className="card" style={{ padding: '1rem' }} aria-live="polite">
        No notes yet. Click the + button to add your first note.
      </div>
    );
  }

  return (
    <section className="notes-grid" aria-label="Notes list">
      {notes.map((n) => (
        <NoteCard key={n.id} note={n} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </section>
  );
}
