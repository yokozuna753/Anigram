import { useState, useEffect } from 'react';
import './AnimeNotes.css';

export default function AnimeNotes({ userId, animeId, animeTitle }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'https://durz7obem4.execute-api.us-east-1.amazonaws.com/prod/notes';

    // Add validation for required props
    useEffect(() => {
        if (!userId || !animeId) {
          setError('Missing required userId or animeId');
          return;
        }
        console.log('Fetching notes for:', { userId, animeId, animeTitle });
        fetchNotes();
      }, [userId, animeId]);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      setError(null); // Clear any previous errors
      
      const response = await fetch(`${API_URL}?userId=${userId}&animeId=${animeId}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
        console.error('Error fetching notes:', err);
        setError(err.message || 'Failed to fetch notes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          animeId,
          content: newNote,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to add note');
      
      const addedNote = await response.json();
      setNotes([...notes, addedNote]);
      setNewNote('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}?userId=${userId}&animeId=${animeId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete note');
      
      setNotes(notes.filter(note => note.noteId !== noteId));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="anime-notes">
      <h3>Notes for {animeTitle}</h3>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={addNote} className="note-form">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Note'}
        </button>
      </form>

      <div className="notes-list">
        {notes.map((note) => (
          <div key={note.noteId} className="note-item">
            <p>{note.content}</p>
            <div className="note-meta">
              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
              <button
                onClick={() => deleteNote(note.noteId)}
                disabled={isLoading}
                className="delete-note"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}