const db = require("../config/db");
const Users = require("./UsersModels");

db.sync({ alter: true })
  .then(() => console.log("All models synced"))
  .catch((error) => console.error(`Unable to sync database: ${error}`));

module.exports = {
  Users,

};
