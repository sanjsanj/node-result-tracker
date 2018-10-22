const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on(
  "error",
  console.error.bind(console, "connection error:")
);

mongoose.connection.once("open", function() {
  console.log("Mongoose connected");
});

module.exports = {
  mongoose
};
