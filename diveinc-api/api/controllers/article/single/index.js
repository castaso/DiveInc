`use strict`

const model = 'article'
const table = 'articles'

const controller = require(`express`).Router({mergeParams : true})

const Op = require('sequelize').Op
const sequelize = require('@helpers/database')
const middleware = require('@helpers/middleware')
const xendit = require('@helpers/xendit')

const mainModel = require('@models').article
const articleCategory = require('@models').article_category
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
        model : articleCategory
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
    article_category_id,
    name,
    images,
    author,
    description,
  } = req.body

  if(!article_category_id || !name || !images || !author || !description) return res.status(403).send({success: false, message: "Invalid body"})

  const getData = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    }
  })

  if(!getData) return res.status(200).send({success : false, message : "Data Not Found"})

  var paramData = {}
  paramData.article_category_id = article_category_id
  paramData.name = name
  paramData.images = images
  paramData.author = author
  paramData.description = description

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

// controller.put(`/publish`, middleware.checkToken, async (req,res) => {

//   let {
//     publish
//   } = req.body

//   if(!publish) return res.status(403).send({success: false, message: "Invalid body"})

//   const getData = await mainModel.findOne({
//     where : {
//       id : { [Op.eq] : req.params.id}
//     }
//   })

//   if(!getData) return res.status(200).send({success : false, message : "Data Not Found"})

//   var paramData = {}
//   paramData.publish = publish

//   paramData.updated_by = {
//     id : req.decoded.id,
//     type : "User Website",
//     description : `User update new ${model}`
//   }
//   paramData.updated_at = new Date()

//   let updateData = await mainModel.update(paramData, {
//     where : {
//       id : { [Op.eq] : req.params.id }
//     }
//   })

//   if(!updateData) return res.status(500).send({success : false, message : `Accept ${model} failed`})

//   const checkUpdate = await mainModel.findOne({
//     where : {
//       id : { [Op.eq] : req.params.id}
//     }
//   })

//   if(!checkUpdate) return res.status(200).send({success : false, message : "Data Not Found"})

//   // Get log type private
//   const dataLogType = await logType.findOne({
//     where : { name : {[Op.eq] : `Public`}}
//   })

//   //Condition log logType
//   if(!dataLogType) return res.status(500).send({success : false, message:`Accept ${model} failed, please try again`})

//   //Create Activity Log
//   let dataLog = {model : model, old_data : getData.dataValues, new_data : checkUpdate.dataValues}

//   let insertLog = await logActivity.create({
//     log_type_id : dataLogType.id,
//     name : `Update ${model}`,
//     description : `User update ${model}`,
//     data_log : dataLog,
//     created_by : {
//     type : "System",
//     id : "",
//     description : `System create log for updating ${model}`
//     },
//     updated_by : {
//         type : "System",
//         id : "",
//         description : `System create log for updating ${model}`
//     }
//   })

//   if(!insertLog) return res.status(500).send({success: false, message:`Accept ${model} failed, please try again`})

//   res.status(200).send({
//       success : true,
//       message : `Accept ${model} successfully`,
//   })
// })

module.exports = controller
