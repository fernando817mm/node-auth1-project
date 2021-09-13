const User = require("./../users/users-model");
const bcrypt = require("bcryptjs");

function restricted(req, res, next) {
  req.session.chocolatechip
    ? next()
    : next({
        status: 401,
        message: "You shall not pass!",
      });
}

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

function checkPasswordLength(req, res, next) {
  const { password } = req.body;
  password && password.length > 3
    ? next()
    : next({
        status: 422,
        message: "Password must be longer than 3 chars",
      });
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
};
