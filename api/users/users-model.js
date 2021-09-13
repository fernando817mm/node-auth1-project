const db = require("./../../data/db-config");

function find() {
  return db("users");
}

function findBy(filter) {
  return db("users").where(filter).orderBy("user_id");
}

function findById(user_id) {
  return db("users").where({ user_id }).first();
}

async function add(user) {
  const [id] = await db("users").insert(user, "user_id");

  return findById(id);
}

module.exports = {
  find,
  findBy,
  findById,
  add,
};
