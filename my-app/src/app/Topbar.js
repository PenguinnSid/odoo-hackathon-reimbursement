export default function Topbar({ user, setUser }) {
  return (
    <div style={{ background: "#ddd", padding: "10px" }}>
      <span>{user.email}</span>
      <button onClick={() => setUser(null)}>Logout</button>
    </div>
  );
}