import { useState } from "react";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import CompanyRegister from "./auth/CompanyRegister";

import Sidebar from "./app/Sidebar";
import Topbar from "./app/Topbar";

import EmployeeDashboard from "./roles/EmployeeDashboard";
import ManagerDashboard from "./roles/ManagerDashboard";
import AdminDashboard from "./roles/AdminDashboard";
import FinanceDashboard from "./roles/FinanceDashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");

  const handleLogin = (email) => {
    let role = "employee";

    if (email.includes("manager")) role = "manager";
    else if (email.includes("admin")) role = "admin";
    else if (email.includes("finance")) role = "finance";

    setUser({ email, role });
  };

  if (!user) {
    if (mode === "login") return <Login onLogin={handleLogin} setMode={setMode} />;
    if (mode === "signup") return <Signup setMode={setMode} />;
    if (mode === "company") return <CompanyRegister setMode={setMode} />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case "employee": return <EmployeeDashboard />;
      case "manager": return <ManagerDashboard />;
      case "admin": return <AdminDashboard />;
      case "finance": return <FinanceDashboard />;
      default: return <div>Invalid Role</div>;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar role={user.role} />
      <div style={{ flex: 1 }}>
        <Topbar user={user} setUser={setUser} />
        {renderDashboard()}
      </div>
    </div>
  );
}