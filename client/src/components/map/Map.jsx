import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import Pin from "../pin/Pin";

export default function Map({ items }) {
  console.log(items);
  return (
    <MapContainer
      center={
        items[0] == undefined || items.length != 1
          ? [28.6448, 77.216721]
          : [items[0].lattitude, items[0].longitude]
      }
      zoom={7}
      scrollWheelZoom={false}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((item) => (
        <Pin item={item} key={item.id} />
      ))}
    </MapContainer>
  );
}
