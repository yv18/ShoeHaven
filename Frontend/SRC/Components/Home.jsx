import React from "react";
import NavigationBar from "./Navbar.jsx";
import HomeTabel from "./HomeTable.jsx";

function Home() {
  return (
    <>
      <NavigationBar />
      <div className="HO">
        <h1>Welcome To the Home Page</h1>
        <h3>Employee Management System</h3>
        <h5>Presenting By Me, Yashraj Raj</h5>
        <HomeTabel />
      </div>
    </>
  );
}
// So this the home page that have created and in this I also added  a navigation bar and Hometable component
export default Home;
