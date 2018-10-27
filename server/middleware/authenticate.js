const { User } = require("../models/user");

function authenticate(req, res, next) {
  const token = req.header("x-auth");

  User.findByToken(token)
    .then(user => {
      if (user) {
        req.user = user;
        req.token = token;
        
        next();
      } else {
        return Promise.reject();
      }
    })
    .catch(e => res.status(401).send(e));
}

module.exports = { authenticate };
