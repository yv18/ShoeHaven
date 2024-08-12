import React, { useState, useEffect } from "react";
import ManageOrder from "./Admin/ManageOrder.jsx";
import AdminNav from "./Admin/AdminNav.jsx";

function Admin() {
  const [totalRevenue, setTotalRevenue] = useState("");
  const [totalOrders, setTotalOrders] = useState("");
  const [totalReturns, setTotalReturns] = useState("");
  const [totalUsers, setTotalUsers] = useState("");

  useEffect(() => {
    // Fetch Total Revenue
    fetch("https://shoehaven-backend.onrender.com/api/total-revenue")
      .then((res) => res.json())
      .then((data) => setTotalRevenue(`$${data.totalRevenue}`))
      .catch((err) => console.error("Error fetching total revenue:", err));

    // Fetch Total Orders
    fetch("https://shoehaven-backend.onrender.com/api/total-orders")
      .then((res) => res.json())
      .then((data) => setTotalOrders(data.totalOrders))
      .catch((err) => console.error("Error fetching total orders:", err));

    // Fetch Total Returns
    fetch("https://shoehaven-backend.onrender.com/api/total-returns")
      .then((res) => res.json())
      .then((data) => setTotalReturns(data.totalReturns))
      .catch((err) => console.error("Error fetching total returns:", err));

    // Fetch Total Users
    fetch("https://shoehaven-backend.onrender.com/api/total-users")
      .then((res) => res.json())
      .then((data) => setTotalUsers(data.totalUsers))
      .catch((err) => console.error("Error fetching total users:", err));
  }, []);

  return (
    <>
      <AdminNav />
      <div className="container" style={{ marginTop: '10%' }}>
        <div className="row">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h2 className="card-title">Total Revenue</h2>
                <p className="card-text">{totalRevenue}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h2 className="card-title">Total Orders</h2>
                <p className="card-text">{totalOrders}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h2 className="card-title">Total Return</h2>
                <p className="card-text">{totalReturns}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h2 className="card-title">Total User</h2>
                <p className="card-text">{totalUsers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ManageOrder />
    </>
  );
}

export default Admin;
