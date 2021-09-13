const router = require("express").Router();
const {
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
} = require("./auth-middleware");
const User = require("./../users/users-model");
const bcrypt = require("bcryptjs");

router.post(
  "/register",
  checkUsernameFree,
  checkPasswordLength,
  (req, res, next) => {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 8);
    const newUser = { username, password: hash };
    User.add(newUser)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch(next);
  }
);

router.post("/login", checkUsernameExists, (req, res) => {
  const { username } = req.body;
  res.status(200).json({
    message: `Welcome ${username}!`,
  });
});

router.get("/logout", (req, res) => {
  req.session.chocolatechip
    ? req.session.destroy((err) => {
        err
          ? res.json({
              message: "there appears to be an error",
            })
          : res.json({
              message: "logged out",
            });
      })
    : res.json({
        message: "no session",
      });
});

module.exports = router;
