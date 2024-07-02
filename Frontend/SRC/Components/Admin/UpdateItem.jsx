import React, { useState } from 'react';
import axios from 'axios';

const UpdateItem = ({ item, onUpdate, onCancel }) => {
    const [productName, setName] = useState('');
    const [productPrice, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('productPrice', productPrice);
    formData.append('category', category);

    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.put(`http://localhost:8000/api/items/${item._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
                type="text"
                value={productName}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
                required
              />
              <input
                type="number"
                value={productPrice}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter Price"
                required
              />
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter Category"
                required
              />
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
      <div>
      <button type="submit">Update</button>
      <button type="button" style={{background:'red'}} onClick={handleCancel}>Cancel</button>
      </div>
      
    </form>
  );
};

export default UpdateItem;
