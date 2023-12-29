const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config()
const app = express();

mongoose.Promise = global.Promise;
 
app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB Atlas.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Befang Cultural and Development Association." });
});

// routes
require("./app/routes/user.routes")(app);
require("./app/routes/auth.routes")(app);

// set port, listen for requests
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

 