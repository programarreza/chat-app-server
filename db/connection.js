const mongoose = require("mongoose");

const url = `mongodb+srv://programarreza:reza666999@cluster0.npfvfnc.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((error) => console.log("Error", error));
