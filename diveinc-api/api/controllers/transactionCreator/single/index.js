`use strict`

const model = 'transaction_creator'
const table = 'transaction_creators'

const controller = require(`express`).Router({mergeParams : true})

const Op = require('sequelize').Op
const sequelize = require('@helpers/database')
const middleware = require('@helpers/middleware')

const mainModel = require('@models').transaction_creator
const user = require('@models').user
const creatorStatus = require('@models').creator_status
const creatorType = require('@models').creator_type
const logType = require('@models').log_type
const logActivity = require(`@models`).log_activity

const template = require(`@helpers/template`)
const mailService = require(`@service/email`)

controller.get(`/`, async (req,res) => {

  let getData = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    }
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

controller.put(`/accept`, middleware.checkToken, async (req,res) => {

  const getData = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    },
    include : [creatorType]
  })

  if(!getData) return res.status(200).send({success : false, message : "Data Not Found"})

  const checkUser = await user.findOne({
    where : {
      id : { [Op.eq] : getData.dataValues.user_id}
    }
  })

  if(!checkUser) return res.status(200).send({success : false, message : "Data Not Found"})

  // Update Transaction Status
  var paramData = {}
  paramData.creator_status_id = "59cfbb65-e7cf-4d25-aae1-b439efa62188"
  paramData.updated_by = {
    id : req.decoded.id,
    type : "Admin",
    description : `Admin accept this register vendor`
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

  // Update User 
  var paramDataUser = {}
  
  var profileData = checkUser.dataValues.profile
  for(var i = 0; i < profileData.permission.length; i++){
    if(profileData.permission[i].creator_type_id == getData.dataValues.creator_type_id){
      profileData.permission[i].creator_status_id = "59cfbb65-e7cf-4d25-aae1-b439efa62188"
      profileData.permission[i].data = getData.dataValues.data
    }
  }
  paramDataUser.profile = profileData
  paramDataUser.updated_by = {
    id : "",
    type : "System",
    description : `System update data user triger by accept vendor register`
  }
  paramDataUser.updated_at = new Date()

  let updateDataUser = await user.update(paramDataUser, {
    where : {
      id : { [Op.eq] : checkUser.dataValues.id}
    }
  })

  if(!updateDataUser) return res.status(500).send({success : false, message : `Accept ${model} failed`})

  const checkUpdateUser = await user.findOne({
    where : {
      id : { [Op.eq] : checkUser.dataValues.id}
    }
  })

  if(!checkUpdateUser) return res.status(200).send({success : false, message : "Data Not Found"})

  // Get log type private
  const dataLogType = await logType.findOne({
    where : { name : {[Op.eq] : `Public`}}
  })

  //Condition log logType
  if(!dataLogType) return res.status(500).send({success : false, message:`Accept ${model} failed, please try again`})

  //Create Activity Log
  let dataLog = {model : model, old_wdata : getData.dataValues, new_data : checkUpdate.dataValues}
  let dataLogUser = {model : 'user', old_wdata : checkUser.dataValues, new_data : checkUpdateUser.dataValues}

  let insertLog = await logActivity.create({
    log_type_id : dataLogType.id,
    name : `Accept ${model}`,
    description : `User accept new ${model}`,
    data_log : dataLog,
    created_by : {
    type : "System",
    id : "",
    description : `System create log for accept ${model}`
    },
    updated_by : {
        type : "System",
        id : "",
        description : `System create log for accept ${model}`
    }
  })

  let insertLogUser = await logActivity.create({
    log_type_id : dataLogType.id,
    name : `Update user`,
    description : `User update trigger by accept data`,
    data_log : dataLogUser,
    created_by : {
    type : "System",
    id : "",
    description : `User update trigger by accept data`
    },
    updated_by : {
        type : "System",
        id : "",
        description : `User update trigger by accept data`
    }
  })

  if(!insertLog) return res.status(500).send({success: false, message:`Accept ${model} failed, please try again`})
  if(!insertLogUser) return res.status(500).send({success: false, message:`Accept ${model} failed, please try again`})

  let sendEmail = await template.emailRegisterCreatorAccept(checkUser.dataValues.profile.contact.email, getData.dataValues.creator_type.name)
  mailService(sendEmail)

  res.status(200).send({
      success : true,
      message : `Accept ${model} successfully`,
  })
})

