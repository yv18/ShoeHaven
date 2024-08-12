import React from 'react';
import { Link } from 'react-router-dom';

function AdminNav() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/admin">
          Dashboard
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/admin">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Product">
                Product Manage
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Return">
                Manage Return
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default AdminNav;
