'use strict';

require('dotenv').config(); // Loads environment variables from a .env file into process.env -> https://www.npmjs.com/package/dotenv

module.exports = {
    // Test Environment
    "test": {
        "username": process.env.DB_USERNAME || "diveinc_user",
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST || "localhost",
        "port": process.env.DB_PORT || "5432",
        "dialect": "postgres", // Database use postgresql
    },
    //Development Environment
    "development": {
        "username": process.env.DB_USERNAME,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST || "localhost",
        "port": process.env.DB_PORT || "5432",
        "dialect": "postgres", // Database use postgresql
    },
    // Production Environment
    "production": {
        "username": process.env.DB_USERNAME,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST || "localhost",
        "port": process.env.DB_PORT || "5432",
        "dialect": "postgres", // Database use postgresql
        "ssl":true,
        "dialectOptions":{
            "ssl":{
                "require":true
            }
        }
    }
};
