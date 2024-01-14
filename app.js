const express = require("express");
const port = process.env.PORT || 5000;
const app = express();

// connect database
require("./db/connection");

// import schema file
const Users = require("./models/Users");
const Conversations = require("./models/Conversations");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.get("/", (req, res) => {
  res.send("chat app server is running!");
});

// user info
app.post("/api/users", async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const newUser = new Users({ fullName, email });
    newUser.save();
    res.send(newUser);
  } catch (error) {
    console.log(error, "Error");
  }
});

app.post("/api/conversation", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const newConversation = new Conversations({
      members: [senderId, receiverId],
    });
    await newConversation.save();
    res.status(200).send('Conversation created successfully')
  } catch (error) {
    console.log(error, "error");
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
