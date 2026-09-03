`use strict`

const controller = require(`express`).Router({mergeParams : true})

const all = require(`./all`)
const single = require(`./single`)

controller.use(`/`, all)
controller.use(`/:id`, single)

module.exports = controller