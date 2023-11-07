const User = require("./models/user");
const secret = "molomolo900*";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
 
exports.signup = (req, res) => {
    // Username
    User.findOne({
      username: req.body.username
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      if (user) {
        res.status(400).send({ message: "Failed! Username is already in use!" });
        return;
      }
  
      // Email
      User.findOne({
        email: req.body.email
      }).exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
  
        if (user) {
          res.status(400).send({ message: "Failed! Email is already in use!" });
          return;
        }
  
        next();
      });
    });
  const user = new User({
    title: req.body.title,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    branch: req.body.branch,
    socialGroup: req.body.socialGroup,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8) // Auto gennerate a salt and hash.
  });

  user.save((err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "You have been registered successfully!" });
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
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

      const token = jwt.sign({ id: user.id }, secret, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).send({
        id: user._id,
        title: user.title,
        username: user.username,
        email: user.email,
        roles: authorities,
        firstName: user.firstName,
        lastName: user.lastName,
        branch: user.branch,
        socialGroup: user.socialGroup,
        accessToken: token
      });
    });
};