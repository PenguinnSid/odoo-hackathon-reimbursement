export default function Sidebar({ role }) {
  const nav = {
    employee: ["Dashboard", "My Claims"],
    manager: ["Dashboard", "Approvals"],
    admin: ["Dashboard", "All Claims"],
    finance: ["Dashboard", "Payments"]
  };

  return (
    <div style={{ width: "200px", background: "#eee" }}>
      <h3>{role}</h3>
      {nav[role].map((item, i) => (
        <p key={i}>{item}</p>
      ))}
    </div>
  );
}