import { Link, useNavigate } from "react-router-dom";
import "./registerPage.scss";
import axios from "axios";
import { useState } from "react";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsloading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    setIsloading(true);
    e.preventDefault();
    setError("");

    const formData = new FormData(e.target); //Allows us to use the data/inputs from the form

    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const response = await axios.post(
        "http://localhost:1200/api/auth/register",
        {
          email: email,
          username: username,
          password: password,
        }
      );

      navigate("/login");
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsloading(false);
    }
  }

  return (
    <div className="registerPage">
      <div className="loginContainer">
        <form className="wrapper" onSubmit={handleSubmit}>
          <h1>Create An Account</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="email" type="text" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={isLoading}>Register</button>
          {error && <span>{error}</span>}
          <Link to={"/login"}>
            <div className="already">Do you have an account?</div>
          </Link>
        </form>
      </div>
      <div className="imageContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}
