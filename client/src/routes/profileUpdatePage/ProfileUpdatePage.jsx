import { useContext } from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

export default function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);

  console.log(currentUser);

  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function updateAvatar(data) {
    setAvatar(data);
  }

  async function handleSubmit(e) {
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await axios.put(
        `http://localhost:1200/api/users/${currentUser.id}`,
        {
          username,
          email,
          password,
          avatar: avatar[0],
        },
        {
          withCredentials: true,
        }
      );

      updateUser(response.data);
      navigate("/profile");
    } catch (err) {
      setError(err);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="profileUpdatePage">
      <div className="textContainer">
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <h1>Update Profile</h1>
            <div className="input">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                defaultValue={currentUser.username}
              />
            </div>
            <div className="input">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="text"
                defaultValue={currentUser.email}
              />
            </div>
            <div className="input">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" />
            </div>
            <button disabled={isLoading}>Update</button>
            {error && <span>Error</span>}
          </form>
        </div>
      </div>
      <div className="imageContainer">
        <img
          src={avatar[0] || currentUser.avatar || "/noavatar.jpeg"}
          alt=""
          className="avatar"
        />
        <UploadWidget
          uwConfig={{
            cloudName: "dweec1hv0",
            uploadPreset: "Propertify",
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "avatars",
          }}
          setState={updateAvatar}
        />
      </div>
    </div>
  );
}
