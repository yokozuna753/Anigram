import { useState, useEffect } from "react";
import "./AnimeNotes.css";

export default function AnimeNotes({ userId, animeId, animeTitle }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isDeletingNote, setIsDeletingNote] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const API_URL =
    "https://durz7obem4.execute-api.us-east-1.amazonaws.com/prod/notes";

  useEffect(() => {
    if (!userId || !animeId) {
      setError("Missing required userId or animeId");
      return;
    }
    if (isOpen) {
      fetchNotes();
    }
  }, [userId, animeId, isOpen]);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}?userId=${userId}&animeId=${animeId}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError(err.message || "Failed to fetch notes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) {
      setError("Note content cannot be empty");
      return;
    }

    try {
      setIsAddingNote(true);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          animeId,
          content: newNote.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add note");
      }

      const addedNote = await response.json();
      setNotes((prevNotes) => [addedNote, ...prevNotes]);
      setNewNote("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAddingNote(false);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      setIsDeletingNote(true);
      const response = await fetch(
        `${API_URL}?userId=${userId}&noteId=${noteId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete note");

      setNotes((prevNotes) =>
        prevNotes.filter((note) => note.noteId !== noteId)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeletingNote(false);
    }
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="notes-toggle-button">
        Notes
      </button>
    );
  }

  return (
    <div className="anime-notes">
      <div className="notes-header">
        <h3>Notes for {animeTitle}</h3>
        <button onClick={() => setIsOpen(false)} className="close-notes-button">
          ×
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="notes-content">
        <div className="note-form-container">
          <form onSubmit={addNote} className="note-form">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              required
            />
            <button type="submit" disabled={isAddingNote}>
              {isAddingNote ? "Adding..." : "Add Note"}
            </button>
          </form>
        </div>

        <div className="notes-list-container">
          {isLoading ? (
            <div className="loading">Loading notes...</div>
          ) : notes.length === 0 ? (
            <div className="no-notes">No notes yet</div>
          ) : (
            <div className="notes-list">
              {notes.map((note) => (
                <div key={note.noteId} className="note-item">
                  <p>{note.content}</p>
                  <div className="note-meta">
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => deleteNote(note.noteId)}
                      disabled={isDeletingNote}
                      className="delete-note"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
