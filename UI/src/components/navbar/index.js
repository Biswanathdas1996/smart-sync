import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import smartSyncLogo from "../../assets/images/logo_smartsync.png";

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/scenario-name");
  };

  const handleLogoClick = () => {
    navigate("/");
  };
  const location = useLocation();

  return (
    <header className="d-flex align-items-center cmn-nav-hldr">
      <div className="logo" onClick={handleLogoClick}>
        <img src={smartSyncLogo} alt="" />
      </div>
      <nav className="navbar navbar-expand-sm mx-auto">
        <menu className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav cmn-navul">
            <li className="nav-item dropdown">
              <a
                className="nav-link "
                href="#"
                id="navbarDropdown"
                role="button"
                // data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Home
              </a>
              {/* <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
              </ul> */}
            </li>
            {/* <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Solution
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Pricing
              </a>
            </li> */}
            <li className="nav-item">
              <a className="nav-link" href="#">
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Contact Us
              </a>
            </li>
          </ul>
        </menu>
      </nav>
      <div className="hm-ulogin-btn">
        <button className="cmn-btn" onClick={handleLogin}>
          Get Started
        </button>
      </div>
    </header>
  );
};

export default NavBar;
