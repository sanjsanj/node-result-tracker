require("./config/config");
require("./db/mongoose");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const path = require("path");

const { User } = require("./models/user");
const { Result } = require("./models/result");
const { authenticate } = require("./middleware/authenticate");

const publicPath = path.join(__dirname, "../public");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hi from server/server.js");
});

app.post("/users", async (req, res) => {
  try {
    const body = _.pick(req.body, ["email", "password", "inviteCode"]);
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

app.post("/result", authenticate, (req, res) => {
  const result = new Result({
    _creator: req.user._id,
    winner: req.body.winner,
    loser: req.body.loser
  });

  result
    .save()
    .then(() => res.send(result))
    .catch(e => res.status(400).send(e));
});

app.get("/results", authenticate, (req, res) => {
  Result.find()
    .then(results => res.send({ results }))
    .catch(e => res.status(400).send(e));
});

app.delete("/result/:id", authenticate, async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) return res.status(404).send();
  try {
    const result = await Result.findById(id);
    if (result._creator.toString() !== req.user._id.toString())
      return res.status(404).send();

    const removedResult = await Result.findOneAndRemove({ _id: id});
    if (!removedResult)
      return res.status(404).send();
    
    res.status(200).send({ removedResult });
  } catch (e) {
    res.status(404).send();
  }
});

app.patch("/result/confirm/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Result.findOne({
    _id: id
  })
    .then(result => {
      const confirmedBySubmitter =
        result._creator.toString() === req.user._id.toString();

      if (!result || confirmedBySubmitter) {
        return res.status(404).send();
      }

      result.confirmed = !result.confirmed;
      result
        .save()
        .then(() => res.send(result))
        .catch(e => res.status(400).send(e));
    })
    .catch(e => res.status(404).send(e));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = { app };
