import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import "./AnimeNotes.css";

const API_URL = "https://ubfbnk5tb4.execute-api.us-east-1.amazonaws.com/prod";

const AnimeNotes = ({ animeId, animeTitle }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const sessionUser = useSelector((state) => state.session.user);
  const userId = sessionUser?.id.toString();

  // Fetch notes
  const fetchNotes = useCallback(async () => {
    if (!userId || !animeId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/notes?userId=${userId}&animeId=${animeId}`,
        {
          headers: {
            Origin: window.location.origin,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError("Failed to load notes. Please try again later.");
      console.error("Error fetching notes:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, animeId]);

  // Create note
  const createNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !userId || !animeId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify({
          userId,
          animeId,
          content: newNote.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      const data = await response.json();
      setNotes((prev) => [data.data, ...prev]);
      setNewNote("");
    } catch (err) {
      setError("Failed to create note. Please try again.");
      console.error("Error creating note:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update note
  const updateNote = async (noteId) => {
    if (!editContent.trim() || !userId || !animeId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify({
          userId,
          animeId,
          noteId,
          content: editContent.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      const data = await response.json();
      setNotes((prev) =>
        prev.map((note) => (note.noteId === noteId ? data.data : note))
      );
      setEditingNote(null);
      setEditContent("");
    } catch (err) {
      setError("Failed to update note. Please try again.");
      console.error("Error updating note:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete note
  const deleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/notes?userId=${userId}&animeId=${animeId}&noteId=${noteId}`,
        {
          method: "DELETE",
          headers: {
            Origin: window.location.origin,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      setNotes((prev) => prev.filter((note) => note.noteId !== noteId));
    } catch (err) {
      setError("Failed to delete note. Please try again.");
      console.error("Error deleting note:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing a note
  const startEdit = (note) => {
    setEditingNote(note.noteId);
    setEditContent(note.content);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingNote(null);
    setEditContent("");
  };

  // Load notes on component mount and when userId/animeId changes
  useEffect(() => {
    if (isOpen) {
      fetchNotes();
    }
  }, [fetchNotes, isOpen]);

  if (!userId) {
    return <div className="anime-notes">Please log in to add notes.</div>;
  }

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
          <form onSubmit={createNote} className="note-form">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write a new note..."
              disabled={isLoading}
              required
            />
            <button type="submit" disabled={isLoading || !newNote.trim()}>
              Add Note
            </button>
          </form>
        </div>

        <div className="notes-list-container">
          {isLoading && <div className="loading">Loading...</div>}

          {!isLoading && notes.length === 0 && (
            <div className="no-notes">No notes yet</div>
          )}

          <div className="notes-list">
            {notes.map((note) => (
              <div key={note.noteId} className="note-item">
                {editingNote === note.noteId ? (
                  <div className="edit-form">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      disabled={isLoading}
                    />
                    <div className="edit-buttons">
                      <button
                        onClick={() => updateNote(note.noteId)}
                        disabled={isLoading || !editContent.trim()}
                      >
                        Save
                      </button>
                      <button onClick={cancelEdit} disabled={isLoading}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p>{note.content}</p>
                    <div className="note-meta">
                      <span>
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                      {note.updatedAt !== note.createdAt && (
                        <span>
                          Updated:{" "}
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                      <div className="note-actions">
                        <button
                          onClick={() => startEdit(note)}
                          disabled={isLoading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteNote(note.noteId)}
                          disabled={isLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeNotes;
