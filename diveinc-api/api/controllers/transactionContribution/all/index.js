`use strict`

const model = 'transaction_contribution'
const table = 'transaction_contributions'
const tableStatus = 'transaction_contribution_statuses'
const env = process.env.NODE_ENV || 'test'

const controller = require(`express`).Router({mergeParams : true})
const jwt = require(`jsonwebtoken`)
const Op = require('sequelize').Op
const seq2 = require('sequelize')
const sequelize = require('@helpers/database')
const middleware = require('@helpers/middleware')

const mainModel = require('@models').transaction_contribution
const mainStatus = require('@models').transaction_contribution_status
const customer = require('@models').customer
const user = require('@models').user
const contribution = require('@models').contribution

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

  let {
    package_data,
    contribution_id
  } = req.body

  if(!package_data) return res.status(403).send({success: false, message: "Invalid body"})

  var paramData = {}
  paramData.contribution_id = contribution_id

  if(req.decoded){
    paramData.customer_id = req.decoded.id
  }
  paramData.package_data = package_data
  paramData.transaction_contribution_status_id = 'c7999dce-19b7-4bfd-84cc-d2f0845a3d86'
  paramData.transaction_code = `CTR${new Date().getTime()}`

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
  let contribution_id=query.id

  let totalData = await sequelize.query(`SELECT COUNT(*) 
    FROM ${table} m 
    JOIN ${tableStatus} ts ON m.transaction_contribution_status_id = ts.id
    JOIN contributions r ON m.contribution_id = r.id
    WHERE m.active = true AND m.contribution_id='${contribution_id}' AND r.user_id = '${req.decoded.id}'`, {
      type : sequelize.QueryTypes.SELECT
  })

  var paramQuery = `WHERE m.active = true AND m.contribution_id='${contribution_id}' AND r.user_id = '${req.decoded.id}' AND m.transaction_contribution_status_id NOT IN ('59cfbb65-efff-4d25-aae1-b439efa62188','d2f95bbe-159b-4447-9e07-33925e04c5e9', 'c7999dce-19b7-4bfd-84cc-d2f0845a3d86')`
  var param = {
      active : true,
      contribution_id : contribution_id,
      transaction_contribution_status_id : { [Op.notIn] : ["59cfbb65-efff-4d25-aae1-b439efa62188","d2f95bbe-159b-4447-9e07-33925e04c5e9","c7999dce-19b7-4bfd-84cc-d2f0845a3d86"]}
  }

  var orderQuery = `ORDER BY m.created_at DESC`
  var order = [[`created_at`, 'desc']] 

  if(query.search.value != `` && query.search.value != null){
    paramQuery = `${paramQuery} AND (m.transaction_code ILIKE '%${query.search.value}%')`
    param = {
        active : true,
        contribution_id : contribution_id,
        '$contribution.user_id$' : { [Op.eq] : `${req.decoded.id}`},
        transaction_contribution_status_id : { [Op.notIn] : ["59cfbb65-efff-4d25-aae1-b439efa62188","d2f95bbe-159b-4447-9e07-33925e04c5e9","c7999dce-19b7-4bfd-84cc-d2f0845a3d86"]},
        [Op.or] : [
            {transaction_code : { [Op.iLike] : `%${query.search.value}%`}}
        ]
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
    JOIN ${tableStatus} ts ON m.transaction_contribution_status_id = ts.id
    JOIN contributions r ON m.contribution_id = r.id
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

controller.get(`/datatable-admin`, async (req,res) => {
  
  let query = req.query
  let draw = query.draw
  //let contribution_id=query.id

  let totalData = await sequelize.query(`SELECT COUNT(*) 
    FROM ${table} m 
    JOIN ${tableStatus} ts ON m.transaction_contribution_status_id = ts.id
    JOIN contributions r ON m.contribution_id = r.id
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

  if(query.vendor != `` && query.vendor != null){
    paramQuery = `${paramQuery} AND (r.user_id = '${query.vendor}')`
    //param['$contribution.user_id$'] = query.vendor
    param = {
      ...param,
      '$contribution.user_id$' : query.vendor
    }
  }

  if(query.destination != `` && query.destination != null){
    paramQuery = `${paramQuery} AND (r.profile->'destination'->>'id' = '${query.destination}')`
    param = {
      ...param,
      [Op.and] : [seq2.literal(`contribution.profile->'destination'->>'id' = '${query.destination}'`)]
    }
  }

  if(query.sub_destination != `` && query.sub_destination != null){
    paramQuery = `${paramQuery} AND (r.profile->'sub-destination'->>'id' = '${query.sub_destination}')`
    param = {
      ...param,
      [Op.and] : [seq2.literal(`contribution.profile->'sub_destination'->>'id' = '${query.sub_destination}'`)]
    }
  }

  if(query.status != `` && query.status != null){
    paramQuery = `${paramQuery} AND (m.transaction_contribution_status_id = '${query.status}')`
    param = {
      ...param,
      transaction_contribution_status_id : query.status
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
    JOIN ${tableStatus} ts ON m.transaction_contribution_status_id = ts.id
    JOIN contributions r ON m.contribution_id = r.id
    ${paramQuery} ${orderQuery}`, {
        type : sequelize.QueryTypes.SELECT
  })
  
  let fetchData = await mainModel.findAll({
      where : param,
      include : [mainStatus, contribution],
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
