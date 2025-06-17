import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";


function Navigation() {
  const user = useSelector(state => state.session.user);
  return (
    <nav className="plant-navbar">
      <link rel="icon" src="favicon.ico" type="image/x-icon"></link>
      <div className="nav-left">
        <img
          className="logo-img"
          src="https://www.shareicon.net/data/512x512/2016/11/15/852734_plant_512x512.png"
          alt="plant logo"
          width="60"
          height="60"
        />
        <span className="brand">Wet My Plants</span>
      </div>

      <div className="nav-middle">
        <ul className="nav-links">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/plants">Plants</NavLink></li>
          {user && (
                        <>
                            <li><NavLink to="/rooms">Rooms</NavLink></li>
                        </>
                    )}
          <li>
            <ProfileButton />
          </li>
        </ul>
      </div>
      <ul>

      </ul>
    </nav>
  );
}

export default Navigation;
