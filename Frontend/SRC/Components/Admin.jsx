import React from 'react'
import NavigationBar from "./Navbar.jsx";


function Admin() {
      const TotalRevenue = `$${45000}`;
      const TotalOrders = `999`;
      const TotalReturn = `01`;
      const TotalUser = `99999`;

    return (
      <>
        <NavigationBar />
        <div className='Admin-Container'>
            <div className="top4">
                <div className="top1">
                  <h2>Total Revenue {TotalRevenue}</h2>
                </div>
                <div className="top1">
                  <h2>Total Orders {TotalOrders}</h2>
                </div>
                <div className="top1">
                  <h2>Total Return {TotalReturn} </h2>
                </div>
                <div className="top1">
                  <h2>Total User {TotalUser}</h2>
                </div>
            </div>
        </div>
      </>
    );
  }
  export default Admin;
  