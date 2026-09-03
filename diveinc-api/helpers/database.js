'use strict';

const database = require(`@config/database`)
const Sequelize = require(`sequelize`)

const env = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize(
    database[env].database,
    database[env].username,
    database[env].password, {
      host: database[env].host,
      dialect: database[env].dialect,
      port: database[env].port,
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
        acquire: 30000,
      },
      ssl:true,
      dialectOptions:{
          ssl:{
            require:true
          }
      },

      logging: true,
    })

module.exports = sequelize;
