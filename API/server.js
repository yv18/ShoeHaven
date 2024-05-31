const express = require("express");
require('dotenv').config();
require("./Model/Database");


const app = express();




const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log("App started on", PORT);
});
