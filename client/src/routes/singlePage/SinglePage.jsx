import { useLoaderData, useNavigate } from "react-router-dom";
import Map from "../../components/map/Map";
import Slider from "../../components/slider/Slider";
import "./singlepage.scss";
import DOMPurify from "dompurify";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function SinglePage() {
  const post = useLoaderData();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [saved, setSaved] = useState(post.isSaved);

  const { currentUser, updateUser } = useContext(AuthContext);

  async function handleSave() {
    setIsLoading(true);
    setSaved((prev) => !prev);
    if (!currentUser) {
      navigate("/login");
    }

    try {
      const response = await axios.post(
        "http://localhost:1200/api/users/save",
        {
          postId: post.id,
        },
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      setIsLoading(true);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }
  console.log(post.user.id);

  async function handleSend() {
    try {
      const response = await axios.post(
        "http://localhost:1200/api/chat/create",
        {
          recieverId: post.user.id,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response);
    } catch (err) {
      console.log(err);
    } finally {
      navigate("/profile");
    }
  }
  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">${post.price}</div>
              </div>
              <div className="user">
                <img src={post.user.avatar || "/noavatar.jpeg"} alt="" />
                <span>{post.user.username}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.description),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {post.postDetail.utilities == "ownerIsResponsible" ? (
                  <p>Owner is responsible</p>
                ) : (
                  <p>Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {post.postDetail.pet == "allowed" ? (
                  <p>Pets allowed</p>
                ) : (
                  <p>Pets not allowed</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Property Fees</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="listHorizontal">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size}sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} bedroom</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>

          <div className="sizes"></div>
          <p className="title">Nearby PLaces</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {post.postDetail.school > 999
                    ? post.postDetail.school / 1000
                    : post.postDetail.school}
                  m away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>
                  {post.postDetail.bus > 999
                    ? post.postDetail.bus / 1000
                    : post.postDetail.bus}
                  m away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>
                  {post.postDetail.restaurant > 999
                    ? post.postDetail.restaurant / 1000
                    : post.postDetail.restaurant}
                  m away
                </p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            <button onClick={handleSend}>
              <img src="/chat.png" alt="" />
              Send a message
            </button>
            <button
              disabled={isLoading}
              style={{ backgroundColor: saved ? "#e1b382" : "white" }}
              onClick={handleSave}
            >
              <img src="/save.png" alt="" />
              {saved ? "Property saved" : "Save the property"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
