import React from "react";
import { Link } from "react-router-dom";

function NavigationBar() {
  return (
    <>
      <nav>
        <div>
          <ul className="YV" style={{ listStyleType: "none"}}>
            <li><Link to="/" style={{color:"white"}}>Home</Link></li>
            <li><Link to="/AddNewEmployee"  style={{color:"white"}}>Add New Employee</Link></li>
            <li><Link to="/filter"  style={{color:"white"}}>Filter & Update</Link></li>
          </ul>   
        </div>
      </nav>
    </>
  );
}

// this one is for Navigation bar for user to redirect them from one page to another
export default NavigationBar;
