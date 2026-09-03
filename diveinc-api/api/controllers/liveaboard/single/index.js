`use strict`

const model = 'resort'
const table = 'resorts'

const controller = require(`express`).Router({mergeParams : true})

const Op = require('sequelize').Op
const sequelize = require('@helpers/database')
const middleware = require('@helpers/middleware')
const xendit = require('@helpers/xendit')

const mainModel = require('@models').liveaboard
const room = require('@models').room
const schedule = require('@models').schedule
const scheduleStatus = require('@models').schedule_status
const packageData = require('@models').package
const user = require('@models').user
const logType = require('@models').log_type
const logActivity = require(`@models`).log_activity

controller.get(`/`, async (req,res) => {

  let getData = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    },
    include : [
      {
        model : room,
        where : {
          active : true
        },
        required:false
      },
      {
        model : packageData,
        include : [
          {
            model : schedule,
            include : [
              {
                model : scheduleStatus,
              },
            ],
          },
        ],
        where : {
          active : true
        },
        required:false
      }
    ]
  })

  if(!getData) return res.status(200).send({success: false, message: "Destination not found"})

  

  res.status(200).send({
      success : true,
      message : `success get country id : ${req.params.id}`,
      data : getData
  })
})

controller.post(`/`, async (req,res) => {
    res.status(200).send({
        success : true,
        message : `Create ${model} successfully id : ${req.params.id}`
    })
})

controller.put(`/`, middleware.checkToken, async (req,res) => {

  let {
    profile,
    highlight,
    photos,
    amenities,
    unavailable_dates,
    publish
  } = req.body

  if(!profile || !highlight || !photos || !amenities || !publish) return res.send(403).send({success: false, message: "Invalid body"})

  const getData = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    }
  })

  if(!getData) return res.status(200).send({success : false, message : "Data Not Found"})

  var paramData = {}
  paramData.profile = profile
  paramData.highlight = highlight
  paramData.photos = photos
  paramData.amenities = amenities
  paramData.unavailable_dates = unavailable_dates
  paramData.publish = publish

  paramData.updated_by = {
    id : req.decoded.id,
    type : "User Website",
    description : `User update new ${model}`
  }
  paramData.updated_at = new Date()

  let updateData = await mainModel.update(paramData, {
    where : {
      id : { [Op.eq] : req.params.id }
    }
  })

  if(!updateData) return res.status(500).send({success : false, message : `Accept ${model} failed`})

  const checkUpdate = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    }
  })

  if(!checkUpdate) return res.status(200).send({success : false, message : "Data Not Found"})

  // Get log type private
  const dataLogType = await logType.findOne({
    where : { name : {[Op.eq] : `Public`}}
  })

  //Condition log logType
  if(!dataLogType) return res.status(500).send({success : false, message:`Accept ${model} failed, please try again`})

  //Create Activity Log
  let dataLog = {model : model, old_data : getData.dataValues, new_data : checkUpdate.dataValues}

  let insertLog = await logActivity.create({
    log_type_id : dataLogType.id,
    name : `Update ${model}`,
    description : `User update ${model}`,
    data_log : dataLog,
    created_by : {
    type : "System",
    id : "",
    description : `System create log for updating ${model}`
    },
    updated_by : {
        type : "System",
        id : "",
        description : `System create log for updating ${model}`
    }
  })

  if(!insertLog) return res.status(500).send({success: false, message:`Accept ${model} failed, please try again`})

  res.status(200).send({
      success : true,
      message : `Accept ${model} successfully`,
  })
})

controller.delete(`/`, (req,res) => {
  res.status(200).send({
    success : true,
    message : `Delete ${model} successfully id : ${req.params.id}`
  })
})

controller.put(`/publish`, middleware.checkToken, async (req,res) => {

  let {
    publish
  } = req.body

  //if(!publish) return res.send(403).send({success: false, message: "Invalid body"})

  const getData = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    }
  })

  if(!getData) return res.status(200).send({success : false, message : "Data Not Found"})

  var paramData = {}
  paramData.publish = publish

  paramData.updated_by = {
    id : req.decoded.id,
    type : "User Website",
    description : `User update new ${model}`
  }
  paramData.updated_at = new Date()

  let updateData = await mainModel.update(paramData, {
    where : {
      id : { [Op.eq] : req.params.id }
    }
  })

  if(!updateData) return res.status(500).send({success : false, message : `Accept ${model} failed`})

  const checkUpdate = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    }
  })

  if(!checkUpdate) return res.status(200).send({success : false, message : "Data Not Found"})

  // Get log type private
  const dataLogType = await logType.findOne({
    where : { name : {[Op.eq] : `Public`}}
  })

  //Condition log logType
  if(!dataLogType) return res.status(500).send({success : false, message:`Accept ${model} failed, please try again`})

  //Create Activity Log
  let dataLog = {model : model, old_data : getData.dataValues, new_data : checkUpdate.dataValues}

  let insertLog = await logActivity.create({
    log_type_id : dataLogType.id,
    name : `Update ${model}`,
    description : `User update ${model}`,
    data_log : dataLog,
    created_by : {
    type : "System",
    id : "",
    description : `System create log for updating ${model}`
    },
    updated_by : {
        type : "System",
        id : "",
        description : `System create log for updating ${model}`
    }
  })

  if(!insertLog) return res.status(500).send({success: false, message:`Accept ${model} failed, please try again`})

  res.status(200).send({
      success : true,
      message : `Accept ${model} successfully`,
  })
})

module.exports = controller
