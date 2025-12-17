const Users = require('./UsersModels');
const Attendance = require('./AttendanceModels');

Users.hasMany(Attendance, {
    foreignKey: 'id_users',
    sourceKey: 'id_users',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Attendance.belongsTo(Users, {
    foreignKey: 'id_users',
    targetKey: 'id_users',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
