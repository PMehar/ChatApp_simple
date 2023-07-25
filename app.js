const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const fs = require('fs');
const app = express();

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Array to store messages
const messages = [];

// login form
app.get("/login", (req, res) => {
  res.send(`
    <form action="/login" method="post">
      <label for="username">Username:</label>
      <input type="text" name="username" id="username" required>
      <button type="submit">Login</button>
    </form>
  `);
});

// login form submission
app.post("/login", (req, res) => {
  const { username } = req.body;
  res.cookie('username', username);
  res.redirect("/");
});

// Serve send message form
app.get("/", (req, res) => {
  res.send(`
    <div>
      <ul id="messageList">
        ${messages.map((message) => `<li>${message}</li>`).join("")}
      </ul>
    </div>
    <script>
    displayMessages();
      function displayMessages() {
        const messageList = document.getElementById('messageList');
        const messages = ${JSON.stringify(messages)};
        messageList.innerHTML = messages.map(message => '<li>' + message + '</li>').join('');
      }
    </script>
    <form action="/send" method="post">
      <label for="message">Message:</label>
      <input type="text" name="message" id="message" required>
      <button type="submit">Send</button>
    </form>
  `);
  app.post("/send", (req, res) => {
    const { message } = req.body;
    const username = req.cookies.username;
    const fullMessage = `${username}: ${message}`;
    messages.push(fullMessage);
    res.redirect("/");
  });
});
app.listen(5000);

