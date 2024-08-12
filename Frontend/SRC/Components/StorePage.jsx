import React, { useState, useEffect } from "react";
import NavigationBar from "./Navbar.jsx";
import { Container, Row, Col, Form, FormControl, Button, Card, Modal, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { Buffer } from "buffer";

function Store() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://shoehaven-backend.onrender.com/api/items");
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error("Response data is not an array:", response.data);
          setError("Unexpected response format");
        }
      } catch (error) {
        console.error("There was an error fetching the products!", error);
        setError("Failed to fetch products");
      }
    };

    fetchProducts();

    const storedEmail = localStorage.getItem('user-email');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleAddToCart = async () => {
    if (!userEmail) {
      alert("Please log in first before adding items to the cart.");
      return;
    }

    if (!selectedSize) {
      alert("Please select a size before adding to the cart.");
      return;
    }

    try {
      const cartItem = {
        name: selectedProduct.productName,
        price: selectedProduct.productPrice,
        image: selectedProduct.image,
        email: userEmail,
        quantity: 1,
        size: selectedSize
      };
      await axios.post("https://shoehaven-backend.onrender.com/api/cart", cartItem);
      alert("Item added to cart!");
      handleCloseModal();
    } catch (error) {
      console.error("There was an error adding the item to the cart!", error);
    }
  };

  const handleAddToWishlist = async () => {
    if (!userEmail) {
      alert("Please log in first before adding items to the wishlist.");
      return;
    }

    if (!selectedSize) {
      alert("Please select a size before adding to the wishlist.");
      return;
    }

    try {
      const wishlistItem = {
        name: selectedProduct.productName,
        price: selectedProduct.productPrice,
        image: selectedProduct.image,
        imageType: selectedProduct.imageType,
        email: userEmail,
        quantity: 1,
        size: selectedSize
      };
      await axios.post("https://shoehaven-backend.onrender.com/api/wishlist", wishlistItem);
      alert("Item added to wishlist!");
      handleCloseModal();
    } catch (error) {
      console.error("There was an error adding the item to the wishlist!", error);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
    setSelectedSize("");
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const filteredProducts = products.filter(product =>
    (selectedCategory === "All" || product.category === selectedCategory) &&
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <NavigationBar />
      <Container>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Form className="my-3" style={{ display: 'flex', gap: '20px' }}>
          <FormControl
            type="text"
            placeholder="Search Products"
            className="mr-sm-2"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ width: '200px' }}
          />
          <Button variant="outline-success">Search</Button>
        </Form>
        <Form.Group controlId="categoryFilter" className="my-3">
          <Form.Label>Filter by Category</Form.Label>
          <Form.Control as="select" value={selectedCategory} onChange={handleCategoryChange}>
            <option>All</option>
            <option>Men</option>
            <option>Women</option>
            <option>Kids</option>
          </Form.Control>
        </Form.Group>
        <Row>
          {filteredProducts.map(product => (
            <Col key={product._id} sm={12} md={6} lg={3} className="mb-3">
              <Card onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }}>
                <Card.Img
                  variant="top"
                  src={`data:${product.imageType};base64,${Buffer.from(product.image).toString('base64')}`}
                  className="product-Cart-img"
                />
                <Card.Body>
                  <Card.Title>{product.productName}</Card.Title>
                  <Card.Text>
                    Category: {product.category}<br />
                    Price: ${product.productPrice}
                  </Card.Text>
                  <Button variant="dark">View Details</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Modal show={showProductModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedProduct && selectedProduct.productName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedProduct && (
              <>
                <img
                  src={`data:${selectedProduct.imageType};base64,${Buffer.from(selectedProduct.image).toString('base64')}`}
                  alt={selectedProduct.productName}
                  style={{ maxWidth: '100%', marginBottom: '20px' }}
                />
                <p><strong>Category:</strong> {selectedProduct.category}</p>
                <p><strong>Price:</strong> ${selectedProduct.productPrice}</p>
                <p><strong>Details: </strong>{selectedProduct.ProductDetails}</p>
                <Form.Group>
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                      {selectedSize ? `Size: ${selectedSize}` : "Select Size"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleSizeSelect("7")}>7</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleSizeSelect("7.5")}>7.5</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleSizeSelect("8")}>8</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleSizeSelect("9")}>9</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleSizeSelect("10")}>10</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleSizeSelect("11")}>11</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
                <Button variant="dark" style={{ marginTop: "10px" }} onClick={handleAddToCart}>
                  Add to Cart
                </Button>
                <Button variant="outline-dark" style={{ marginTop: "10px", marginLeft: "10px" }} onClick={handleAddToWishlist}>
                  Add to Wishlist
                </Button>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default Store;
