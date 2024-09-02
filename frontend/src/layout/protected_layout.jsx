import { useContext, useEffect } from "react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth_context";
import "./styles/protected_layout.css";

const ProtectedLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, handleAuthenticate } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  const logOut = () => {
    localStorage.removeItem("token");
    handleAuthenticate();
    navigate("/auth/login");
  };

  return (
    <div className="h-screen ">
      <div className="flex justify-between px-4 py-3 bg-gray-200">
        <div className="flex gap-2 items-center">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "text-red-500" : "text-yellow-500"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/branches"
            className={({ isActive }) =>
              isActive ? "text-red-500" : "text-yellow-500"
            }
          >
            Branch List
          </NavLink>
          <NavLink
            to="/todos"
            className={({ isActive }) =>
              isActive ? "text-red-500" : "text-yellow-500"
            }
          >
            Todos
          </NavLink>
        </div>
        <button onClick={logOut} className="logout-button">
          Log out
        </button>
      </div>
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;

