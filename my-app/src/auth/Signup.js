export default function Signup({ setMode }) {
  return (
    <div>
      <h2>Signup</h2>

      <input placeholder="Email" />
      <input placeholder="Password" type="password" />

      <button>Create Account</button>

      <p onClick={() => setMode("login")}>Back to Login</p>
    </div>
  );
}