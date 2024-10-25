import { useContext } from "react";
import Searchbar from "../../components/searchbar/Searchbar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";
import Footer from "../../components/footer/Footer";

export default function HomePage() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="homepage">
      <div className="textcontainer">
        <div className="wrapper">
          <h1 className="title">
            "Discover Your Dream Space: Your Key to Effortless Property
            Solutions with Propertify!"
          </h1>
          <p className="description">
            Propertify: Your gateway to seamless property solutions. Explore
            listings, sell or rent your property effortlessly, and invest
            wisely. With intuitive tools and expert guidance, finding your dream
            space has never been easier. Join Propertify today and unlock a
            world of real estate opportunities tailored just for you.
          </p>
          <Searchbar />
          <div className="boxes">
            <div className="box">
              <h1>16+</h1>
              <h2>Years of Exprience</h2>
            </div>
            <div className="box">
              <h1>200</h1>
              <h2>Awards Gained</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>Properties</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgcontainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}