controller.put(`/reject`, middleware.checkToken, async (req,res) => {

  const getData = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    },
    include : [creatorType]
  })

  if(!getData) return res.status(200).send({success : false, message : "Data Not Found"})

  const checkUser = await user.findOne({
    where : {
      id : { [Op.eq] : getData.dataValues.user_id}
    }
  })

  if(!checkUser) return res.status(200).send({success : false, message : "Data Not Found"})

  // Update Transaction Status
  var paramData = {}
  paramData.creator_status_id = "b648ff73-468f-45cb-b7dc-fd3659e4b8ac"
  paramData.updated_by = {
    id : req.decoded.id,
    type : "Admin",
    description : `Admin accept this register vendor`
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

  // Update User 
  var paramDataUser = {}
  
  var profileData = checkUser.dataValues.profile
  for(var i = 0; i < profileData.permission.length; i++){
    if(profileData.permission[i].creator_type_id == getData.dataValues.creator_type_id){
      profileData.permission[i].creator_status_id = "b648ff73-468f-45cb-b7dc-fd3659e4b8ac"
    }
  }
  paramDataUser.profile = profileData
  paramDataUser.updated_by = {
    id : "",
    type : "System",
    description : `System update data user triger by accept vendor register`
  }
  paramDataUser.updated_at = new Date()

  let updateDataUser = await user.update(paramDataUser, {
    where : {
      id : { [Op.eq] : checkUser.dataValues.id}
    }
  })

  if(!updateDataUser) return res.status(500).send({success : false, message : `Accept ${model} failed`})

  const checkUpdateUser = await user.findOne({
    where : {
      id : { [Op.eq] : checkUser.dataValues.id}
    }
  })

  if(!checkUpdateUser) return res.status(200).send({success : false, message : "Data Not Found"})

  // Get log type private
  const dataLogType = await logType.findOne({
    where : { name : {[Op.eq] : `Public`}}
  })

  //Condition log logType
  if(!dataLogType) return res.status(500).send({success : false, message:`Accept ${model} failed, please try again`})

  //Create Activity Log
  let dataLog = {model : model, old_wdata : getData.dataValues, new_data : checkUpdate.dataValues}
  let dataLogUser = {model : 'user', old_wdata : checkUser.dataValues, new_data : checkUpdateUser.dataValues}

  let insertLog = await logActivity.create({
    log_type_id : dataLogType.id,
    name : `Accept ${model}`,
    description : `User accept new ${model}`,
    data_log : dataLog,
    created_by : {
    type : "System",
    id : "",
    description : `System create log for accept ${model}`
    },
    updated_by : {
        type : "System",
        id : "",
        description : `System create log for accept ${model}`
    }
  })

  let insertLogUser = await logActivity.create({
    log_type_id : dataLogType.id,
    name : `Update user`,
    description : `User update trigger by accept data`,
    data_log : dataLogUser,
    created_by : {
    type : "System",
    id : "",
    description : `User update trigger by accept data`
    },
    updated_by : {
        type : "System",
        id : "",
        description : `User update trigger by accept data`
    }
  })

  if(!insertLog) return res.status(500).send({success: false, message:`Accept ${model} failed, please try again`})
  if(!insertLogUser) return res.status(500).send({success: false, message:`Accept ${model} failed, please try again`})

  let sendEmail = await template.emailRegisterCreatorReject(checkUser.dataValues.profile.contact.email, getData.dataValues.creator_type.name)
  mailService(sendEmail)

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

module.exports = controller
