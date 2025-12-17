const db = require("../config/db");
const Users = require("./UsersModels");
const Attendance = require("./AttendanceModels");

db.sync({ alter: true })
  .then(() => console.log("All models synced"))
  .catch((error) => console.error(`Unable to sync database: ${error}`));

module.exports = {
  Users,
  Attendance
};
