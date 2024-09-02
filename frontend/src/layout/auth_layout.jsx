import { useContext } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/auth_context";
import './styles/auth_layout.css'; // Import the CSS file

const AuthLayout = () => {
  const { isAuthenticated } = useContext(AuthContext);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <div className="auth-layout">
      <div className="auth-layout-header">
        <Link to="/auth/login">Login</Link>
        {/* <Link to="/auth/signup">Sign Up</Link> */}
      </div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
