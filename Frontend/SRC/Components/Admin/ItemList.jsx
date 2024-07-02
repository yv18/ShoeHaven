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
    <div className='ItemList'>
      <table className='table-list'>
        <thead>
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
            <tr className='table-row' key={item._id}>
              <td className='first-column'>{item.productName}</td>
              <td>{item.category}</td>
              <td>
                {item.image && (
                  <img
                    src={`data:${item.imageType};base64,${Buffer.from(item.image.data).toString('base64')}`}
                    className="item-img"
                    alt="item"
                  />
                )}
              </td>
              <td>{item.quantity || 100}</td>
              <td>{item.productPrice ? `$${item.productPrice}` : '$148.99'}</td>
              <td className='last-column'>
                <button onClick={() => toggleEditing(item)}>Update</button>
                <button style={{ background: 'red' }} onClick={() => handleDelete(item._id)}>Delete</button>
                {editingItem && editingItem._id === item._id && (
                  <UpdateItem item={item} onUpdate={handleUpdate} onCancel={handleCancel} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemList;
