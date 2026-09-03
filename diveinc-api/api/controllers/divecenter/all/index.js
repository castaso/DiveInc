`use strict`

const model = 'divecenter'
const table = 'divecenters'
const env = process.env.NODE_ENV || 'test'

const controller = require(`express`).Router({mergeParams : true})
const jwt = require(`jsonwebtoken`)
const Op = require('sequelize').Op
const sequelize = require('@helpers/database')
const middleware = require('@helpers/middleware')

const mainModel = require('@models').divecenter
const dataPackage = require('@models').package
const user = require('@models').user
const logType = require('@models').log_type
const logActivity = require(`@models`).log_activity

const uuid_validate = require("uuid-validate")

controller.get(`/`, middleware.checkToken, async (req,res) => {

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
    profile,
    highlight,
    photos,
    unavailable_dates
  } = req.body

  if(!profile || !highlight || !photos) return res.status(403).send({success: false, message: "Invalid body"})

  var paramData = {}
  paramData.user_id = req.decoded.id
  paramData.profile = profile
  paramData.highlight = highlight
  paramData.photos = photos
  paramData.unavailable_dates = unavailable_dates

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
    
  // let query = req.query

  // let draw = query.draw

  // let totalData = await sequelize.query(`SELECT COUNT(*) FROM ${table}
  //   WHERE active = true`, {
  //     type : sequelize.QueryTypes.SELECT
  // })

  // var paramQuery = `WHERE m.active = true`
  // var param = {
  //     active : true
  // }

  // var orderQuery = `ORDER BY updated_at DESC`
  // var order = [[`updated_at`, 'desc']] 

  // if(query.search.value != `` && query.search.value != null){
  //     paramQuery = `${paramQuery} AND (m.type ILIKE '%${query.search.value}%' OR c.profile->'name'->'first_name' ILIKE '%${query.search.value}%' OR ts.name ILIKE '%${query.search.value}%' OR CAST(m.total as TEXT) ILIKE '%${query.search.value}%')`
  //     param = {
  //         active : true,
  //         [Op.or] : [
  //             {type : { [Op.iLike] : `%${query.search.value}%`}},
  //             {'$transaction_wallet_status.name$' : { [Op.iLike] : `%${query.search.value}%`}},
  //             sequelize.literal(`u.profile->'name'->'first_name' ILIKE '%${query.search.value}%'`),
  //             sequelize.where(
  //               sequelize.cast(sequelize.col('total'), 'varchar'),
  //                   {[Op.like]: `%${query.search.value}%`}
  //             ),
  //         ]
  //     }
  // }

  // // Type of Order
  // switch (query.order[0].column) {
  //     case '0':
  //         orderQuery = `ORDER BY m.type ${query.order[0].dir}, m.updated_at DESC`
  //         order.unshift([`type`, query.order[0].dir])
  //         break;
  //     case '1':
  //         orderQuery = `ORDER BY m.updated_at ${query.order[0].dir}, m.updated_at DESC`
  //         order.unshift([`updated_at`, query.order[0].dir])
  //         break;
  //     case '2':
  //         orderQuery = `ORDER BY m.updated_at ${query.order[0].dir}, m.updated_at DESC`
  //         order.unshift([`updated_at`, query.order[0].dir])
  //     break;
  //     case '3':
  //         orderQuery = `ORDER BY m.updated_at ${query.order[0].dir}, m.updated_at DESC`
  //         order.unshift([`updated_at`, query.order[0].dir])
  //     break;
  //     default:
  //         orderQuery = `ORDER BY m.updated_at ${query.order[0].dir}, m.updated_at DESC`
  //         order.unshift([`updated_at`, query.order[0].dir])
  //         break;
  // }

  // let totalFiltered = await sequelize.query(`SELECT 
  // m.id, m.type, m.user_id, m.transaction_wallet_status_id, m.total, ts.id, ts.name, u.id, u.profile
  // FROM ${table} m 
  // LEFT JOIN users u ON m.user_id = u.id
  // LEFT JOIN transaction_wallet_statuses ts ON m.transaction_wallet_status_id = ts.id 
  // ${paramQuery} ${orderQuery}`, {
  //     type : sequelize.QueryTypes.SELECT
  // })
  
  // let fetchData= await mainModel.findAll({
  //     where : param,
  //     include : [
  //       {
  //         model : transactionWalletStatus,
  //       },
  //       {
  //         model : user,
  //       },
  //     ],
  //     limit : query.length,
  //     offset : query.start,
  //     order : order
  // })

  // res.status(200).send({
  //     success : true,
  //     message : "Success",
  //     dataTableInfo : {
  //         draw : draw,
  //         recordsTotal : totalData[0].count,
  //         recordsFiltered : totalFiltered.length
  //     },
  //     data : fetchData
  //   })
})

controller.get(`/publish`, async (req,res) => {

  var whereData = {
    active : true,
    publish : true
  }

  if(req.query.destination){
    if(req.query.destination != ""){
      whereData = {
        active : true,
        publish : true,
        profile : {
          destination : {
            id : req.query.destination
          }
        }
      }
    }
  }

  if(req.query.sub_destination){
    if(req.query.sub_destination != ""){
      whereData = {
        active : true,
        publish : true,
        profile : {
          destination : {
            id : req.query.destination
          },
          sub_destination : {
            id : req.query.sub_destination,
          }
        }
      }
    }
  }

  let fetchData = await mainModel.findAll({
    where : whereData,
    include : [
      dataPackage
    ]
  })

  res.status(200).send({
      success : true,
      message : "Success",
      data : fetchData
  })
})

controller.get(`/my-divecenter`, middleware.checkToken, async (req,res) => {

  let fetchData = await mainModel.findAll({
    where : {
      active : true,
      user_id : req.decoded.id
    },
    include : [
      {
        model : dataPackage
      }
    ]
  })

  res.status(200).send({
      success : true,
      message : "Success",
      data : fetchData
  })
})

controller.get(`/sub-destination/:id`, async (req,res) => {

  let getData = await mainModel.findAll({
    where : {
      profile : {
        sub_destination : {
          id :  { [Op.eq] : req.params.id}
        }
      }
    },
    include : [
      {
        model : dataPackage
      }
    ]
  })

  if(!getData) return res.status(200).send({success: false, message: "Destination not found"})

  

  res.status(200).send({
      success : true,
      message : `success get resort id : ${req.params.id}`,
      data : getData
  })
})

module.exports = controller
