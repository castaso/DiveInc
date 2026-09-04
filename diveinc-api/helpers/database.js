'use strict';

const database = require(`@config/database`)
const Sequelize = require(`sequelize`)

const env = process.env.NODE_ENV || 'development';

const envConfig = database[env] || database.test
const sequelizeOptions = {
      host: envConfig.host,
      dialect: envConfig.dialect,
      port: envConfig.port,
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
        acquire: 30000,
      },
      logging: true,
    }
if (envConfig.ssl) {
  sequelizeOptions.ssl = envConfig.ssl
  sequelizeOptions.dialectOptions = envConfig.dialectOptions
}
const sequelize = new Sequelize(
    envConfig.database,
    envConfig.username,
    envConfig.password,
    sequelizeOptions)

module.exports = sequelize;
