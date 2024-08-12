import React, { useState, useEffect } from "react";
import axios from 'axios';
import NavigationBar from "./Navbar.jsx";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState(localStorage.getItem('user-email') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/order?userEmail=${email}`);
        setOrders(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchOrders();
    }
  }, [email]);

  const handleRequestReturn = async (id) => {
    try {
      const order = orders.find(order => order._id === id);
      const returnRequested = !order.returnRequested;
      await axios.put(`http://localhost:8000/api/order/${id}/return`, {
        returnRequested,
        returnReason: order.returnReason,
      });
      
      setOrders(orders.map(order =>
        order._id === id ? { ...order, returnRequested, status: 'Pending' } : order
      ));
    } catch (err) {
      setError(err.message || 'Failed to update return request.');
    }
  };

  const handleReasonChange = async (id, reason) => {
    try {
      await axios.put(`http://localhost:8000/api/order/${id}/return`, {
        returnRequested: true,
        returnReason: reason,
      });
      
      setOrders(orders.map(order =>
        order._id === id ? { ...order, returnReason: reason } : order
      ));
    } catch (err) {
      setError(err.message || 'Failed to update return reason.');
    }
  };

  if (!email) {
    return (
      <div className="container mt-5">
        <h2 className="text-center mb-4">Order Page</h2>
        <div className="alert alert-warning text-center" role="alert">
          Please login to view your orders.
        </div>
      </div>
    );
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
    <NavigationBar/>
    <div className="container mt-5">
      <h2 className="text-center mb-4">Order Page</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Product Price</th>
              <th>Status</th>
              <th>Request for Return</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(order => (
                <React.Fragment key={order._id}>
                  <tr>
                    <td>{order.items.map(item => `${item.productName}, Quantity: ${item.quantity}`).join(', ')}</td>
                    <td>${order.items.map(item => item.price * item.quantity).join(`, $`)}</td>
                    <td>{order.returnRequested ? "Pending" : "Order Placed"}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleRequestReturn(order._id)}
                      >
                        {order.returnRequested ? "Req for Return" : "Request Return"}
                      </button>
                    </td>
                  </tr>
                  {order.returnRequested && (
                    <tr>
                      <td colSpan="5">
                        <form>
                          <div className="form-group">
                            <label htmlFor={`reason-${order._id}`}>Reason for Return:</label>
                            <input
                              type="text"
                              className="form-control"
                              id={`reason-${order._id}`}
                              value={order.returnReason || ''}
                              onChange={(e) => handleReasonChange(order._id, e.target.value)}
                            />
                          </div>
                        </form>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default OrderPage;
