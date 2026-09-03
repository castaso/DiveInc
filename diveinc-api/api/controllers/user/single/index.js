`use strict`

const model = 'user'

const controller = require(`express`).Router({mergeParams : true})

const Op = require('sequelize').Op
const user = require('@models').user
const logType = require('@models').log_type
const logActivity = require(`@models`).log_activity
const sha256 = require("js-sha256")


controller.get(`/`, async (req,res) => {
  res.status(200).send({
      success : true,
      message : `success id : ${req.params.id}`
  })
})

controller.post(`/`, async (req,res) => {
    res.status(200).send({
        success : true,
        message : `Create ${model} successfully id : ${req.params.id}`
    })
})

controller.put(`/`, (req,res) => {
  res.status(200).send({
      success : true,
      message : `Edit ${model} successfully id : ${req.params.id}`
  })
})

controller.delete(`/`, (req,res) => {
  res.status(200).send({
    success : true,
    message : `Delete ${model} successfully id : ${req.params.id}`
  })
})


module.exports = controller
