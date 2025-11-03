import React from 'react';

/**
 * Header with app title, search box, and theme toggle.
 * Accessibility: labels for controls; uses props for handlers.
 */
// PUBLIC_INTERFACE
export default function Header({ title, theme, onToggleTheme, searchQuery, onSearchChange }) {
  return (
    <header className="header" role="banner">
      <div className="header-inner">
        <div className="brand" aria-label="Application title">
          <span className="title">{title}</span>
        </div>

        <div className="search" role="search">
          <label htmlFor="search-notes" className="visually-hidden">
            Search notes
          </label>
          <input
            id="search-notes"
            className="input"
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search notes"
          />
        </div>

        <div>
          <button
            className="btn btn-ghost"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>
    </header>
  );
}
