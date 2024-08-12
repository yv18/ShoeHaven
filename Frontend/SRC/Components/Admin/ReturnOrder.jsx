import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav.jsx';

const ReturnOrderPage = () => {
  const [returnOrders, setReturnOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReturnOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/return-orders');
        setReturnOrders(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch return orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchReturnOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/return-order/${id}/status`, { status });
      setReturnOrders(returnOrders.map(order => 
        order._id === id ? { ...order, status: response.data.returnOrder.status } : order
      ));
    } catch (err) {
      setError(err.message || 'Failed to update return order status.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <AdminNav />
    <div className="container mt-5">
      <h2 className="text-center mb-4">Return Order Management</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User Email</th>
              <th>Product Name</th>
              <th>Return Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {returnOrders.length > 0 ? (
              returnOrders.map(order => (
                <tr key={order._id}>
                  <td>{order.orderId}</td>
                  <td>{order.userEmail}</td>
                  <td>{order.productName}</td>
                  <td>{order.returnReason}</td>
                  <td>{order.status || "Pending"}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm mr-2"
                      onClick={() => handleStatusChange(order._id, 'Approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleStatusChange(order._id, 'Rejected')}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No return orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default ReturnOrderPage;
