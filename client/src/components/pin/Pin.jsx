import { Link } from "react-router-dom";
import { Marker, Popup } from "react-leaflet";
import "./pin.scss";

export default function Pin({ item }) {
  return (
    <Marker position={[item.lattitude, item.longitude]}>
      <Popup>
        <div className="popupContainer">
          <div className="imageContainer">
            <img src={item.img} alt="" />
          </div>
          <div className="textContainer">
            <Link to={`${item.id}`}>{item.title}</Link>
            <span className="bed">{item.bedroom} Bedroom</span>
            <b>$ {item.price}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
