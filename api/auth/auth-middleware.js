const User = require("./../users/users-model");
const bcrypt = require("bcryptjs");

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  req.session.chocolatechip
    ? next()
    : next({
        status: 401,
        message: "You shall not pass!",
      });
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  const { username } = req.body;
  const [existing] = await User.findBy({ username });
  existing
    ? next({
        status: 422,
        message: "Username taken",
      })
    : next();
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  const { username, password } = req.body;
  const [existing] = await User.findBy({ username });

  existing && bcrypt.compareSync(password, existing.password)
    ? ((req.session.chocolatechip = existing), next())
    : next({
        status: 401,
        message: "Invalid credentials",
      });
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  const { password } = req.body;
  password && password.length > 3
    ? next()
    : next({
        status: 422,
        message: "Password must be longer than 3 chars",
      });
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
};
