import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import "./Home.css";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ note_title: "", note_content: "" });
  const [editId, setEditId] = useState(null);

  const API_URL = "http://127.0.0.1:8000/api/notes";

  // Fetch notes from backend
  const fetchNotes = () => {
    axios.get(API_URL)
      .then(res => setNotes(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Add or Update note
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      // Update note
      axios.put(`${API_URL}/${editId}`, form)
        .then(() => {
          setForm({ note_title: "", note_content: "" });
          setEditId(null);
          fetchNotes();
        })
        .catch(err => console.error(err));
    } else {
      // Create note
      axios.post(API_URL, form)
        .then(() => {
          setForm({ note_title: "", note_content: "" });
          fetchNotes();
        })
        .catch(err => console.error(err));
    }
  };

  // Edit button click
  const handleEdit = (note) => {
    setForm({ note_title: note.note_title, note_content: note.note_content });
    setEditId(note.note_id);
  };

  // Delete note
  const handleDelete = (id) => {
    if (window.confirm("Delete this note?")) {
      axios.delete(`${API_URL}/${id}`)
        .then(() => fetchNotes())
        .catch(err => console.error(err));
    }
  };

  return (
    <div>
      <Navbar onLogout={() => alert("Logged out")} />

      {/* Add/Edit Note Form */}
      <div className="form-container">
        <h3>{editId ? "Edit Note" : "Add Note"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={form.note_title}
            onChange={(e) => setForm({ ...form, note_title: e.target.value })}
            required
          />
          <textarea
            placeholder="Content"
            value={form.note_content}
            onChange={(e) => setForm({ ...form, note_content: e.target.value })}
            required
          ></textarea>
          <button type="submit">{editId ? "Update" : "Add"} Note</button>
        </form>
      </div>

   
      <div className="notes-container">
        {notes.map(note => (
          <NoteCard
            key={note.note_id}
            title={note.note_title}
            content={note.note_content}
            onEdit={() => handleEdit(note)}
            onDelete={() => handleDelete(note.note_id)}
          />
        ))}
      </div>
    </div>
  );
}
