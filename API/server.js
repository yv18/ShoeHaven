const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const app = express();

mongoose.connect(
  "mongodb+srv://rajyashrajkishorsinh:Raj2329@cluster0.bu58mey.mongodb.net/nikeClone"
);

// middlewares
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API is working");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log(`Backend started on http://localhost:${PORT}`);
});

// MiddleWare to fetch user from database
const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};

// Schema for creating user model
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//Create an endpoint at ip/login for login the user and giving auth-token
app.post("/login", async (req, res) => {
  console.log("Login");
  let success = false;
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      success = true;
      console.log(user.id);
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success, token });
    } else {
      return res.status(400).json({
        success: success,
        errors: "please try with correct email/password",
      });
    }
  } else {
    return res.status(400).json({
      success: success,
      errors: "please try with correct email/password",
    });
  }
});

//Create an endpoint at ip/auth for regestring the user in data base & sending token
app.post("/signup", async (req, res) => {
  console.log("Sign Up");
  let success = false;

  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: success,
      errors: "existing user found with this email",
    });
  }

  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();
  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, "secret_ecom");
  success = true;
  res.json({ success, token });
});

// API for Products
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  productName: String,
  productPrice: Number,
  category: String,
  image: Buffer,
  imageType: String,
});

const Item = mongoose.model("Item", itemSchema);

// API endpoint for uploading an item
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const newItem = new Item({
      productName: req.body.productName,
      productPrice: req.body.productPrice,
      category: req.body.category,
      image: req.file.buffer,
      imageType: req.file.mimetype,
    });

    await newItem.save();

    res.status(201).json({ message: "Item created successfully", newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// API endpoint for getting all items
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// API endpoint for updating an item
app.put("/api/items/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;

  try {
    const updateData = {
      productName: req.body.productName,
      productPrice: req.body.productPrice,
      category: req.body.category,
    };

    if (req.file) {
      updateData.image = req.file.buffer;
      updateData.imageType = req.file.mimetype;
    }

    const updatedItem = await Item.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item updated successfully", updatedItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// API endpoint for deleting an item
app.delete("/api/items/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully", deletedItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



// Add to cart
const CartItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  size: {type: String, required: true },
  quantity: { type: Number, required: true },
  email: { type: String, required: true },
  image: { type: Buffer },
  imageType: { type: String }
});


const CartItem = mongoose.model("CartItem", CartItemSchema);

app.get('/api/cart', async (req, res) => {
  const { email } = req.query;
  try {
    const cartItems = await CartItem.find({ email });
    res.status(200).json(cartItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


app.delete('/api/cart', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await CartItem.deleteMany({ email });
    res.status(200).json({ message: `${result.deletedCount} items deleted.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/api/cart", async (req, res) => {
  const { name, price, size, quantity, email, image, imageType } = req.body;
  try {
    const newCartItem = new CartItem({ name, price, quantity, size, email, image, imageType });
    await newCartItem.save();
    res.status(201).json(newCartItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});




app.put("/api/cart/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const updatedItem = await CartItem.findByIdAndUpdate(id, { quantity }, { new: true });
    res.status(200).json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



app.delete("/api/cart/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await CartItem.findByIdAndDelete(id);
    res.status(200).json({ message: "Item removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


app.get('/user/:email', async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
    console.log("Error fetching user:", error);
  }
});




//Checkout and Order Managing Backend
const orderSchema = new Schema({
  userEmail: String,
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "CartItem" },
      quantity: Number,
      productName: String,
      price: Number,
    },
  ],
  totalItems: Number,
  totalPrice: Number,
  orderDate: { type: Date, default: Date.now },
  name: String,
  phone: String,
  address: String,
  postalCode: String,
  state: String,
  cardNumber: String,
  cardCVV: String,
  cardExpiry: String,
  cardHolderName: String,
  status: String,
});

const Order = mongoose.model("Order", orderSchema);

// Fetch Orders by Email Endpoint
app.get("/api/order", async (req, res) => {
  const { userEmail } = req.query;
  try {
    const orders = await Order.find({ userEmail });
    console.log(`Orders found: ${orders}`);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/orders", async (req, res) => {
  const {
    userEmail,
    items,
    totalItems,
    totalPrice,
    name,
    phone,
    address,
    postalCode,
    state,
    cardNumber,
    cardCVV,
    cardExpiry,
    cardHolderName,
  } = req.body;

  try {
    const newOrder = new Order({
      userEmail,
      items,
      totalItems,
      totalPrice,
      name,
      phone,
      address,
      postalCode,
      state,
      cardNumber,
      cardCVV,
      cardExpiry,
      cardHolderName,
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

app.delete("/api/cart", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  try {
    // Delete all cart items for the specified email
    const result = await Cart.deleteMany({ email });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .send({ message: "No cart items found for this user" });
    }

    res.status(200).send({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error); // Log error for debugging
    res.status(500).send({ message: "Failed to clear cart" });
  }
});

//ReturnOrderPage//

const returnOrderSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  productName: { type: String, required: true },
  userEmail: { type: String, required: true },
  returnRequested: { type: Boolean, default: false },
  returnReason: { type: String, required: false },
  status: { type: String },
});

const ReturnOrder = mongoose.model("ReturnOrder", returnOrderSchema);

app.post("/api/return", async (req, res) => {
  const { orderId, productName, returnRequested, userEmail, returnReason } =
    req.body;
  try {
    const newReturnOrder = new ReturnOrder({
      orderId,
      productName,
      userEmail,
      returnRequested,
      returnReason,
    });
    await newReturnOrder.save();
    res
      .status(201)
      .json({
        message: "Return request created successfully",
        returnOrder: newReturnOrder,
      });
  } catch (error) {
    res.status(500).json({ error: "Failed to create return request" });
  }
});

app.put("/api/order/:id/return", async (req, res) => {
  const { id } = req.params;
  const { returnRequested, returnReason } = req.body;
  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (returnRequested) {
      for (const item of order.items) {
        const newReturnOrder = new ReturnOrder({
          orderId: order._id,
          userEmail: order.userEmail,
          productName: item.productName,
          returnReason,
        });
        await newReturnOrder.save();
      }
    }

    order.returnRequested = returnRequested;
    order.returnReason = returnReason;
    const updatedOrder = await order.save();

    res.json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order" });
  }
});

app.get("/api/return-orders", async (req, res) => {
  try {
    const returnOrders = await ReturnOrder.find();
    res.json(returnOrders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch return orders" });
  }
});

// Update return order status
app.put("/api/return-order/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedReturnOrder = await ReturnOrder.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedReturnOrder) {
      console.error("Return order not found"); // Log error
      return res.status(404).json({ message: "Return order not found" });
    }
    console.log("Return order status updated:", updatedReturnOrder); // Log success
    res.json({
      message: "Return order status updated successfully",
      returnOrder: updatedReturnOrder,
    });
  } catch (error) {
    console.error("Failed to update return order status:", error); // Log error
    res.status(500).json({ error: "Failed to update return order status" });
  }
});
