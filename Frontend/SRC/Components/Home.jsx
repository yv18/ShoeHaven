import React, { useEffect, useState } from "react";
import NavigationBar from "./Navbar.jsx";
import { Buffer } from "buffer";


function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/items");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          setProducts(data);
        } else {
          throw new Error("Received non-JSON response");
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <NavigationBar />
      <div className="home-container">
        <div className="banner">
          <div className="banner-content">
            <h1 className="banner-title">Run Fast</h1>
            <p className="banner-subtitle">
              Discover the latest in running gear and apparel to help you
              achieve your fitness goals.
            </p>
            <button className="shop-now-button">Shop Now</button>
          </div>
        </div>
        <div className="product-section">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="product-item">
                <img
                  src={`data:${product.imageType};base64,${Buffer.from(
                    product.image.data
                  ).toString("base64")}`}
                  alt={product.productName}
                  className="product-image"
                />
                <p className="product-name">{product.productName}</p>
                <p className="product-price">
                  ${product.productPrice.toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
