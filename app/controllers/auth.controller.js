const config = require("../config/auth.config");
const User = require("./models/user");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
 
exports.signup = (req, res) => {
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
 const userDoc = User.findOne({
    username: req.body.username
  })
      if (!userDoc) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        userDoc.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: userDoc.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      res.status(200).send({
        id: userDoc._id,
        title: userDoc.title,
        username: userDoc.username,
        email: userDoc.email,
        roles: authorities,
        firstName: userDoc.firstName,
        lastName: userDoc.lastName,
        branch: userDoc.branch,
        socialGroup: userDoc.socialGroup,
        accessToken: token
      });
};
