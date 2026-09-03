`use strict`

const model = 'schedule'
const table = 'schedules'
const env = process.env.NODE_ENV || 'test'

const controller = require(`express`).Router({mergeParams : true})
const jwt = require(`jsonwebtoken`)
const Op = require('sequelize').Op
const sequelize = require('@helpers/database')
const middleware = require('@helpers/middleware')

const mainModel = require('@models').schedule
const package = require('@models').package
const liveaboard = require('@models').liveaboard
const scheduleStatus = require('@models').schedule_status
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
    parent_id,
    schedule_date,
  } = req.body

  const getSchedule = await package.findOne({
    where : {
      active : true,
      id : parent_id
    },
    include: [mainModel]
  })

  const getPackage = await package.findAll({
    where : {
      active : true,
      parent_id : getSchedule.dataValues.parent_id
    },
    include: [mainModel]
  });

  var dateTrim = schedule_date.split("-");
  var newDate = `${dateTrim[2]}-${dateTrim[1]}-${dateTrim[0]}`

  if(new Date(newDate) > new Date()){
    for(var x = 0; x < getPackage.length; x++){
      for(var i = 0; i < getPackage[x].dataValues.schedules.length; i++){
        // console.log(getSchedule.dataValues.schedules[i].dataValues)
        var dateTrim2 = getPackage[x].dataValues.schedules[i].dataValues.schedule_date.split("-");
        var newDate2 = `${dateTrim2[2]}-${dateTrim2[1]}-${dateTrim2[0]}`
  
        var oneDay = 24*60*60*1000;
  
        if(getPackage[x].dataValues.schedules[i].schedule_status_id != "59cfbb65-efff-4d25-aae1-b439efa62188"){
          if((((new Date(newDate).getTime() - new Date(newDate2).getTime()) / oneDay) >= -(parseInt(getPackage[x].dataValues.info.duration.day))) && ((new Date(newDate).getTime() - new Date(newDate2).getTime()) / oneDay) <= parseInt(getPackage[x].dataValues.info.duration.day)){
            return res.status(403).send({success: false, message: "Invalid date because the selected date conflicts with other schedules"})
          }
        }
      }
    }
  }else{
    return res.status(403).send({success: false, message: "Expired date"})
  }

  if(!parent_id || !schedule_date) return res.status(403).send({success: false, message: "Invalid body"})

  const getData = await mainModel.findOne({
    where : {
      schedule_date : { [Op.eq] : schedule_date},
      parent_id : parent_id,
      active:true
    }
  })

  if(getData) return res.status(200).send({success : false, message : "Date already scheduled"})


  var paramData = {}
  paramData.parent_id = parent_id
  paramData.schedule_date = schedule_date
  paramData.schedule_status_id = "c7999dce-19b7-4bfd-84cc-d2f0845a3d86"

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

// controller.get(`/datatable/:id`, async (req,res) => {
  
//   let query = req.query

//   let draw = query.draw

//   let totalData = await sequelize.query(`SELECT COUNT(*) FROM ${table}
//     WHERE active = true AND parent_id = '${req.params.id}'`, {
//       type : sequelize.QueryTypes.SELECT
//   })

//   var paramQuery = `WHERE m.parent_id = '${req.params.id}' AND m.active = true`
//   var param = {
//       active : true,
//       parent_id: {[Op.eq] : req.params.id}
//   }

//   var orderQuery = `ORDER BY updated_at DESC`
//   var order = [[`updated_at`, 'desc']] 

//   if(query.search.value != `` && query.search.value != null){
//       paramQuery = `${paramQuery} AND (m.schedule_date ILIKE '%${query.search.value}%' OR ss.name ILIKE '%${query.search.value}%'`
//       param = {
//           active : true,
//           parent_id: {[Op.eq] : req.params.id},
//           [Op.or] : [
//               {schedule_date : { [Op.iLike] : `%${query.search.value}%`}},
//               {'$schedule_status.name$' : { [Op.iLike] : `%${query.search.value}%`}},
//           ]
//       }
//   }

