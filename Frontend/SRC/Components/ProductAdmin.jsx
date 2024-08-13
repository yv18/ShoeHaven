import React, { useState } from "react";
import AdminNav from "./Admin/AdminNav.jsx";
import axios from "axios";
import ItemList from "./Admin/ItemList.jsx";

function Product({ items, handleUpdate, handleDelete, handleCancel, toggleEditing, editingItem }) {
  const [productName, setName] = useState("");
  const [productPrice, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [ProductDetails, setProductDetails] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productPrice", productPrice);
    formData.append("category", category);
    formData.append("image", image);
    formData.append("ProductDetails", ProductDetails); // Include ProductDetails

    try {
      const response = await axios.post(
        "https://shoehaven-backend.onrender.com/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Upload successful");
      setMessage("Upload successful");
      console.log("Upload successful", response.data);
      setName("");
      setPrice("");
      setCategory("");
      setImage(null);
      setProductDetails("");
    } catch (err) {
      setMessage("Error uploading");
      console.error("Error uploading", err);
    }
  };

  return (
    <>
      <AdminNav />
      <div className="container my-5">
        <div className="row">
          <div className="col-md-6">
            <form className="card p-4" onSubmit={handleSubmit}>
              <h1 className="text-center">Add Product</h1>
              <div className="form-group">
                <label htmlFor="productName">Name</label>
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
                <label htmlFor="productPrice">Price</label>
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
                <label htmlFor="image">Image</label> <br />
                <input
                  type="file"
                  id="image"
                  className="form-control-file"
                  onChange={(e) => setImage(e.target.files[0])}
                  required
                  style={{ marginBottom: "10px" }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="ProductDetails">Details</label>
                <textarea
                  id="ProductDetails"
                  className="form-control"
                  value={ProductDetails}
                  onChange={(e) => setProductDetails(e.target.value)}
                  placeholder="Enter Product Details"
                  rows="4"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-dark">
                Upload
              </button>
              {message && <div className="alert alert-info mt-3">{message}</div>}
            </form>
          </div>
          <div className="col-md-6">
            <div
              className="card p-4"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              <ItemList
                items={items}
                toggleEditing={toggleEditing}
                handleDelete={handleDelete}
                editingItem={editingItem}
                handleUpdate={handleUpdate}
                handleCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Product;
