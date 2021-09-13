const router = require("express").Router();
const {
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
} = require("./auth-middleware");
const User = require("./../users/users-model");
const bcrypt = require("bcryptjs");

// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */

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

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */

router.post("/login", checkUsernameExists, (req, res) => {
  const { username } = req.body;
  res.status(200).json({
    message: `Welcome ${username}!`,
  });
});

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

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

// Don't forget to add the router to the `exports` object so it can be required in other modules

module.exports = router;
