`use strict`

const model = 'transaction_wallet'
const table = 'transaction_wallets'

const controller = require(`express`).Router({mergeParams : true})

const Op = require('sequelize').Op
const sequelize = require('@helpers/database')
const middleware = require('@helpers/middleware')
const xendit = require('@helpers/xendit')

const mainModel = require('@models').transaction_wallet
const user = require('@models').user
const transactionWalletStatus = require('@models').transaction_wallet_status
const logType = require('@models').log_type
const logActivity = require(`@models`).log_activity

const transactionDivecenter = require('@models').transaction_divecenter
const transactionDivecenterStatus = require('@models').transaction_divecenter_status
const transactionResort = require('@models').transaction_resort
const transactionResortStatus = require('@models').transaction_resort_status
const transactionLiveaboard = require('@models').transaction_liveaboard
const transactionLiveaboardStatus = require('@models').transaction_liveaboard_status

const divecenter = require('@models').divecenter
const resort = require('@models').resort
const liveaboard = require('@models').liveaboard

const creatorType = require('@models').creator_type

const template = require(`@helpers/template`)
const mailService = require(`@service/email`)


controller.get(`/`, async (req,res) => {

  let getData = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    }
  })

  if(!getData) return res.status(200).send({success: false, message: "Destination not found"})

  res.status(200).send({
      success : true,
      message : `success get country id : ${req.params.id}`,
      data : getData
  })
})

controller.post(`/`, async (req,res) => {
    res.status(200).send({
        success : true,
        message : `Create ${model} successfully id : ${req.params.id}`
    })
})

