require("./config/config");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");

require("./db/mongoose");

const { User } = require("./models/user");
const { authenticate } = require("./middleware/authenticate");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hi from server/server.js");
});

app.post("/users", async (req, res) => {
  try {
    const body = _.pick(req.body, ["email", "password"]);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken(user);
    res.header("x-auth", token).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

app.post("/users/login", async (req, res) => {
  try {
    const body = _.pick(req.body, ["email", "password"]);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken(user);
    res.header("x-auth", token).send(user);
  } catch (error) {
    res.status(404).send();
  }
});

app.delete("/users/me/token", authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = { app };
