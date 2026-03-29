import { useState } from "react";

export default function Login({ onLogin, setMode }) {
  const [email, setEmail] = useState("");

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={() => onLogin(email)}>Login</button>

      <p onClick={() => setMode("signup")}>Go to Signup</p>
      <p onClick={() => setMode("company")}>Register Company</p>
    </div>
  );
}