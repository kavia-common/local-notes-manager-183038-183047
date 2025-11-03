import React, { useEffect, useMemo, useState, useCallback } from 'react';
import './App.css';
import './index.css';
import Header from './components/Header';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateId } from './utils/id';

/**
 * Notes data shape
 * {
 *   id: string,
 *   title: string,
 *   content: string,
 *   updatedAt: number
 * }
 */

// Keys for localStorage
const NOTES_KEY = 'kavia_notes_v1';
const THEME_KEY = 'kavia_theme';

// PUBLIC_INTERFACE
function App() {
  /** Theme handling with persistence */
  const [theme, setTheme] = useLocalStorage(THEME_KEY, 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  /** Notes state and editor state */
  const [notes, setNotes] = useLocalStorage(NOTES_KEY, []);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  /** Derived, filtered and sorted notes */
  const filteredSortedNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = q.length
      ? notes.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q)
        )
      : notes;

    return [...filtered].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, searchQuery]);

  /** CRUD handlers */

  // PUBLIC_INTERFACE
  const addNote = useCallback((note) => {
    // note: { title, content }
    const newNote = {
      id: generateId(),
      title: note.title.trim(),
      content: note.content || '',
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
  }, [setNotes]);

  // PUBLIC_INTERFACE
  const updateNote = useCallback((note) => {
    // note: { id, title, content }
    setNotes((prev) =>
      prev.map((n) =>
        n.id === note.id
          ? { ...n, title: note.title.trim(), content: note.content, updatedAt: Date.now() }
          : n
      )
    );
  }, [setNotes]);

  // PUBLIC_INTERFACE
  const deleteNote = useCallback((id) => {
    // confirm delete for safety (tests will mock confirm)
    // eslint-disable-next-line no-restricted-globals
    const ok = window.confirm ? window.confirm('Delete this note?') : true;
    if (!ok) return;
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, [setNotes]);

  /** Editor open/close handlers */

  // PUBLIC_INTERFACE
  const openEditor = useCallback((mode, note = null) => {
    if (mode === 'new') {
      setSelectedNote({ id: null, title: '', content: '' });
    } else if (mode === 'edit' && note) {
      setSelectedNote({ id: note.id, title: note.title, content: note.content });
    }
    setIsEditorOpen(true);
  }, []);

  // PUBLIC_INTERFACE
  const closeEditor = useCallback(() => {
    setIsEditorOpen(false);
    setSelectedNote(null);
  }, []);

  /** Save handler for editor */
  const handleSave = (data) => {
    if (selectedNote && selectedNote.id) {
      updateNote({ id: selectedNote.id, ...data });
    } else {
      addNote(data);
    }
    closeEditor();
  };

  return (
    <div className="app-root">
      <Header
        title="Local Notes"
        theme={theme}
        onToggleTheme={toggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="container">
        <NotesList
          notes={filteredSortedNotes}
          onEdit={(note) => openEditor('edit', note)}
          onDelete={(id) => deleteNote(id)}
        />
      </main>

      <button
        className="fab"
        aria-label="Add note"
        onClick={() => openEditor('new')}
        data-testid="fab-add"
      >
        +
      </button>

      <NoteEditor
        open={isEditorOpen}
        note={selectedNote}
        onClose={closeEditor}
        onSave={handleSave}
      />
    </div>
  );
}

export default App;
