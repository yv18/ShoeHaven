import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Image } from 'react-bootstrap';
import axios from 'axios';
import { Buffer } from 'buffer';
import NavigationBar from './Navbar.jsx';

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      const storedEmail = localStorage.getItem('user-email');
      if (!storedEmail) {
        setError("User not logged in");
        return;
      }

      try {
        const response = await axios.get(`https://shoehaven-backend.onrender.com/api/wishlist`, {
          params: { email: storedEmail }
        });

        if (Array.isArray(response.data)) {
          setWishlistItems(response.data);
        } else {
          console.error("Response data is not an array:", response.data);
          setError("Unexpected response format");
        }
      } catch (error) {
        console.error("There was an error fetching the wishlist items!", error);
        setError("Failed to fetch wishlist items");
      }
    };

    fetchWishlistItems();
  }, []);

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      await axios.delete(`https://shoehaven-backend.onrender.com/api/wishlist/${itemId}`);
      setWishlistItems(wishlistItems.filter(item => item._id !== itemId));
      alert("Item removed from wishlist!");
    } catch (error) {
      console.error("There was an error removing the item from the wishlist!", error);
      setError("Failed to remove item from wishlist");
    }
  };

  const handleMoveToCart = async (item) => {
    const storedEmail = localStorage.getItem('user-email');
    if (!storedEmail) {
      setError("User not logged in");
      return;
    }

    const cartItem = {
      email: storedEmail,
      productId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      image: item.image,
      imageType: item.imageType,
    };

    try {
      await axios.post('https://shoehaven-backend.onrender.com/api/cart', cartItem);
      alert('Item moved to cart successfully!');
      
      // Optionally, remove the item from the wishlist after moving it to the cart
      handleRemoveFromWishlist(item._id);
    } catch (error) {
      console.error("There was an error moving the item to the cart!", error);
      setError("Failed to move item to cart");
    }
  };

  return (
    <>
      <NavigationBar />
      <Container className="mt-4">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <h2>My Wishlist</h2>
        {wishlistItems.length === 0 && !error && (
          <p>No items in your wishlist.</p>
        )}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {wishlistItems.map(item => (
              <tr key={item._id}>
                <td>
                  <Image
                    src={`data:${item.imageType};base64,${Buffer.from(item.image).toString('base64')}`}
                    alt={item.name}
                    rounded
                    style={{ width: '100px', height: 'auto' }}
                  />
                </td>
                <td>{item.name}</td>
                <td>${item.price}</td>
                <td>{item.size}</td>
                <td>{item.quantity}</td>
                <td>
                  <Button
                    variant="primary"
                    className="mb-2"
                    onClick={() => handleMoveToCart(item)}
                  >
                    Move to Cart
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveFromWishlist(item._id)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default Wishlist;
