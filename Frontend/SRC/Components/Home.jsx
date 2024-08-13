import React, { useEffect, useState } from "react";
import NavigationBar from "./Navbar.jsx";
import { Buffer } from "buffer";
import { Link } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://shoehaven-backend.onrender.com/api/items/home?limit=3"
        );

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
      <div className="back-home">
        <div className="content">
          <h1>Run Fast</h1>
          <p>
            Discover the latest in running gear and apparel to help you achieve
            your fitness goals.
          </p>
          <Link to="/Store" ><a className="btn btn-warning">Shop Now</a></Link>

          <div className="container mt-4">
            {products.length > 0 ? (
              <div className="row">
                {products.map((product) => (
                  <div key={product._id} className="col-md-4">
                    <div className="card mb-4">
                      <img
                        src={`data:${product.imageType};base64,${Buffer.from(
                          product.image.data
                        ).toString("base64")}`}
                        className="card-img-top"
                        alt={product.productName}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{product.productName}</h5>
                        <p className="card-text">
                          ${product.productPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No products available</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
