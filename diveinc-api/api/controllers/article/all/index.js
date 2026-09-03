`use strict`

const model = 'article'
const table = 'articles'
const env = process.env.NODE_ENV || 'test'

const controller = require(`express`).Router({mergeParams : true})
const jwt = require(`jsonwebtoken`)
const Op = require('sequelize').Op
const sequelize = require('@helpers/database')
const middleware = require('@helpers/middleware')

const mainModel = require('@models').article
const articleCategory = require('@models').article_category
const user = require('@models').user
const logType = require('@models').log_type
const logActivity = require(`@models`).log_activity

const uuid_validate = require("uuid-validate")

controller.get(`/`, async (req,res) => {

  let fetchData = await mainModel.findAll({
    where : {
      active : true
    },
    include : [
      articleCategory
    ] 
  })

  res.status(200).send({
      success : true,
      message : "Success",
      data : fetchData
  })
})

controller.post(`/`, middleware.checkToken, async (req,res) => {

  let {
    article_category_id,
    name,
    images,
    author,
    description,
  } = req.body

  if(!article_category_id || !name || !images || !author || !description) return res.status(403).send({success: false, message: "Invalid body"})

  var paramData = {}
  paramData.article_category_id = article_category_id
  paramData.name = name
  paramData.images = images
  paramData.author = author
  paramData.description = description

  paramData.created_by = {
    id : req.decoded.id,
    type : "User Website",
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

controller.get(`/datatable`, async (req,res) => {
    
  let query = req.query

  let draw = query.draw

  let totalData = await sequelize.query(`SELECT COUNT(*) FROM ${table}
    WHERE active = true`, {
      type : sequelize.QueryTypes.SELECT
  })

  var paramQuery = `WHERE m.active = true`
  var param = {
      active : true
  }

  var orderQuery = `ORDER BY updated_at DESC`
  var order = [[`updated_at`, 'desc']] 

  if(query.search.value != `` && query.search.value != null){
      paramQuery = `${paramQuery} AND (m.name ILIKE '%${query.search.value}%' OR m.author ILIKE '%${query.search.value}%' OR ac.name ILIKE '%${query.search.value}%')`
      param = {
          active : true,
          [Op.or] : [
              {name : { [Op.iLike] : `%${query.search.value}%`}},
              {author : { [Op.iLike] : `%${query.search.value}%`}},
              {'$article_categories.name$' : { [Op.iLike] : `%${query.search.value}%`}}
          ]
      }
  }

  // Type of Order
  switch (query.order[0].column) {
      case '0':
          orderQuery = `ORDER BY m.name ${query.order[0].dir}, m.updated_at DESC`
          order.unshift([`name`, query.order[0].dir])
          break;
      case '1':
          orderQuery = `ORDER BY m.author ${query.order[0].dir}, m.updated_at DESC`
          order.unshift([`author`, query.order[0].dir])
          break;
      case '2':
          orderQuery = `ORDER BY ac.name ${query.order[0].dir}, m.updated_at DESC`
          order.unshift([`$article_categories.name$'`, query.order[0].dir])
      break;
      default:
          orderQuery = `ORDER BY m.updated_at ${query.order[0].dir}, m.updated_at DESC`
          order.unshift([`updated_at`, query.order[0].dir])
          break;
  }

  let totalFiltered = await sequelize.query(`SELECT 
  m.id, m.name, m.author, m.created_at, m.updated_at, m.article_category_id, ac.name
  FROM ${table} m 
  LEFT JOIN article_categories ac ON m.article_category_id = ac.id
  ${paramQuery} ${orderQuery}`, {
      type : sequelize.QueryTypes.SELECT
  })
  
  let fetchData= await mainModel.findAll({
      where : param,
      include : [
        {
          model : articleCategory,
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

// controller.get(`/publish`, async (req,res) => {

//   let fetchData = await mainModel.findAll({
//     where : {
//       active : true,
//       publish : true
//     },
//     include : [
//       {
//         model : articleCategory
//       }
//     ]
//   })

//   res.status(200).send({
//       success : true,
//       message : "Success",
//       data : fetchData
//   })
// })

module.exports = controller
