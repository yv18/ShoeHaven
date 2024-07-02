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
      return res
        .status(400)
        .json({
          success: success,
          errors: "please try with correct email/password",
        });
    }
  } else {
    return res
      .status(400)
      .json({
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
    return res
      .status(400)
      .json({
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
