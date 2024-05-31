const mongoose = require('mongoose')
require("dotenv").config();
const DB =  process.env.DB;
mongoose.connect(`${DB}`);
mongoose.connection.on("connected", function(){
    console.log("Backend connected successfully"); // to display the success message when connection is established
})

// so here I have connected my backend to the database using mongoDB connection string.
