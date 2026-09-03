'use strict'

const express = require('express').Router({mergeParams : true})

const routApi = require('./api')
const route = require('./route')

express.use('/api', routApi)
express.use('/', route)

module.exports = express