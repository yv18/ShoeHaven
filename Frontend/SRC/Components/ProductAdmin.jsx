import React, { useState } from "react";
import NavigationBar from "./Navbar.jsx";
import axios from 'axios';
import ItemList from './Admin/ItemList.jsx';


function Product() {
    const [productName, setName] = useState('');
    const [productPrice, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append('productName', productName);
      formData.append('productPrice', productPrice);
      formData.append('category', category);
      formData.append('image', image);
  
      try {
        const response = await axios.post('http://localhost:8000/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setMessage('Upload successful');
        console.log('Upload successful', response.data);
      } catch (err) {
        setMessage('Error uploading');
        console.error('Error uploading', err);
      }
    };

    return (
      <>
        <NavigationBar />
        <div className="Product-Main">
          <div className="Product-Container">
            <form className='ItemList' onSubmit={handleSubmit}>
                <h1 style={{textAlign:'center'}}>Add Product</h1>
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
              <button type="submit">Upload</button>
              {message && <p>{message}</p>}
            </form>
          </div>

          <div className="Product-List">
                <ItemList/>
          </div>
        </div>
      </>
    );
}
export default Product;
