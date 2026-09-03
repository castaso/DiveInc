`use strict`

const model = 'transaction_wallet_admin'
const table = 'transaction_wallet_admins'

const controller = require(`express`).Router({mergeParams : true})

const Op = require('sequelize').Op
const sequelize = require('@helpers/database')
const middleware = require('@helpers/middleware')
const xendit = require('@helpers/xendit')

const mainModel = require('@models').transaction_wallet_admin
const user = require('@models').user
const transactionWalletAdminStatus = require('@models').transaction_wallet_admin_status
const logType = require('@models').log_type
const logActivity = require(`@models`).log_activity

controller.put(`/`, middleware.checkToken, async (req,res) => {

  const getData = await mainModel.findOne({
    raw: true,
    nest: true,
    where : {
      id : { [Op.eq] : req.params.id}
    },
    include : [
      {
        model : user,
        attributes : ["id", "profile"]
      }
    ]
  })

  if(!getData) return res.status(200).send({success : false, message : "Data Not Found"})

  //Fungsi XENDIT
  let createDisburstment = await xendit.disbursment(getData)

  var paramData = {}
  paramData.transaction_wallet_admin_status_id = "d2f95bbe-159b-4447-9e07-33925e04c5e9"
  paramData.reason = req.body.reason


  paramData.updated_by = {
    id : req.decoded.id,
    type : "Admin",
    description : `Admin accept this withdrawl`
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
    name : `Accept ${model}`,
    description : `User accept new ${model}`,
    data_log : dataLog,
    created_by : {
    type : "System",
    id : "",
    description : `System create log for accept ${model}`
    },
    updated_by : {
        type : "System",
        id : "",
        description : `System create log for accept ${model}`
    }
  })

  if(!insertLog) return res.status(500).send({success: false, message:`Accept ${model} failed, please try again`})

  res.status(200).send({
      success : true,
      message : `Accept ${model} successfully`,
  })
})

module.exports = controller
