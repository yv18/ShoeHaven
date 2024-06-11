import React, { useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/logo.png";
import nav_dropdown from "../Assets/drop_nav.jpeg";
import cart_icon from "../Assets/cart.jpeg";

function NavigationBar() {
  const menuRef = useRef();
  const dropdownBtn = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    window.location.replace("/");
  };

  return (
    <div className="nav">
      <Link to="/" style={{ textDecoration: "none" }} className="nav-logo">
        <img src={logo} alt="logo" />
        <p>ShoeHaven</p>
      </Link>
      <img onClick={dropdownBtn} className="nav-dropdown" src={nav_dropdown} alt="dropdown" />
      <ul ref={menuRef} className="nav-menu">
        <li><Link to="/" style={{ textDecoration: "none", color:"black" }}>All</Link></li>
        <li><Link to="/Men" style={{ textDecoration: "none", color:"black" }}>Men</Link></li>
        <li><Link to="/Female" style={{ textDecoration: "none", color:"black" }}>Women</Link></li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem('auth-token')
          ? <button onClick={handleLogout}>Logout</button>
          : <Link to="/login" style={{ textDecoration: "none" }}><button>Login</button></Link>}
        <Link to="/cart"><img src={cart_icon} alt="cart" /></Link>
        <div className="nav-cart-count">0</div>
      </div>
    </div>
  );
}


export default NavigationBar;
