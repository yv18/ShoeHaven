import React, { useState, useEffect } from 'react';
import NavigationBar from './Navbar.jsx';
import { Container, Button, Form, Table, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { Buffer } from 'buffer';
import empty from '../Assets/empty.jpg';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const storedEmail = localStorage.getItem('user-email');
        if (!storedEmail) {
          alert("Please log in first."); 
          navigate('/login');
          return;
        }
        setUserEmail(storedEmail);
        
        const response = await axios.get(`http://localhost:8000/api/cart?email=${storedEmail}`);
        setCartItems(response.data);
      } catch (error) {
        console.error("There was an error fetching the cart items!", error.response || error.message);
        setError("Failed to fetch cart items");
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = async (item, quantity) => {
    if (quantity < 1) return;
    try {
      const updatedItem = { ...item, quantity };
      await axios.put(`http://localhost:8000/api/cart/${item._id}`, updatedItem);
      setCartItems(cartItems.map(cartItem => cartItem._id === item._id ? updatedItem : cartItem));
    } catch (error) {
      console.error("There was an error updating the cart item!", error.response || error.message);
      setError("Failed to update cart item");
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      await axios.delete(`http://localhost:8000/api/cart/${item._id}`);
      setCartItems(cartItems.filter(cartItem => cartItem._id !== item._id));
    } catch (error) {
      console.error("There was an error removing the cart item!", error.response || error.message);
      setError("Failed to remove cart item");
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    // Navigate to checkout form or component
    navigate('/checkout', { state: { cartItems, totalPrice: calculateTotalPrice(), totalItems: calculateTotalItems() } });
  };

  return (
    <>
      <NavigationBar />
      <Container>
        <h2 className="my-3">Shopping Cart</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {cartItems.length === 0 ? (
          <div className="emptyDiv">
            <img src={empty} alt="cartEmpty" className="emptyCart" />
            <h1>Your Cart is empty!</h1>
          </div>
        ) : (
          <>
            <Table striped bordered hover responsive="md">
              <tbody>
                {cartItems.map(item => (
                  <tr key={item._id}>
                    <td>
                      <img 
                        src={item.image ? `data:${item.imageType};base64,${Buffer.from(item.image).toString('base64')}` : '/path/to/placeholder-image.png'} 
                        alt={item.name} 
                        className="product-img"
                        style={{ width: '100px', height: '100px' }}
                      />
                    </td>
                    <td>
                      <h5>{item.name}</h5>
                      <p>Price: ${item.price}</p>
                    </td>
                    <td>
                      <div className="quantity-control" style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          style={{ marginRight: '10px', marginLeft: '10px' }}
                        >
                          -
                        </Button>
                        <Form.Control 
                          type="number" 
                          value={item.quantity} 
                          onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                          style={{ width: '60px', textAlign: 'center' }}
                          readOnly
                        />
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          style={{ marginLeft: '10px' }}
                        >
                          +
                        </Button>
                      </div>
                    </td>
                    <td>
                      <Button variant="danger" onClick={() => handleRemoveItem(item)}>Remove</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Row className="mt-3">
              <Col xs={12} md={6} className="offset-md-6">
                <Card>
                  <Card.Body>
                    <h5>Cart Summary</h5>
                    <p>Total Items: {calculateTotalItems()}</p>
                    <p>Total Price: ${calculateTotalPrice()}</p>
                    <Button variant="warning" block onClick={handleCheckout}>Checkout</Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
}

export default Cart;
