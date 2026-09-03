`use strict`

const model = 'country'
const table = 'countries'
const env = process.env.NODE_ENV || 'test'

const controller = require(`express`).Router({mergeParams : true})
const jwt = require(`jsonwebtoken`)
const Op = require('sequelize').Op
const sequelize = require('@helpers/database')
const middleware = require('@helpers/middleware')

const mainModel = require('@models').country
const logType = require('@models').log_type
const logActivity = require(`@models`).log_activity

const uuid_validate = require("uuid-validate")

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
    name,
    description
  } = req.body

  if(!description || !name) return res.send(403).send({success: false, message: "Invalid body"})

  let checkData = await mainModel.findOne({
      where : {
        name : {[Op.eq] : name},
        description : {[Op.eq] : description}
      }
  })

  if(checkData) return res.status(200).send({success : false, message : `${model} already exist`})

  var paramData = {}
  paramData.name = name
  paramData.description = description
  paramData.created_by = {
    id : "hardcode",
    type : "Admin",
    description : `hardcode create new ${model}`
  }
  paramData.created_at = new Date()

  let insertData = await mainModel.create(paramData)
  if(!insertData) return res.status(500).send({success : false, message : `Create ${model} failed`})

  let checkInsert = await mainModel.findOne({
    where : {
      name : {[Op.eq] : name},
      description : {[Op.eq] : description},
      active : true
    }
  })

  if(!checkInsert) return res.status(500).send({success : false, message : `Create ${model} failed`})

  // Get log type private
  const dataLogType = await logType.findOne({
    where : { name : {[Op.eq] : `Public`}}
  })

  //Condition log logType
  if(!dataLogType) return res.status(500).send({success : false, message:`Create ${model} failed, please try again`})

  //Create Activity Log
  let dataLog = {model : model, old_data : checkInsert.dataValues, new_data : checkInsert.dataValues}

  let insertLog = await logActivity.create({
    log_type_id : dataLogType.id,
    name : `Create ${model}`,
    description : `Hardcode create new ${model}`,
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
      data : checkInsert.dataValues
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

  let totalData = await sequelize.query(`SELECT COUNT(*) FROM ${table} WHERE active = true`, {
      type : sequelize.QueryTypes.SELECT
  })

  var paramQuery = `WHERE active = true`
  var param = {
      active : true
  }

  var orderQuery = `ORDER BY updated_at DESC`
  var order = [[`updated_at`, 'desc']] 

  if(query.search.value != `` && query.search.value != null){
      paramQuery = `${paramQuery} AND (name ILIKE '%${query.search.value}%' OR description ILIKE '%${query.search.value}%')`
      param = {
          active : true,
          [Op.or] : [
              {name : { [Op.iLike] : `%${query.search.value}%`}},
              {description : { [Op.iLike] : `%${query.search.value}%`}},
          ]
      }
  }

  // Type of Order
  switch (query.order[0].column) {
      case '0':
          orderQuery = `ORDER BY name ${query.order[0].dir}, updated_at DESC`
          order.unshift([`name`, query.order[0].dir])
          break;
      case '1':
          orderQuery = `ORDER BY description ${query.order[0].dir}, updated_at DESC`
          order.unshift([`description`, query.order[0].dir])
          break;
      default:
          orderQuery = `ORDER BY name ${query.order[0].dir}, updated_at DESC`
          order.unshift([`name`, query.order[0].dir])
          break;
  }

  let totalFiltered = await sequelize.query(`SELECT * FROM ${table} ${paramQuery} ${orderQuery}`, {
      type : sequelize.QueryTypes.SELECT
  })
  
  let fetchData= await mainModel.findAll({
      where : param,
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

module.exports = controller
