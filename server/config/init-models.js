var DataTypes = require("sequelize").DataTypes;
var _my_dept = require("../models/my_dept");
var _my_dept_user = require("../models/my_dept_user");
var _my_permission = require("../models/my_permission");
var _my_permission_api = require("../models/my_permission_api");
var _my_role = require("../models/my_role");
var _my_role_permission = require("../models/my_role_permission");
var _my_user = require("../models/my_user");
var _my_user_role = require("../models/my_user_role");
var _operation_log = require("../models/operation_log");

function initModels(sequelize) {
  var my_dept = _my_dept(sequelize, DataTypes);
  var my_dept_user = _my_dept_user(sequelize, DataTypes);
  var my_permission = _my_permission(sequelize, DataTypes);
  var my_permission_api = _my_permission_api(sequelize, DataTypes);
  var my_role = _my_role(sequelize, DataTypes);
  var my_role_permission = _my_role_permission(sequelize, DataTypes);
  var my_user = _my_user(sequelize, DataTypes);
  var my_user_role = _my_user_role(sequelize, DataTypes);
  var operation_log = _operation_log(sequelize, DataTypes);

  my_dept_user.belongsTo(my_dept, { as: "dept", foreignKey: "dept_id"});
  my_dept.hasMany(my_dept_user, { as: "my_dept_users", foreignKey: "dept_id"});
  my_permission_api.belongsTo(my_permission, { as: "p", foreignKey: "ps_id"});
  my_permission.hasMany(my_permission_api, { as: "my_permission_apis", foreignKey: "ps_id"});
  my_role_permission.belongsTo(my_permission, { as: "p", foreignKey: "ps_id"});
  my_permission.hasMany(my_role_permission, { as: "my_role_permissions", foreignKey: "ps_id"});
  my_role_permission.belongsTo(my_role, { as: "role", foreignKey: "role_id"});
  my_role.hasMany(my_role_permission, { as: "my_role_permissions", foreignKey: "role_id"});
  my_user_role.belongsTo(my_role, { as: "role", foreignKey: "role_id"});
  my_role.hasMany(my_user_role, { as: "my_user_roles", foreignKey: "role_id"});
  my_dept_user.belongsTo(my_user, { as: "user", foreignKey: "user_id"});
  my_user.hasMany(my_dept_user, { as: "my_dept_users", foreignKey: "user_id"});
  my_user_role.belongsTo(my_user, { as: "user", foreignKey: "user_id"});
  my_user.hasMany(my_user_role, { as: "my_user_roles", foreignKey: "user_id"});

  return {
    my_dept,
    my_dept_user,
    my_permission,
    my_permission_api,
    my_role,
    my_role_permission,
    my_user,
    my_user_role,
    operation_log,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
