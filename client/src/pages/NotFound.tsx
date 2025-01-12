import { PrimaryBtn } from "../components";
import "../styles/notfound.style.css";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notfound-container">
      <div>
        <h1>Guess you are lost !</h1>
      </div>
      <div>Page not found</div>
      <Link to="/">
        <div className="notfound-btn">
          <PrimaryBtn content="Return to home" />
        </div>
      </Link>
    </div>
  );
}
