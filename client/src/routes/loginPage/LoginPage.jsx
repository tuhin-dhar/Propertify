import { Link, useNavigate } from "react-router-dom";
import "./loginPage.scss";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function LoginPage() {
  const { updateUser } = useContext(AuthContext);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function submitHandler(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");

    console.log(username, password);

    try {
      const response = await axios.post(
        "http://localhost:1200/api/auth/login",
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      updateUser(response.data);
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="loginPage">
      <div className="loginContainer">
        <form onSubmit={submitHandler} className="wrapper">
          <h1>Log into your Acount</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={isLoading}>Login</button>
          {error && <span>{error}</span>}
          <Link to={"/register"}>
            <div className="already">Don't have an account?</div>
          </Link>
        </form>
      </div>
      <div className="imageContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}
