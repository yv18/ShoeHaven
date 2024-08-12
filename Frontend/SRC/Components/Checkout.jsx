import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavigationBar from "./Navbar.jsx";
import { Container, Form, Button, Accordion, Card } from "react-bootstrap";
import axios from "axios";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, totalPrice, totalItems } = location.state || {};
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    postalCode: "",
    state: "",
    cardNumber: "",
    cardCVV: "",
    cardExpiry: "",
    cardHolderName: "",
  });

  const [errors, setErrors] = useState({});

  const deleteCartItems = async (email) => {
    try {
      const response = await axios.delete("http://localhost:8000/api/cart", {
        data: { email },
      });
      console.log(response.data.message);
    } catch (error) {
      console.error(
        "Error deleting cart items:",
        error.response || error.message
      );
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate Name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    // Validate Phone
    const phonePattern = /^[0-9]{10}$/;
    if (!formData.phone.trim() || !phonePattern.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }

    // Validate Address
    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    // Validate Postal Code
    const postalCodePattern = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/; // Example for Canadian postal code
    if (
      !formData.postalCode.trim() ||
      !postalCodePattern.test(formData.postalCode)
    ) {
      newErrors.postalCode = "Invalid postal code.";
    }

    // Validate State
    if (!formData.state.trim()) {
      newErrors.state = "State is required.";
    }

    // Validate Card Number
    const cardNumberPattern = /^\d{16}$/;
    if (
      !formData.cardNumber.trim() ||
      !cardNumberPattern.test(formData.cardNumber)
    ) {
      newErrors.cardNumber = "Card number must be 16 digits.";
    }

    // Validate Card CVV
    const cardCVVPattern = /^\d{3}$/;
    if (!formData.cardCVV.trim() || !cardCVVPattern.test(formData.cardCVV)) {
      newErrors.cardCVV = "Card CVV must be 3 digits.";
    }

    // Validate Card Expiry
    const cardExpiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (
      !formData.cardExpiry.trim() ||
      !cardExpiryPattern.test(formData.cardExpiry)
    ) {
      newErrors.cardExpiry = "Card expiry must be in MM/YY format.";
    }

    // Validate Card Holder Name
    if (!formData.cardHolderName.trim()) {
      newErrors.cardHolderName = "Card holder name is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const orderData = {
        userEmail: localStorage.getItem("user-email"),
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          productName: item.name,
          price: item.price,
        })),
        totalItems,
        totalPrice,
        ...formData,
      };
      await axios.post("http://localhost:8000/api/orders", orderData);
      const mail = localStorage.getItem("user-email");
      deleteCartItems(mail);
      alert("Order placed successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error placing order:", error.response || error.message);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <>
      <NavigationBar />
      <Container>
        <h2 className="my-3">Checkout</h2>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleInputChange}
              isInvalid={!!errors.name}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleInputChange}
              isInvalid={!!errors.phone}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.phone}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleInputChange}
              isInvalid={!!errors.address}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.address}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formPostalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              name="postalCode"
              placeholder="Enter your postal code"
              value={formData.postalCode}
              onChange={handleInputChange}
              isInvalid={!!errors.postalCode}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.postalCode}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formState">
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              name="state"
              placeholder="Enter your state"
              value={formData.state}
              onChange={handleInputChange}
              isInvalid={!!errors.state}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.state}
            </Form.Control.Feedback>
          </Form.Group>

          <Accordion className="my-4">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Card Details</Accordion.Header>
              <Accordion.Body>
                <Form.Group controlId="formCardNumber">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    placeholder="Enter your card number"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    isInvalid={!!errors.cardNumber}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cardNumber}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formCardCVV">
                  <Form.Label>Card CVV</Form.Label>
                  <Form.Control
                    type="text"
                    name="cardCVV"
                    placeholder="Enter your card CVV"
                    value={formData.cardCVV}
                    onChange={handleInputChange}
                    isInvalid={!!errors.cardCVV}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cardCVV}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formCardExpiry">
                  <Form.Label>Card Expiry Date</Form.Label>
                  <Form.Control
                    type="text"
                    name="cardExpiry"
                    placeholder="MM/YY"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                    isInvalid={!!errors.cardExpiry}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cardExpiry}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formCardHolderName">
                  <Form.Label>Card Holder Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="cardHolderName"
                    placeholder="Enter the cardholder's name"
                    value={formData.cardHolderName}
                    onChange={handleInputChange}
                    isInvalid={!!errors.cardHolderName}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cardHolderName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Form.Group controlId="formOrderSummary">
            <Form.Label>Order Summary</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={`Total Items: ${totalItems || 0}\nTotal Price: $${
                totalPrice || 0
              }`}
              readOnly
            />
          </Form.Group>
          <Button variant="primary" type="button" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default Checkout;
