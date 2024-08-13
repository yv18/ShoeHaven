import React, { useState, useEffect } from "react";
import axios from 'axios';

function ManageOrder() {
  const [orders, setOrders] = useState([]);

  // Fetch orders from the server
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://shoehaven-backend.onrender.com/api/orders'); // Adjust the endpoint if needed
        console.log(response.data); // Log the fetched data for debugging
        setOrders(response.data);
      } catch (error) {
        console.error("There was an error fetching the orders!", error);
      }
    };

    fetchOrders();
  }, []);

  // Handle status change and update the server
  const handleStatusChange = async (e, orderId) => {
    const updatedStatus = e.target.value;
    const updatedOrders = orders.map(order => {
      if (order._id === orderId) {
        return { ...order, status: updatedStatus };
      }
      return order;
    });
    setOrders(updatedOrders);
    try {
      await axios.put(`https://shoehaven-backend.onrender.com/api/orders/${orderId}`, { status: updatedStatus });
      alert("Update successfully");
    } catch (error) {
      console.error("There was an error updating the order status!", error);
    }
  };

  return (
    <>
      <div className="container manage-container mt-4">
        <div className="manage-order">
          <h2>Manage Orders</h2>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-light">
                <tr>
                  <th scope="col">Product Name</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col">Status</th>
                  <th scope="col">Price</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(orders) && orders.length > 0 ? (
                  orders.map(order => (
                    <tr key={order._id}>
                      <td>{order.items.map(item => item.productName).join(', ')}</td>
                      <td>{order.name}</td>
                      <td>
                        <select
                          className="form-control"
                          value={order.status}
                          onChange={(e) => handleStatusChange(e, order._id)}
                        >
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td>${order.totalPrice}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleStatusChange({ target: { value: order.status } }, order._id)}
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No orders available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageOrder;
