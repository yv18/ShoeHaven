import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import UpdateItem from './UpdateItem.jsx';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleUpdate = () => {
    fetchItems(); 
    setEditingItem(null); 
  };

  const handleCancel = () => {
    setEditingItem(null); 
  };

  const toggleEditing = (item) => {
    setEditingItem(item); 
  };

  return (
    <>
    <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Image</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.productName}</td>
              <td>{item.category}</td>
              <td>
                {item.image && (
                  <img
                    src={`data:${item.imageType};base64,${Buffer.from(item.image.data).toString('base64')}`}
                    className="img-thumbnail"
                    alt="item"
                    style={{ width: '50px', height: '50px' }}
                  />
                )}
              </td>
              <td>{item.quantity || 100}</td>
              <td>{item.productPrice ? `$${item.productPrice}` : '$148.99'}</td>
              <td>
                <button className="btn btn-primary btn-sm mr-2" style={{marginBottom:'10px'}} onClick={() => toggleEditing(item)}>Update</button>
                <button className="btn btn-danger btn-sm" style={{marginBottom:'10px'}} onClick={() => handleDelete(item._id)}>Delete</button>
                {editingItem && editingItem._id === item._id && (
                  <div className="mt-3">
                    <UpdateItem item={item} onUpdate={handleUpdate} onCancel={handleCancel} />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  </>
  );
};

export default ItemList;
