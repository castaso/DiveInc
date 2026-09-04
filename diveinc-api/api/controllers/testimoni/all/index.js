`use strict`

const model = 'testimoni'
const table = 'testimonies'
const env = process.env.NODE_ENV || 'test'

const controller = require(`express`).Router({mergeParams : true})
const jwt = require(`jsonwebtoken`)
const Op = require('sequelize').Op
const { sanitizeSqlInput } = require('@helpers/sanitize')
const sequelize = require('@helpers/database')
const middleware = require('@helpers/middleware')

const mainModel = require('@models').testimoni
const user = require('@models').user
const logType = require('@models').log_type
const logActivity = require(`@models`).log_activity

const uuid_validate = require("uuid-validate")

controller.get(`/`, async (req,res) => {

  let fetchData = await mainModel.findAll({
    where : {
      active : true
    },
  })

  res.status(200).send({
      success : true,
      message : "Success",
      data : fetchData
  })
})

controller.post(`/`, middleware.checkToken, async (req,res) => {

  let {
    user_name,
    user_images,
    rate,
    comment
  } = req.body

  if(!user_name || !rate || !comment) return res.status(403).send({success: false, message: "Invalid body"})

  var paramData = {}
  paramData.user_name = user_name
  paramData.user_images = user_images
  paramData.rate = rate
  paramData.comment = comment

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

  var paramQuery = `WHERE active = true`
  var param = {
      active : true
  }

  var orderQuery = `ORDER BY updated_at DESC`
  var order = [[`updated_at`, 'desc']] 

  if(sanitizeSqlInput(query.search.value) != `` && sanitizeSqlInput(query.search.value) != null){
      paramQuery = `${paramQuery} AND (user_name ILIKE '%${sanitizeSqlInput(query.search.value)}%' OR CAST(rate as TEXT) ILIKE '%${sanitizeSqlInput(query.search.value)}%' OR comment ILIKE '%${sanitizeSqlInput(query.search.value)}%')`
      param = {
          active : true,
          [Op.or] : [
              {user_name : { [Op.iLike] : `%${sanitizeSqlInput(query.search.value)}%`}},
              {comment : { [Op.iLike] : `%${sanitizeSqlInput(query.search.value)}%`}},
              sequelize.where(
                sequelize.cast(sequelize.col('rate'), 'varchar'),
                    {[Op.like]: `%${sanitizeSqlInput(query.search.value)}%`}
              ),
          ]
      }
  }

  // Type of Order
  switch (query.order[0].column) {
      case '0':
          orderQuery = `ORDER BY user_name ${query.order[0].dir},updated_at DESC`
          order.unshift([`user_name`, query.order[0].dir])
          break;
      case '1':
          orderQuery = `ORDER BY rate ${query.order[0].dir}, updated_at DESC`
          order.unshift([`rate`, query.order[0].dir])
          break;
      case '2':
          orderQuery = `ORDER BY comment ${query.order[0].dir}, updated_at DESC`
          order.unshift([`comment`, query.order[0].dir])
      break;
      default:
          orderQuery = `ORDER BY m.updated_at ${query.order[0].dir}, updated_at DESC`
          order.unshift([`updated_at`, query.order[0].dir])
          break;
  }

  let totalFiltered = await sequelize.query(`SELECT *
  FROM ${table}
  ${paramQuery} ${orderQuery}`, {
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
