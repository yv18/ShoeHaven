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
    <form onSubmit={handleSubmit} className="p-3 border rounded">
      <div className="form-group">
        <label htmlFor="productName">Product Name</label>
        <input
          type="text"
          id="productName"
          className="form-control"
          value={productName}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Name"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="productPrice">Product Price</label>
        <input
          type="number"
          id="productPrice"
          className="form-control"
          value={productPrice}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter Price"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input
          type="text"
          id="category"
          className="form-control"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter Category"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="image">Product Image</label>
        <input
          type="file"
          id="image"
          className="form-control-file"
          onChange={(e) => setImage(e.target.files[0])}
          required
          style={{marginBottom:'10px'}}
        />
      </div>
      <div className="form-group">
        <button type="submit" className="btn btn-primary mr-2">Update</button>
        <button type="button" className="btn btn-danger" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default UpdateItem;
