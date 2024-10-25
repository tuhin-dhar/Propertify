import "./layout.scss";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "../../components/navbar/Navbar";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Footer from "../../components/footer/Footer";

function Layout() {
  return (
    <div className="layout">
      <div classname="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

function RequireAuth() {
  const { currentUser } = useContext(AuthContext);

  return !currentUser ? (
    <Navigate to={"/login"} />
  ) : (
    <div className="layout">
      <div classname="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export { Layout, RequireAuth };
