import "./Navbar.css";

export default function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      <h2 className="logo">Notes App</h2>
      <button className="logout-btn" onClick={onLogout}>Logout</button>
    </nav>
  );
}
