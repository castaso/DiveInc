`use strict`

const model = 'sub_destination'
const table = 'sub_destinations'
const env = process.env.NODE_ENV || 'test'

const controller = require(`express`).Router({mergeParams : true})

const Op = require('sequelize').Op
const middleware = require('@helpers/middleware')
const mainModel = require('@models').sub_destination
const destination = require('@models').destination
const creature = require('@models').creature
const logType = require('@models').log_type
const logActivity = require(`@models`).log_activity

controller.get(`/`, async (req,res) => {

  let getData = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    },
    include : [
      {
        model : destination,
        attributes : ["id", "name"]
      }
    ]  
  })

  let getDataCraeture = await creature.findAll({
  })

  console.log(getDataCraeture)

  if(!getData) return res.status(200).send({success: false, message: "Sub Destination not found"})

  getData.dataValues.dataCreature = getDataCraeture

  res.status(200).send({
      success : true,
      message : `success get ${model} id : ${req.params.id}`,
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
    destination_id,
    name,
    tag_line,
    description,
    introduction,
    highlight,
    image_background,
    image_showing,
    image_galery,
    about,
    more_about,
    more_info,
    article,
    diving_detail,
    creatures
  } = req.body

  if(!destination_id || !name || !tag_line || !description || !introduction 
    || !highlight || !image_background || !image_showing || !image_galery 
    || !about || !more_about || !more_info || !article || !diving_detail || !creatures) return res.status(403).send({success: false, message: "Invalid body"})

  const getData = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    }
  })

  if(!getData) return res.status(200).send({success : false, message : "Data Not Found"})

  var paramData = {}
  paramData.destination_id = destination_id
  paramData.name = name
  paramData.tag_line = tag_line
  paramData.description = description
  paramData.introduction = introduction
  paramData.highlight = highlight
  paramData.image_background = image_background
  paramData.image_showing = image_showing
  paramData.image_galery = image_galery
  paramData.about = about
  paramData.more_about = more_about
  paramData.more_info = more_info
  paramData.article = article
  paramData.diving_detail = diving_detail
  paramData.creatures = creatures

  paramData.updated_by = {
    id : req.decoded.id,
    type : "User Admin",
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

controller.delete(`/`, middleware.checkToken, async(req,res) => {
  const getData = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    }
  })

  if(!getData) return res.status(200).send({success : false, message : "Data Not Found"})

  var paramData = {}
  paramData.active = false

  paramData.deleted_by = {
    id : req.decoded.id,
    type : "User Admin",
    description : `User delete ${model}`
  }
  paramData.deleted_by = new Date()

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
    name : `Delete ${model}`,
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

controller.get(`/destination`, async (req,res) => {

  let getData = await mainModel.findAll({
    where : {
      active : true,
      destination_id : { [Op.eq] : req.params.id}
    },
    attributes : ["id","name"]
  })

  if(!getData) return res.status(200).send({success: false, message: "Destination not found"})

  res.status(200).send({
      success : true,
      message : `success get subdestination id : ${req.params.id}`,
      data : getData
  })
})

module.exports = controller