//   // Type of Order
//   switch (query.order[0].column) {
//       // case '0':
//       //     orderQuery = `ORDER BY m.updated_at ${query.order[0].dir}, m.updated_at DESC`
//       //     order.unshift([`type`, query.order[0].dir])
//       //     break;
//       // case '1':
//       //     orderQuery = `ORDER BY m.updated_at ${query.order[0].dir}, m.updated_at DESC`
//       //     order.unshift([`updated_at`, query.order[0].dir])
//       //     break;
//       // case '2':
//       //     orderQuery = `ORDER BY m.updated_at ${query.order[0].dir}, m.updated_at DESC`
//       //     order.unshift([`updated_at`, query.order[0].dir])
//       // break;
//       // case '3':
//       //     orderQuery = `ORDER BY m.updated_at ${query.order[0].dir}, m.updated_at DESC`
//       //     order.unshift([`updated_at`, query.order[0].dir])
//       // break;
//       default:
//           orderQuery = `ORDER BY m.updated_at ${query.order[0].dir}, m.updated_at DESC`
//           order.unshift([`updated_at`, query.order[0].dir])
//           break;
//   }

//   let totalFiltered = await sequelize.query(`SELECT 
//   m.id, m.parent_id, m.schedule_date, m.schedule_status_id, m.updated_at, m.active, ss.id, ss.name
//   FROM ${table} m 
//   LEFT JOIN schedule_statuses ss ON m.schedule_status_id = ss.id 
//   ${paramQuery} ${orderQuery}`, {
//       type : sequelize.QueryTypes.SELECT
//   })
  
//   let fetchData= await mainModel.findAll({
//       where : param,
//       include : [
//         {
//           model : scheduleStatus,
//         },
//       ],
//       limit : query.length,
//       offset : query.start,
//       order : order
//   })

//   res.status(200).send({
//       success : true,
//       message : "Success",
//       dataTableInfo : {
//           draw : draw,
//           recordsTotal : totalData[0].count,
//           recordsFiltered : totalFiltered.length
//       },
//       data : fetchData
//     })
// })

controller.get(`/datatable/:id`, async (req,res) => {
  
  let query = req.query

  let draw = query.draw

  let testData = await package.findOne({
    where : {
      id : req.params.id
    }
  })

  let parentId = req.params.id

  // console.log(testData.dataValues)

  let totalData = await sequelize.query(`SELECT COUNT(*) FROM ${table}
    WHERE active = true`, {
      type : sequelize.QueryTypes.SELECT
  })

  var paramQuery = `WHERE m.active = true AND p.parent_id = '${parentId}'`
  var param = {
      active : true,
      '$package.parent_id$': {[Op.eq] : parentId}
  }

  var orderQuery = `ORDER BY updated_at DESC`
  var order = [[`updated_at`, 'desc']] 

  if(query.search.value != `` && query.search.value != null){
      paramQuery = `${paramQuery} AND (m.schedule_date ILIKE '%${query.search.value}%' OR ss.name ILIKE '%${query.search.value}%'`
      param = {
          active : true,
          '$package.parent_id$': {[Op.eq] : parentId},
          [Op.or] : [
              {schedule_date : { [Op.iLike] : `%${query.search.value}%`}},
              {'$schedule_status.name$' : { [Op.iLike] : `%${query.search.value}%`}},
          ]
      }
  }

  // Type of Order
  switch (query.order[0].column) {
      // case '0':
      //     orderQuery = `ORDER BY m.updated_at ${query.order[0].dir}, m.updated_at DESC`
      //     order.unshift([`type`, query.order[0].dir])
      //     break;
      // case '1':
      //     orderQuery = `ORDER BY m.updated_at ${query.order[0].dir}, m.updated_at DESC`
      //     order.unshift([`updated_at`, query.order[0].dir])
      //     break;
      // case '2':
      //     orderQuery = `ORDER BY m.updated_at ${query.order[0].dir}, m.updated_at DESC`
      //     order.unshift([`updated_at`, query.order[0].dir])
      // break;
      // case '3':
      //     orderQuery = `ORDER BY m.updated_at ${query.order[0].dir}, m.updated_at DESC`
      //     order.unshift([`updated_at`, query.order[0].dir])
      // break;
      default:
          orderQuery = `ORDER BY m.updated_at ${query.order[0].dir}, m.updated_at DESC`
          order.unshift([`updated_at`, query.order[0].dir])
          break;
  }

  let totalFiltered = await sequelize.query(`SELECT 
  m.id, m.parent_id, m.schedule_date, m.schedule_status_id, m.updated_at, m.active, 
  ss.id, ss.name,
  p.id, p.info, p.parent_id
  FROM ${table} m 
  LEFT JOIN schedule_statuses ss ON m.schedule_status_id = ss.id
  LEFT JOIN packages p ON m.parent_id = p.id 
  ${paramQuery} ${orderQuery}`, {
      type : sequelize.QueryTypes.SELECT
  })
  
  let fetchData= await mainModel.findAll({
      where : param,
      include : [
        {
          model : scheduleStatus,
        },
        {
          model : package
        }
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

module.exports = controller
