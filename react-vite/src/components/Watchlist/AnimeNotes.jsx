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

  // Add validation for required props
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
      setError(null); // Clear any previous errors

      console.log("Fetching notes for userId:", userId, "animeId:", animeId);
      const response = await fetch(
        `${API_URL}?userId=${userId}&animeId=${animeId}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const responseData = await response.json();
      console.log("Full response from getNotes:", responseData);

      if (
        !responseData ||
        (!Array.isArray(responseData))
      ) {
        console.error("Invalid response format:", responseData);
        throw new Error("Invalid response format from server");
      }

      // Get notes array from the response
      const notesArray = responseData || [];
      console.log("Notes array:", notesArray);

      if (notesArray.length === 0) {
        console.log("No notes found");
        setNotes([]);
        return;
      }

      // Sort notes by creation date
      const sortedNotes = [...notesArray].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      console.log("Sorted notes:", sortedNotes);

      setNotes(sortedNotes);
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
        console.error("Server error response:", errorData);
        throw new Error(errorData.message || "Failed to add note");
      }

      const responseData = await response.json();
      console.log("Full response from createNote:", responseData);

      // Add the new note to the existing notes array and sort
      setNotes((prevNotes) => {
        const updatedNotes = [...prevNotes, responseData];
        return updatedNotes.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      });
      setNewNote("");
    } catch (err) {
      console.error("Error adding note:", err);
      setError(err.message);
    } finally {
      setIsAddingNote(false);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      setIsDeletingNote(true);
      const response = await fetch(
        `${API_URL}?userId=${userId}&animeId=${animeId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete note");

      setNotes((prevNotes) =>
        prevNotes.filter((note) => note.noteId !== noteId)
      );
    } catch (err) {
      console.error("Error deleting note:", err);
      setError(err.message);
    } finally {
      setIsDeletingNote(false);
    }
  };

  // Render just the toggle button if not open
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

      <div className="notes-list">
        {isLoading ? (
          <div className="loading">Loading notes...</div>
        ) : !Array.isArray(notes) || notes.length === 0 ? (
          <div className="no-notes">No notes yet</div>
        ) : (
          notes.map((note) => (
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
          ))
        )}
      </div>
    </div>
  );
}
