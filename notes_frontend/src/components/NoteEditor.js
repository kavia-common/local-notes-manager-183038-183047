import React, { useEffect, useRef, useState } from 'react';

/**
 * NoteEditor modal for adding/updating a note.
 * Props:
 * - open: boolean
 * - note: { id|null, title, content } or null
 * - onSave: ({title, content}) => void
 * - onClose: () => void
 */
// PUBLIC_INTERFACE
export default function NoteEditor({ open, note, onSave, onClose }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const titleRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTitle(note?.title || '');
      setContent(note?.content || '');
      setTimeout(() => {
        titleRef.current?.focus();
      }, 0);
    }
  }, [open, note]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) {
      // Simple client validation; focus title
      titleRef.current?.focus();
      return;
    }
    onSave({ title: t, content });
  };

  const labelId = 'note-editor-title';

  return (
    <div
      className="editor-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="editor-modal" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="editor-header">
            <h2 id={labelId} style={{ margin: 0, fontSize: '1rem' }}>
              {note?.id ? 'Edit Note' : 'New Note'}
            </h2>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              aria-label="Close editor"
            >
              ✕
            </button>
          </div>

          <div className="editor-body">
            <div>
              <label htmlFor="note-title" style={{ display: 'block', marginBottom: 4 }}>
                Title
              </label>
              <input
                id="note-title"
                ref={titleRef}
                className="input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                aria-required="true"
                placeholder="Title"
              />
            </div>
            <div>
              <label htmlFor="note-content" style={{ display: 'block', marginBottom: 4 }}>
                Content
              </label>
              <textarea
                id="note-content"
                className="textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write something..."
              />
            </div>
          </div>

          <div className="editor-actions">
            <button type="button" className="btn" onClick={onClose} aria-label="Cancel editing">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" aria-label="Save note">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
