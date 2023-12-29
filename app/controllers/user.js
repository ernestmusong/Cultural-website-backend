var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var User = require("../models/user");
var config = require("../config/auth.config.js");

exports.signup = (req, res) => {
   
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

  user.save()
  .then((result) => {
    res.status(200).send(result);
  })
  .catch((err) => {
    if (err.code === 11000 && err.keyPattern.email === 1) {
      res.status(400).send({ message: "Failed! Email is already in use!" });
    } else if (err.code === 11000 && err.keyPattern.username === 1) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
    } else {
      res.status(500).send({ message: err });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({ username: req.body.username }).exec()
  .then((user) => {
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
      expiresIn: 1209600 // 2 weeks
    });

    res.status(200).send(
      {
        id: user._id,
        title: user.title,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        branch: user.branch,
        role:user.role,
        token: token
      }
    );
  })
  .catch((err) => {
    res.status(500).send({ message: err });
  });
};