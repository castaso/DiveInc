`use strict`

const model = 'transaction_creator'
const table = 'transaction_creators'
const env = process.env.NODE_ENV || 'test'

const controller = require(`express`).Router({mergeParams : true})
const jwt = require(`jsonwebtoken`)
const Op = require('sequelize').Op
const sequelize = require('@helpers/database')
const middleware = require('@helpers/middleware')

const mainModel = require('@models').transaction_creator
const user = require('@models').user
const creatorStatus = require('@models').creator_status
const creatorType = require('@models').creator_type
const logType = require('@models').log_type
const logActivity = require(`@models`).log_activity

const uuid_validate = require("uuid-validate")

const template = require(`@helpers/template`)
const mailService = require(`@service/email`)

controller.get(`/`, async (req,res) => {

  let fetchData = await mainModel.findAll({
    where : {
      active : true
    }
  })

  res.status(200).send({
      success : true,
      message : "Success",
      data : fetchData
  })
})

controller.post(`/`, middleware.checkToken, async (req,res) => {

  let {
    type,
    file,
    data
  } = req.body

  if(!type || !file) return res.send(403).send({success: false, message: "Invalid body"})

  var typeId = ""
  if(type == "resort"){
    typeId = "c7199dce-19b7-4bfd-84cc-d2f0845a3d86"
  }else if(type == "liveaboards"){
    typeId = "d2f95bbe-159b-4d47-9e07-33925e04c5e9"
  }else if(type == "divecenter"){
    typeId = "59cfbb65-e7cf-4d25-aae1-b439efa62188"
  }else if(type == "contribution"){
    typeId = "b648ff73-468f-45cb-b7dc-fd3659e4b8ac"
  }else{
    return res.send(403).send({success: false, message: "Invalid body"})
  }

  var creatorStatus = "d2f95bbe-159b-4d47-9e07-33925e04c5e9"

  const checkUser = await user.findOne({
    where : {
      id : { [Op.eq] : req.decoded.id}
    }
  })

  if(!checkUser) return res.status(200).send({success : false, message : "Data Not Found"})

  var paramData = {}
  paramData.user_id = req.decoded.id
  paramData.creator_status_id = creatorStatus
  paramData.creator_type_id = typeId
  paramData.file = file
  paramData.data = data
  paramData.created_by = {
    id : req.decoded.id,
    type : "User Website",
    description : `User create new ${type}`
  }
  paramData.created_at = new Date()

  let insertData = await mainModel.create(paramData)
  if(!insertData) return res.status(500).send({success : false, message : `Create ${model} failed`})

  // Update User 
  var paramDataUser = {}
  
  var profileData = checkUser.dataValues.profile
  for(var i = 0; i < profileData.permission.length; i++){
    if(profileData.permission[i].creator_type_id == typeId){
      profileData.permission[i].creator_status_id = creatorStatus
    }

    console.log(profileData)
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
  if(!dataLogType) return res.status(500).send({success : false, message:`Create ${model} failed, please try again`})

  //Create Activity Log
  let dataLog = {model : model, old_data : null, new_data : insertData}
  let dataLogUser = {model : 'user', old_wdata : checkUser.dataValues, new_data : checkUpdateUser.dataValues}

  let insertLog = await logActivity.create({
    log_type_id : dataLogType.id,
    name : `Create ${model}`,
    description : `User create new ${model}`,
    data_log : dataLog,
    created_by : {
    type : "System",
    id : "",
    description : `System create log for creating new ${model}`
    },
    updated_by : {
        type : "System",
        id : "",
        description : `System create log for creating new ${model}`
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

  if(!insertLog) return res.status(500).send({success: false, message:`Create ${model} failed, please try again`})
  if(!insertLogUser) return res.status(500).send({success: false, message:`Accept ${model} failed, please try again`})

  let sendEmail = await template.emailRegisterCreator(checkUser.dataValues.profile.contact.email, type)
  mailService(sendEmail)

  let sendEmail2 = await template.emailRegisterCreatorForAdmin(checkUser.dataValues.profile.contact.email, type)
  mailService(sendEmail2)

  res.status(200).send({
      success : true,
      message : `Create ${model} successfully`,
  })
})

controller.put(`/`, (req,res) => {
  res.status(200).send({
      success : true,
      message : `Edit ${model} successfully`
  })
})

controller.delete(`/`, (req,res) => {
  res.status(200).send({
    success : true,
    message : `Delete ${model} successfully`
  })
})

controller.get(`/datatable`, async (req,res) => {
    
  let query = req.query

  let draw = query.draw

  let totalData = await sequelize.query(`SELECT COUNT(*) FROM ${table}
    WHERE active = true AND creator_status_id='d2f95bbe-159b-4d47-9e07-33925e04c5e9'`, {
      type : sequelize.QueryTypes.SELECT
  })

  var paramQuery = `WHERE m.active = true AND m.creator_status_id = 'd2f95bbe-159b-4d47-9e07-33925e04c5e9'`
  var param = {
      active : true,
      creator_status_id : 'd2f95bbe-159b-4d47-9e07-33925e04c5e9'
  }

  var orderQuery = `ORDER BY updated_at DESC`
  var order = [[`updated_at`, 'desc']] 

  if(query.search.value != `` && query.search.value != null){
      paramQuery = `${paramQuery} AND (ct.name ILIKE '%${query.search.value}%' OR cs.name ILIKE '%${query.search.value}%' OR c.profile->'contact'->'email' ILIKE '%${query.search.value}%'`
      param = {
          active : true,
          creator_status_id: 'd2f95bbe-159b-4d47-9e07-33925e04c5e9',
          [Op.or] : [
              {'$creator_type.name$' : { [Op.iLike] : `%${query.search.value}%`}},
              {'$creator_status.name$' : { [Op.iLike] : `%${query.search.value}%`}},
              sequelize.literal(`u.profile->'contact'->'email' ILIKE '%${query.search.value}%'`),
          ]
      }
  }

  // Type of Order
  switch (query.order[0].column) {
      case '0':
          orderQuery = `ORDER BY m.created_at DESC`
          order.unshift([`created_at`, 'desc'])
          break;
      default:
          orderQuery = `ORDER BY m.created_at DESC`
          order.unshift([`created_at`, 'desc'])
          break;
  }

  let totalFiltered = await sequelize.query(`SELECT 
  m.id, m.creator_type_id, m.user_id, m.creator_status_id, m.file, ct.id, ct.name, cs.id, cs.name, u.id, u.profile
  FROM ${table} m 
  LEFT JOIN users u ON m.user_id = u.id
  LEFT JOIN creator_types ct ON m.creator_type_id = ct.id
  LEFT JOIN creator_statuses cs ON m.creator_status_id = cs.id 
  ${paramQuery} ${orderQuery}`, {
      type : sequelize.QueryTypes.SELECT
  })
  
  let fetchData= await mainModel.findAll({
      where : param,
      include : [
        {
          model : creatorStatus,
        },
        {
          model : creatorType,
        },
        {
          model : user,
        },
      ],
      limit : query.length,
      offset : query.start,
      order : order
  })

  res.status(200).send({
      success : true,
      message : "Success",
      dataTableInfo : {
          draw : draw,
          recordsTotal : totalData[0].count,
          recordsFiltered : totalFiltered.length
      },
      data : fetchData
    })
})

controller.post(`/xendit-send`, async(req,res) => {
  console.log(req.body)
  res.status(200).send({success : true, message : "Sent Success"})
})

module.exports = controller
