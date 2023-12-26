var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var User = require("../models/user");
var config = require("../config/auth.config.js");
var verifySignUp = require("../middlewares/verifySignUp");
 
exports.signup = (req, res) => {
  verifySignUp
  const user = new User({
    title: req.body.title,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    branch: req.body.branch,
    role: req.body.role,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8) // Auto gennerate a salt and hash.
  });

  user.save((err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "You have been registered successfully!" });
    res.status(200).send(user)
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).send({
        id: user._id,
        title: user.title,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        branch: user.branch,
        role:user.role,
        token: token
      });
    });
};