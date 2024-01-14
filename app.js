const express = require("express");
const port = process.env.PORT || 5000;
const app = express();

// connect database
require("./db/connection");

// import schema file
const Users = require("./models/Users");
const Conversations = require("./models/Conversations");
const Messages = require("./models/Messages");

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
    res.status(200).send("Conversation created successfully");
  } catch (error) {
    console.log(error, "error");
  }
});

app.get("/api/conversation/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversations.find({
      members: { $in: [userId] },
    });

    const conversationUserData = Promise.all(
      conversations.map(async (conversation) => {
        const receiverId = conversation.members.find(
          (member) => member !== userId
        );
        const user = await Users.findById(receiverId);
        return {
          user: { email: user.email, fullName: user.fullName },
          conversationId: conversation._id,
        };
      })
    );
    res.status(200).json(await conversationUserData);
  } catch (error) {
    console.log(error, "error");
  }
});

// send message
app.post("/api/message", async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId= '' } = req.body;
    if (!senderId || !message) return res.status(400).send("Please Fill all required fields");

    if (!conversationId && receiverId) {
      const newConversation = new Conversations({
        members: [senderId, receiverId],
      });
      await newConversation.save();
      const newMessage = new Messages({
        conversationId: newConversation._id,
        senderId,
        message,
      });
      await newMessage.save()
      return res.status(200).send("Message send Successfully ")
    }else if(!conversationId && !receiverId){
      return res.status(400).send('Please fill all require fields')
    }
    
    const newMessage = new Messages({ conversationId, senderId, message });
    await newMessage.save();
    res.status(200).send("Message send Successfully");
  } catch (error) {
    console.log(error, "error");
  }
});

// get message and message sender info
app.get("/api/message/:conversationId", async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    if (conversationId === 'new') return res.status(200).json([]);
    const messages = await Messages.find({ conversationId });
    const messageUserData = Promise.all(
      messages.map(async (message) => {
        const user = await Users.findById(message.senderId);
        return {
          user: { email: user.email, fullName: user.fullName },
          message: message.message,
        };
      })
    );

    res.status(200).json(await messageUserData);
  } catch (error) {}
});

// get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await Users.find();
    const usersData = Promise.all(
      users.map(async (user) => {
        return {
          user: { email: user.email, fullName: user.fullName },
          userId: user._id,
        };
      })
    );
    res.status(200).json(await usersData);
  } catch (error) {
    console.log("error", error);
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
