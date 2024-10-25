import { useState } from "react";
import "./newPostPage.scss";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

export default function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function updateData(data) {
    setImages(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const inputs = Object.fromEntries(formData);

    console.log(inputs);

    try {
      const response = await axios.post(
        "http://localhost:1200/api/posts/",
        {
          postData: {
            title: inputs.title,
            price: parseInt(inputs.price),
            address: inputs.address,
            city: inputs.city,
            bedroom: parseInt(inputs.bedroom),
            bathroom: parseInt(inputs.bathroom),
            lattitude: inputs.lattitude,
            longitude: inputs.longitude,
            type: inputs.type,
            property: inputs.property,
            images: images,
          },
          postDetail: {
            description: value,
            utilities: inputs.utilities,
            pet: inputs.petPolicy,
            income: inputs.incomePolicy,
            size: parseInt(inputs.totalSize),
            school: parseInt(inputs.school),
            bus: parseInt(inputs.bus),
            restaurant: parseInt(inputs.restaurant),
          },
        },
        {
          withCredentials: true,
        }
      );

      navigate(`/${response.data.id}`);
    } catch (err) {
      console.log(err);
      setError(err);
    }
  }

  return (
    <div>
      <h1>Add New Post</h1>
      <div className="newPostPage">
        <div className="textContainer">
          <div className="wrapper">
            <div className="formWrapper">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="title">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" />
                  </div>
                  <div className="price">
                    <label htmlFor="price">Price</label>
                    <input type="text" name="price" id="price" />
                  </div>
                  <div className="address">
                    <label htmlFor="address">Address</label>
                    <input type="text" name="address" id="address" />
                  </div>
                </div>
                <div className="row">
                  <div className="description">
                    <div className="quill">
                      <label htmlFor="Description">Description</label>
                      <ReactQuill
                        theme="snow"
                        onChange={setValue}
                        value={value}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="city">
                    <label htmlFor="city">City</label>
                    <input type="text" name="city" id="city" />
                  </div>
                  <div className="bedroom">
                    <label htmlFor="bedroom">Bedroom</label>
                    <input type="text" name="bedroom" id="bedroom" />
                  </div>
                  <div className="bathroom">
                    <label htmlFor="bathroom">Bathroom</label>
                    <input type="text" name="bathroom" id="bathroom" />
                  </div>
                </div>
                <div className="row">
                  <div className="lattitude">
                    <label htmlFor="lattitude">Lattitude</label>
                    <input type="text" name="lattitude" id="lattitude" />
                  </div>
                  <div className="longitude">
                    <label htmlFor="longitude">Longitude</label>
                    <input type="text" name="longitude" id="longitude" />
                  </div>
                  <div className="type">
                    <label htmlFor="type">Type</label>
                    <select name="type" id="type">
                      <option value="buy">Buy</option>
                      <option value="rent">Rent</option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="property">
                    <label htmlFor="property">Property</label>
                    <select name="property" id="property">
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="condo">Condo</option>
                      <option value="land">Land</option>
                    </select>
                  </div>
                  <div className="utilities">
                    <label htmlFor="utilities">Utilities</label>
                    <select name="utilities" id="utilities">
                      <option value="ownerIsResponsible">
                        Owner is responsible
                      </option>
                      <option value="Owner is not responsible"></option>
                    </select>
                  </div>
                  <div className="petPolicy">
                    <label htmlFor="petPolicy">Pet Policy</label>
                    <select name="petPolicy" id="petPolicy">
                      <option value="allowed">Allowed</option>
                      <option value="notAllowed">Not Allowed</option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="incomePolicy">
                    <label htmlFor="incomePolicy">Income Policy</label>
                    <select name="incomePolicy" id="incomePolicy">
                      <option value="option1">Option1</option>
                    </select>
                  </div>
                  <div className="totalSize">
                    <label htmlFor="totalSize">Total Size (sqft)</label>
                    <input type="text" name="totalSize" id="totalSize" />
                  </div>
                  <div className="school">
                    <label htmlFor="school">School</label>
                    <input type="text" name="school" id="school" />
                  </div>
                </div>
                <div className="row">
                  <div className="bus">
                    <label htmlFor="bus">Bus</label>
                    <input type="text" name="bus" id="bus" />
                  </div>
                  <div className="restaurant">
                    <label htmlFor="restaurant">Restaurant</label>
                    <input type="text" name="restaurant" id="restaurant" />
                  </div>
                  <div className="school">
                    <button className="create">Create</button>
                  </div>
                </div>
              </form>
            </div>
            {error && <span>error</span>}
          </div>
        </div>
        <div className="imageContainer">
          <div className="images">
            {images.map((image, index) => (
              <img src={image} key={index} />
            ))}
          </div>
          <div className="upload">
            {" "}
            <UploadWidget
              uwConfig={{
                multiple: true,
                cloudName: "dweec1hv0",
                uploadPreset: "Propertify",
                folder: "posts",
              }}
              setState={updateData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
