import { Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="app_container">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/branches">Branches</Link>
      <Link to="/todos">Todos</Link>
      <Link to="/auth/login">Login</Link>
      {/* <Link to="/auth/signup">Sign Up</Link> */}
    </div>
  );
}

export default App;