controller.put(`/accept`, middleware.checkToken, async (req,res) => {

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
  paramData.transaction_wallet_status_id = "d2f95bbe-159b-4447-9e07-33925e04c5e9"
  if(createDisburstment.status == "PENDING"){
    paramData.transaction_wallet_status_id = "b684ff73-486f-45cb-bbca-fd3459e4b8ac"
  }
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

controller.put(`/approved`, middleware.checkToken, async (req,res) => {

  var getData
  var dataVendor
  var idUser
  var profileUser

  var totalBalanceVendor
  if(req.body.type == "Divecenter"){

    console.log('masuk divecenter')
    getData = await transactionDivecenter.findOne({
      where : {
        id : { [Op.eq] : req.params.id}
      }
    })
    transactionType = "Divecenter";

    console.log(transactionType)

    dataVendor = await divecenter.findOne({
      where : {
        id : { [Op.eq] : getData.dataValues.divecenter_id}
      },
      include : [user]
    })
    idUser = dataVendor.dataValues.user.dataValues.id
    profileUser = dataVendor.dataValues.user.dataValues.profile 

    console.log(JSON.stringify(profileUser))
    for(var i = 0; i < profileUser.permission.length; i++){
      if(profileUser.permission[i].type == "divecenter"){
        console.log("Masuk logic")
        //profileUser.permission[i].data.user.balance = parseFloat(profileUser.permission[i].data.user.balance) + (parseFloat(getData.dataValues.total_price) - parseFloat(getData.dataValues.diveinc_fee.fee_total) - parseFloat(getData.dataValues.diveinc_fee.task_total))
        profileUser.permission[i].data.user.balance = parseFloat(profileUser.permission[i].data.user.balance) + parseFloat(req.body.ballance)
        //console.log(profileUser.permission[i].data.user)
        totalBalanceVendor = profileUser.permission[i].data.user.balance
      }
    }
    console.log(JSON.stringify(profileUser))

  }else if(req.body.type == "Resort"){
    getData = await transactionResort.findOne({
      where : {
        id : { [Op.eq] : req.params.id}
      }
    })
    transactionType = "Resort";

    dataVendor = await resort.findOne({
      where : {
        id : { [Op.eq] : getData.dataValues.resort_id}
      },
      include : [user]
    })
    idUser = dataVendor.dataValues.user.dataValues.id
    profileUser = dataVendor.dataValues.user.dataValues.profile 
    for(var i = 0; i < profileUser.permission.length; i++){
      if(profileUser.permission[i].type == "resort"){
        // profileUser.permission[i].data.user.balance = parseFloat(profileUser.permission[i].data.user.balance) + (parseFloat(getData.dataValues.total_price) - parseFloat(getData.dataValues.diveinc_fee.fee_total) - parseFloat(getData.dataValues.diveinc_fee.task_total))
        profileUser.permission[i].data.user.balance = parseFloat(profileUser.permission[i].data.user.balance) + parseFloat(req.body.ballance)
        //console.log(profileUser.permission[i].data.user)
        totalBalanceVendor = profileUser.permission[i].data.user.balance
      }
    }
  }else if(req.body.type == "Liveaboard"){
    getData = await transactionLiveaboard.findOne({
      where : {
        id : { [Op.eq] : req.params.id}
      }
    })
    transactionType = "Liveaboard";

    dataVendor = await liveaboard.findOne({
      where : {
        id : { [Op.eq] : getData.dataValues.liveaboard_id}
      },
      include : [user]
    })
    idUser = dataVendor.dataValues.user.dataValues.id
    profileUser = dataVendor.dataValues.user.dataValues.profile 
    for(var i = 0; i < profileUser.permission.length; i++){
      if(profileUser.permission[i].type == "liveaboards"){
        profileUser.permission[i].data.user.balance = parseFloat(profileUser.permission[i].data.user.balance) + parseFloat(req.body.ballance)
        //console.log(profileUser.permission[i].data.user)
        totalBalanceVendor = profileUser.permission[i].data.user.balance
      }
    }
  }else{
    return res.status(403).send({success : false, message : "Type not match"}) 
  }

  var paramData = {}
  if(transactionType == "Divecenter"){
    paramData.transaction_divecenter_status_id = 'bcc8ff37-468f-45cb-bccc-fd34cce4b8ac'
    paramData.payment_method = req.body
    paramData.xendit_fee = {
      total : parseFloat(req.body.paid_amount) - parseFloat(req.body.adjusted_received_amount),
    }
    paramData.total_money_income = parseFloat(req.body.ballance)
  }else if(transactionType == "Resort"){
    paramData.transaction_resort_status_id = 'bcc8ff37-468f-45cb-bccc-fd34cce4b8ac'
    paramData.payment_method = req.body
    paramData.xendit_fee = {
      total : parseFloat(req.body.paid_amount) - parseFloat(req.body.adjusted_received_amount),
    }
    paramData.total_money_income = parseFloat(req.body.ballance)
  }else if(transactionType == "Liveaboard"){
    paramData.transaction_liveaboard_status_id = 'bcc8ff37-468f-45cb-bccc-fd34cce4b8ac'
    paramData.payment_method = req.body
    paramData.xendit_fee = {
      total : parseFloat(req.body.paid_amount) - parseFloat(req.body.adjusted_received_amount),
    }
    paramData.total_money_income = parseFloat(req.body.ballance)
  }else{
    return res.status(403).send({success : false, message : "Description not match"}) 
  }
  
  paramData.updated_by = {
    id : "Admin",
    type : "Approved Ba;ance",
    description : `User update new ${transactionType} transaction`
  }
  paramData.updated_at = new Date()

  var updateData;
  var updateUser;
  if(transactionType == "Divecenter"){
    updateData = await transactionDivecenter.update(paramData, {
      where : {
        id : { [Op.eq] : req.params.id}
      }
    })

    updateUser = await user.update({profile: profileUser}, {
      where : {
        id : { [Op.eq] : idUser}
      }
    })
  }else if(transactionType == "Resort"){
    updateData = await transactionResort.update(paramData, {
      where : {
        id : { [Op.eq] : req.params.id}
      }
    })

    updateUser = await user.update({profile: profileUser}, {
      where : {
        id : { [Op.eq] : idUser}
      }
    })
  }else if(transactionType == "Liveaboard"){
    updateData = await transactionLiveaboard.update(paramData, {
      where : {
        id : { [Op.eq] : req.params.id}
      }
    })

    updateUser = await user.update({profile: profileUser}, {
      where : {
        id : { [Op.eq] : idUser}
      }
    })
  }else{
    return res.status(403).send({success : false, message : "Description not match"}) 
  }
  
  if(!updateData) return res.status(500).send({success : false, message : `Paid transaction failed`})
  if(!updateUser) return res.status(500).send({success : false, message : `Paid transaction failed`})

  var checkUpdate;
  var emailVendor;
  if(transactionType == "Divecenter"){
    checkUpdate = await transactionDivecenter.findOne({
      where : {
        id : { [Op.eq] : req.params.id}
      },
      include : [
        {
          model : divecenter,
          include : [user]
        },
      ]
    })
    emailVendor = checkUpdate.dataValues.divecenter.dataValues.user.dataValues.data_register.data.email
  }else if(transactionType == "Resort"){
    checkUpdate = await transactionResort.findOne({
      where : {
        id : { [Op.eq] : req.params.id}
      },
      include : [
        {
          model : resort,
          include : [user]
        },
      ]
    })
    emailVendor = checkUpdate.dataValues.resort.dataValues.user.dataValues.data_register.data.email
  }else if(transactionType == "Liveaboard"){
    checkUpdate = await transactionLiveaboard.findOne({
      where : {
        id : { [Op.eq] : req.params.id}
      },
      include : [
        {
          model : liveaboard,
          include : [user]
        },
      ]
    })
    emailVendor = checkUpdate.dataValues.liveaboard.dataValues.user.dataValues.data_register.data.email
  }else{
    return res.status(403).send({success : false, message : "Description not match"}) 
  }
  
  if(!checkUpdate) return res.status(200).send({success : false, message : "Data Not Found"})

  // Get log type private
  const dataLogType = await logType.findOne({
    where : { name : {[Op.eq] : `Public`}}
  })

  //Condition log logType
  if(!dataLogType) return res.status(500).send({success : false, message:`Paid ${transactionType} transaction failed, please try again`})

  //Create Activity Log
  let dataLog = {model : model, old_data : getData.dataValues, new_data : checkUpdate.dataValues}

  let insertLog = await logActivity.create({
    log_type_id : dataLogType.id,
    name : `Update ${transactionType} transaction`,
    description : `User update ${transactionType} transaction`,
    data_log : dataLog,
    created_by : {
    type : "System",
    id : "",
    description : `System create log for updating ${transactionType} transaction`
    },
    updated_by : {
        type : "System",
        id : "",
        description : `System create log for updating ${transactionType} transaction`
    }
  })

  if(!insertLog) return res.status(500).send({success: false, message:`Paid ${transactionType} failed, please try again`})

  // ambil dari payer email
  // checkUpdate.dataValues.email = createInvoice.payer_email
  // checkUpdate.dataValues.link = createInvoice.invoice_url

  // console.log(checkUpdate.dataValues)
  // let sendEmail = await template.emailResortApprove(checkUpdate.dataValues)
  // mailService(sendEmail)

  let sendEmail = await template.emailPayApproveForVendor(transactionType, emailVendor, checkUpdate.dataValues, req.body.ballance, totalBalanceVendor)
  mailService(sendEmail)

  let sendEmail2 = await template.emailPayApproveForAdmin(transactionType, checkUpdate.dataValues, req.body.ballance, totalBalanceVendor)
  mailService(sendEmail2)

  res.status(200).send({
      success : true,
      message : `Paid invoice`,
      data : checkUpdate
  })
})

controller.delete(`/`, (req,res) => {
  res.status(200).send({
    success : true,
    message : `Delete ${model} successfully id : ${req.params.id}`
  })
})

module.exports = controller
