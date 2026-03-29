export default function CompanyRegister({ setMode }) {
  return (
    <div>
      <h2>Register Company</h2>

      <input placeholder="Company Name" />
      <input placeholder="Domain (e.g. @company.com)" />

      <button>Register</button>

      <p onClick={() => setMode("login")}>Back to Login</p>
    </div>
  );
}