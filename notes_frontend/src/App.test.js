import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

const NOTES_KEY = 'kavia_notes_v1';

beforeEach(() => {
  // Clear storage before each test
  window.localStorage.clear();
  jest.spyOn(window.localStorage.__proto__, 'setItem');
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders header title', () => {
  render(<App />);
  expect(screen.getByText(/Local Notes/i)).toBeInTheDocument();
});

test('can add a note through editor', () => {
  render(<App />);

  const fab = screen.getByTestId('fab-add');
  fireEvent.click(fab);

  const titleInput = screen.getByLabelText(/Title/i);
  const contentInput = screen.getByLabelText(/Content/i);

  fireEvent.change(titleInput, { target: { value: 'My first note' } });
  fireEvent.change(contentInput, { target: { value: 'Hello world' } });

  const saveBtn = screen.getByRole('button', { name: /Save note/i });
  fireEvent.click(saveBtn);

  expect(screen.getByText(/My first note/i)).toBeInTheDocument();
  expect(window.localStorage.setItem).toHaveBeenCalled();
});

test('can edit a note', () => {
  // seed
  const seeded = [
    { id: '1', title: 'Original', content: 'Text', updatedAt: Date.now() - 1000 },
  ];
  window.localStorage.setItem(NOTES_KEY, JSON.stringify(seeded));

  render(<App />);

  const editBtn = screen.getByRole('button', { name: /Edit note Original/i });
  fireEvent.click(editBtn);

  const titleInput = screen.getByLabelText(/Title/i);
  fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

  const saveBtn = screen.getByRole('button', { name: /Save note/i });
  fireEvent.click(saveBtn);

  expect(screen.getByText(/Updated Title/i)).toBeInTheDocument();
  expect(window.localStorage.setItem).toHaveBeenCalled();
});

test('can delete a note', () => {
  // seed
  const seeded = [
    { id: '1', title: 'Delete Me', content: 'Bye', updatedAt: Date.now() - 1000 },
  ];
  window.localStorage.setItem(NOTES_KEY, JSON.stringify(seeded));

  // mock confirm
  const spy = jest.spyOn(window, 'confirm').mockImplementation(() => true);

  render(<App />);

  const delBtn = screen.getByRole('button', { name: /Delete note Delete Me/i });
  fireEvent.click(delBtn);

  expect(screen.queryByText(/Delete Me/i)).not.toBeInTheDocument();
  expect(window.localStorage.setItem).toHaveBeenCalled();

  spy.mockRestore();
});

test('loads notes from localStorage on first render', () => {
  const seeded = [
    { id: 'a1', title: 'Persisted', content: 'Stored', updatedAt: Date.now() - 5000 },
  ];
  window.localStorage.setItem(NOTES_KEY, JSON.stringify(seeded));

  render(<App />);

  expect(screen.getByText(/Persisted/i)).toBeInTheDocument();
});
