const express = require("express");
const port = process.env.PORT || 5000;
const app = express();

// import mongoose file
require("./db/connection");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.get("/", (req, res) => {
  res.send("chat app server is running!");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
