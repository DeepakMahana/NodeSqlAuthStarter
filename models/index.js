const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const basename  = path.basename(__filename);
const db        = {};
const DATABASE = require('../config/database');

const sequelize = new Sequelize(DATABASE.db_name, DATABASE.db_user, DATABASE.db_password, {
  host: DATABASE.db_host,
  dialect: DATABASE.db_dialect,
  port: DATABASE.db_port,
  operatorsAliases: false
});

fs.readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    let model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
