`use strict`

const model = 'destination'
const table = 'destinations'
const env = process.env.NODE_ENV || 'test'

const controller = require(`express`).Router({mergeParams : true})
const jwt = require(`jsonwebtoken`)
const Op = require('sequelize').Op
const middleware = require('@helpers/middleware')
const sequelize = require('@helpers/database')

const mainModel = require('@models').destination
const country = require('@models').country
const logType = require('@models').log_type
const logActivity = require(`@models`).log_activity

const uuid_validate = require("uuid-validate")

controller.get(`/`, async (req,res) => {

  let fetchData = await mainModel.findAll({
    where : {
      active : true
    },
    attributes : ["id", "country_id", "name", "description", "image_showing", "created_at", "updated_at"],
    include : [
      {
        model : country,
        attributes : ["id", "name"]
      }
    ]  
  })

  res.status(200).send({
      success : true,
      message : "Success",
      data : fetchData
  })
})

controller.post(`/`, async (req,res) => {

  let {
    country_id,
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
    article
  } = req.body

  if(!country_id || !name || !tag_line || !description || !introduction 
    || !highlight || !image_background || !image_showing || !image_galery 
    || !about || !more_about || !more_info || !article) return res.status(403).send({success: false, message: "Invalid body"})

  let checkCountry = await country.findOne({
      where : {
        id : {[Op.eq] : country_id}
      }
  })

  if(!checkCountry) return res.status(200).send({success : false, message : `Country is not valid`})

  let checkData = await mainModel.findOne({
      where : {
        name : {[Op.eq] : name},
        tag_line : {[Op.eq] : tag_line},
        description : {[Op.eq] : description},
      }
  })

  if(checkData) return res.status(200).send({success : false, message : `${model} already exist`})

  var paramData = {}
  paramData.country_id = country_id
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
      tag_line : {[Op.eq] : tag_line},
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
      paramQuery = `${paramQuery} AND (name ILIKE '%${query.search.value}%' OR tag_line ILIKE '%${query.search.value}%' OR description ILIKE '%${query.search.value}%')`
      param = {
          active : true,
          [Op.or] : [
              {name : { [Op.iLike] : `%${query.search.value}%`}},
              {tag_line : { [Op.iLike] : `%${query.search.value}%`}},
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
          orderQuery = `ORDER BY tag_line ${query.order[0].dir}, updated_at DESC`
          order.unshift([`tag_line`, query.order[0].dir])
          break;
      case '2':
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

controller.get(`/for-cms`, async (req,res) => {

  let fetchData = await mainModel.findAll({
    where : {
      active : true
    },
    attributes : ["id", "country_id", "name"],
    include : [
      {
        model : country,
        attributes : ["id", "name"]
      }
    ]  
  })

  res.status(200).send({
      success : true,
      message : "Success",
      data : fetchData
  })
})

module.exports = controller
