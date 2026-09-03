`use strict`

const model = 'transaction_resort'
const table = 'transaction_resorts'
const tableStatus = 'transaction_resort_statuses'
const env = process.env.NODE_ENV || 'test'

const controller = require(`express`).Router({mergeParams : true})
const jwt = require(`jsonwebtoken`)
const Op = require('sequelize').Op
const seq2 = require('sequelize')
const sequelize = require('@helpers/database')
const middleware = require('@helpers/middleware')

const general = require('@models').general
const mainModel = require('@models').transaction_resort
const mainStatus = require('@models').transaction_resort_status
const customer = require('@models').customer
const user = require('@models').user
const resort = require('@models').resort

const logType = require('@models').log_type
const logActivity = require(`@models`).log_activity

const uuid_validate = require("uuid-validate")

controller.get(`/`, middleware.checkToken, async (req,res) => {

  let fetchData = await mainModel.findAll({
    where : {
      active : true,
      created_by : {
        id : req.decoded.id
      }
    }
  })

  res.status(200).send({
      success : true,
      message : "Success",
      data : fetchData
  })
})

controller.post(`/`, middleware.checkToken, async (req,res) => {

  console.log(req.decoded)

  let {
    package_data,
    resort_id
  } = req.body

  if(!package_data) return res.status(403).send({success: false, message: "Invalid body"})

  var paramData = {}
  paramData.resort_id = resort_id
  if(req.decoded){
    paramData.customer_id = req.decoded.id
  }
  paramData.package_data = package_data
  paramData.transaction_resort_status_id = 'c7999dce-19b7-4bfd-84cc-d2f0845a3d86'
  paramData.transaction_code = `RST${new Date().getTime()}`

  paramData.created_by = {
    id : "",
    type : "Customer Website",
    description : `User create new ${model}`
  }
  paramData.created_at = new Date()

  let insertData = await mainModel.create(paramData)
  if(!insertData) return res.status(500).send({success : false, message : `Create ${model} failed`})

  // Get log type private
  const dataLogType = await logType.findOne({
    where : { name : {[Op.eq] : `Public`}}
  })

  //Condition log logType
  if(!dataLogType) return res.status(500).send({success : false, message:`Create ${model} failed, please try again`})

  //Create Activity Log
  let dataLog = {model : model, old_data : null, new_data : insertData}

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

  if(!insertLog) return res.status(500).send({success: false, message:"Create ${model}   failed, please try again"})

  res.status(200).send({
      success : true,
      message : `Create ${model} successfully`,
      data : insertData
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

controller.get(`/datatable-vendor`, middleware.checkToken, async (req,res) => {
    
  let query = req.query
  let draw = query.draw
  let resort_id = query.id

  // console.log("hai")
  let totalData = await sequelize.query(`SELECT COUNT(*) 
    FROM ${table} m 
    JOIN ${tableStatus} ts ON m.transaction_resort_status_id = ts.id
    JOIN resorts r ON m.resort_id = r.id
    WHERE m.active = true AND m.resort_id='${resort_id}' AND r.user_id = '${req.decoded.id}'`, {
      type : sequelize.QueryTypes.SELECT
  })
  // console.log("ha2")

  var paramQuery = `WHERE m.active = true AND m.resort_id='${resort_id}' AND r.user_id = '${req.decoded.id}' AND m.transaction_resort_status_id NOT IN ('59cfbb65-efff-4d25-aae1-b439efa62188','d2f95bbe-159b-4447-9e07-33925e04c5e9', 'c7999dce-19b7-4bfd-84cc-d2f0845a3d86')`
  var param = {
      active : true,
      resort_id : resort_id,
      transaction_resort_status_id : { [Op.notIn] : ["59cfbb65-efff-4d25-aae1-b439efa62188","d2f95bbe-159b-4447-9e07-33925e04c5e9","c7999dce-19b7-4bfd-84cc-d2f0845a3d86"]}
  }

  var orderQuery = `ORDER BY m.created_at DESC`
  var order = [[`created_at`, 'desc']] 

  if(query.search.value != `` && query.search.value != null){
      paramQuery = `${paramQuery} AND (m.transaction_code ILIKE '%${query.search.value}%')`
      param = {
          active : true,
          resort_id : resort_id,
          '$resort.user_id$' : { [Op.eq] : `${req.decoded.id}`},
          transaction_resort_status_id : { [Op.notIn] : ["59cfbb65-efff-4d25-aae1-b439efa62188","d2f95bbe-159b-4447-9e07-33925e04c5e9","c7999dce-19b7-4bfd-84cc-d2f0845a3d86"]},
          [Op.or] : [
              {transaction_code : { [Op.iLike] : `%${query.search.value}%`}}
          ]
      }
  }
  // console.log("ha3")

  // Type of Order
  switch (query.order[0].column) {
    default:
        orderQuery = `ORDER BY m.created_at DESC`
        order.unshift([`created_at`, 'desc'])
        break;
}

  let totalFiltered = await sequelize.query(`SELECT *
    FROM ${table} m 
    JOIN ${tableStatus} ts ON m.transaction_resort_status_id = ts.id
    JOIN resorts r ON m.resort_id = r.id
    ${paramQuery} ${orderQuery}`, {
        type : sequelize.QueryTypes.SELECT
  })
  
  let fetchData = await mainModel.findAll({
      where : param,
      include : [mainStatus],
      limit : query.length,
      offset : query.start,
      order : order
  })

  let generalData = await general.findOne({

  });
  
  console.log(totalData[0].count);

  res.status(200).send({
      success : true,
      message : "Success",
      general: generalData,
      dataTableInfo : {
          draw : draw,
          recordsTotal : totalData[0].count,
          recordsFiltered : totalFiltered.length
      },
      data : fetchData
    })
})

controller.get(`/datatable-admin`, async (req,res) => {
    
  let query = req.query
  let draw = query.draw

  console.log(query)
  let vendorId = query.vendor_id || '';

  let totalData = await sequelize.query(`SELECT COUNT(*) 
    FROM ${table} m 
    JOIN ${tableStatus} ts ON m.transaction_resort_status_id = ts.id
    JOIN resorts r ON m.resort_id = r.id
    WHERE m.active = true`, {
      type : sequelize.QueryTypes.SELECT
  })

  var paramQuery = `WHERE m.active = true`
  var param = {
      active : true
  }

  var orderQuery = `ORDER BY m.created_at DESC`
  var order = [[`created_at`, 'desc']] 

  if(query.search.value != `` && query.search.value != null){
    paramQuery = `${paramQuery} AND (m.transaction_code ILIKE '%${query.search.value}%')`
    param = {
        active : true,
        [Op.or] : [
            {transaction_code : { [Op.iLike] : `%${query.search.value}%`}}
        ]
    }
  }

  if(vendorId != `` && vendorId!= null){
    paramQuery = `${paramQuery} AND (r.user_id = '${vendorId}')`
    param = {
      ...param,
      '$resort.user_id$' : vendorId
    }
  }

  if(query.destination != `` && query.destination != null){
    paramQuery = `${paramQuery} AND (r.profile->'destination'->>'id' = '${query.destination}')`
    param = {
      ...param,
      [Op.and] : [seq2.literal(`resort.profile->'destination'->>'id' = '${query.destination}'`)]
    }
  }

  if(query.sub_destination != `` && query.sub_destination != null){
    paramQuery = `${paramQuery} AND (r.profile->'sub-destination'->>'id' = '${query.sub_destination}')`
    param = {
      ...param,
      [Op.and] : [seq2.literal(`resort.profile->'sub_destination'->>'id' = '${query.sub_destination}'`)]
    }
  }

  if(query.status != `` && query.status != null){
    paramQuery = `${paramQuery} AND (m.transaction_resort_status_id = '${query.status}')`
    param = {
      ...param,
      transaction_resort_status_id : query.status
    }
  }

  // Type of Order
  switch (query.order[0].column) {
      default:
          orderQuery = `ORDER BY m.created_at DESC`
          order.unshift([`created_at`, 'desc'])
          break;
  }

  let totalFiltered = await sequelize.query(`SELECT *
    FROM ${table} m 
    JOIN ${tableStatus} ts ON m.transaction_resort_status_id = ts.id
    JOIN resorts r ON m.resort_id = r.id
    ${paramQuery} ${orderQuery}`, {
        type : sequelize.QueryTypes.SELECT
  })
  
  let fetchData = await mainModel.findAll({
      where : param,
      include : [mainStatus, resort],
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

controller.get(`/status`, async (req,res) => {

  let fetchData = await mainStatus.findAll({
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

module.exports = controller
