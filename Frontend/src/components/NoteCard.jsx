import "./NoteCard.css";

export default function NoteCard({ title, content, onEdit, onDelete }) {
  return (
    <div className="note-card">
      <h3>{title}</h3>
      <p>{content}</p>
      <div className="actions">
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}
