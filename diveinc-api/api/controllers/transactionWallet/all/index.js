`use strict`

const model = 'transaction_wallet'
const table = 'transaction_wallets'
const env = process.env.NODE_ENV || 'test'

const controller = require(`express`).Router({mergeParams : true})
const jwt = require(`jsonwebtoken`)
const Op = require('sequelize').Op
const sequelize = require('@helpers/database')
const middleware = require('@helpers/middleware')

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

const uuid_validate = require("uuid-validate")

const transactionWalletAdminStatus = require('@models').transaction_wallet_admin_status
const transactionWalletAdmin = require('@models').transaction_wallet_admin

const template = require(`@helpers/template`)
const mailService = require(`@service/email`)

controller.get(`/`, async (req,res) => {

  let fetchData = await mainModel.findAll({
    where : {
      active : true
    },
    attributes : ["id", "type", "total", "xendit_fee", "total_withdrawl", "created_at", "updated_at"]
  })

  res.status(200).send({
      success : true,
      message : "Success",
      data : fetchData
  })
})

controller.post(`/`, middleware.checkToken, async (req,res) => {

  let {
    type,
    creator_type_id,
    user_data,
    total
  } = req.body

  if(!type || !creator_type_id || !total || !user_data) return res.send(403).send({success: false, message: "Invalid body"})

  var xendit_fee = 5500

  var paramData = {}
  paramData.user_id = req.decoded.id
  paramData.transaction_wallet_status_id = "c7999dce-19b7-4bfd-84cc-d2f0845a3d86"
  paramData.creator_type_id = creator_type_id
  paramData.user_data = user_data
  paramData.type = type
  paramData.total = total
  paramData.xendit_fee = xendit_fee
  paramData.total_withdrawl = parseFloat(total) + parseFloat(xendit_fee)
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
      paramQuery = `${paramQuery} AND (m.type ILIKE '%${query.search.value}%' OR c.profile->'name'->'first_name' ILIKE '%${query.search.value}%' OR ts.name ILIKE '%${query.search.value}%' OR CAST(m.total as TEXT) ILIKE '%${query.search.value}%')`
      param = {
          active : true,
          [Op.or] : [
              {type : { [Op.iLike] : `%${query.search.value}%`}},
              {'$transaction_wallet_status.name$' : { [Op.iLike] : `%${query.search.value}%`}},
              sequelize.literal(`u.profile->'name'->'first_name' ILIKE '%${query.search.value}%'`),
              sequelize.where(
                sequelize.cast(sequelize.col('total'), 'varchar'),
                    {[Op.like]: `%${query.search.value}%`}
              ),
          ]
      }
  }

  // Type of Order
  switch (query.order[0].column) {
      case '0':
          orderQuery = `ORDER BY m.type ${query.order[0].dir}, m.updated_at DESC`
          order.unshift([`type`, query.order[0].dir])
          break;
      case '1':
          orderQuery = `ORDER BY m.updated_at ${query.order[0].dir}, m.updated_at DESC`
          order.unshift([`updated_at`, query.order[0].dir])
          break;
      case '2':
          orderQuery = `ORDER BY m.updated_at ${query.order[0].dir}, m.updated_at DESC`
          order.unshift([`updated_at`, query.order[0].dir])
      break;
      case '3':
          orderQuery = `ORDER BY m.updated_at ${query.order[0].dir}, m.updated_at DESC`
          order.unshift([`updated_at`, query.order[0].dir])
      break;
      default:
          orderQuery = `ORDER BY m.updated_at ${query.order[0].dir}, m.updated_at DESC`
          order.unshift([`updated_at`, query.order[0].dir])
          break;
  }

  let totalFiltered = await sequelize.query(`SELECT 
  m.id, m.type, m.user_id, m.transaction_wallet_status_id, m.total, ts.id, ts.name, u.id, u.profile
  FROM ${table} m 
  LEFT JOIN users u ON m.user_id = u.id
  LEFT JOIN transaction_wallet_statuses ts ON m.transaction_wallet_status_id = ts.id 
  ${paramQuery} ${orderQuery}`, {
      type : sequelize.QueryTypes.SELECT
  })
  
  let fetchData= await mainModel.findAll({
      where : param,
      include : [
        {
          model : transactionWalletStatus,
        },
        {
          model : user,
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

controller.post(`/xendit-send`, async(req,res) => {
  console.log(req.body)

  res.status(200).send({success : true, message : "Sent Success"})
})

controller.post('/paid', async(req,res) => {
  console.log(req.body)

  var getData;
  var transactionType = "";

  if(req.body.status != "PAID"){
    return res.status(200).send({success : false, message : "Paid transaction failed"}) 
  }

  var dataVendor
  var idUser
  var profileUser
  if(req.body.description.includes("Divecenter")){
    getData = await transactionDivecenter.findOne({
      where : {
        transaction_code : { [Op.eq] : req.body.external_id}
      }
    })
    transactionType = "Divecenter";

    dataVendor = await divecenter.findOne({
      where : {
        id : { [Op.eq] : getData.dataValues.divecenter_id}
      },
      include : [user]
    })
    idUser = dataVendor.dataValues.user.dataValues.id
    profileUser = dataVendor.dataValues.user.dataValues.profile 
    for(var i = 0; i < profileUser.permission.length; i++){
      if(profileUser.permission[i].type == "divecenter"){
        profileUser.permission[i].data.user.balance = parseFloat(profileUser.permission[i].data.user.balance) + (parseFloat(getData.dataValues.total_price) - parseFloat(getData.dataValues.diveinc_fee.fee_total) - parseFloat(getData.dataValues.diveinc_fee.task_total))
        //console.log(profileUser.permission[i].data.user)
      }
    }

  }else if(req.body.description.includes("Resort")){
    getData = await transactionResort.findOne({
      where : {
        transaction_code : { [Op.eq] : req.body.external_id}
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
        profileUser.permission[i].data.user.balance = parseFloat(profileUser.permission[i].data.user.balance) + (parseFloat(getData.dataValues.total_price) - parseFloat(getData.dataValues.diveinc_fee.fee_total) - parseFloat(getData.dataValues.diveinc_fee.task_total))
        //console.log(profileUser.permission[i].data.user)
      }
    }
  }else if(req.body.description.includes("Liveaboard")){
    getData = await transactionLiveaboard.findOne({
      where : {
        transaction_code : { [Op.eq] : req.body.external_id}
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
        profileUser.permission[i].data.user.balance = parseFloat(profileUser.permission[i].data.user.balance) + (parseFloat(getData.dataValues.total_price) - parseFloat(getData.dataValues.diveinc_fee.fee_total) - parseFloat(getData.dataValues.diveinc_fee.task_total))
        //console.log(profileUser.permission[i].data.user)
      }
    }
  }else{
    return res.status(403).send({success : false, message : "Description not match"}) 
  }

  var paramData = {}
  if(transactionType == "Divecenter"){
    paramData.transaction_divecenter_status_id = 'bccf8f37-486f-45cb-ccbc-fd34cce4b8ac'
    paramData.payment_method = req.body
    paramData.xendit_fee = {
      total : parseFloat(req.body.paid_amount) - parseFloat(req.body.adjusted_received_amount),
    }
    paramData.total_money_income = (parseFloat(getData.dataValues.total_price) - parseFloat(getData.dataValues.diveinc_fee.fee_total) - parseFloat(getData.dataValues.diveinc_fee.task_total))
  }else if(transactionType == "Resort"){
    paramData.transaction_resort_status_id = 'bccf8f37-486f-45cb-ccbc-fd34cce4b8ac'
    paramData.payment_method = req.body
    paramData.xendit_fee = {
      total : parseFloat(req.body.paid_amount) - parseFloat(req.body.adjusted_received_amount),
    }
    paramData.total_money_income = (parseFloat(getData.dataValues.total_price) - parseFloat(getData.dataValues.diveinc_fee.fee_total) - parseFloat(getData.dataValues.diveinc_fee.task_total))
  }else if(transactionType == "Liveaboard"){
    paramData.transaction_liveaboard_status_id = 'bccf8f37-486f-45cb-ccbc-fd34cce4b8ac'
    paramData.payment_method = req.body
    paramData.xendit_fee = {
      total : parseFloat(req.body.paid_amount) - parseFloat(req.body.adjusted_received_amount),
    }
    paramData.total_money_income = (parseFloat(getData.dataValues.total_price) - parseFloat(getData.dataValues.diveinc_fee.fee_total) - parseFloat(getData.dataValues.diveinc_fee.task_total))
  }else{
    return res.status(403).send({success : false, message : "Description not match"}) 
  }
  
  paramData.updated_by = {
    id : "Xendit",
    type : "Paid Invoice",
    description : `User update new ${transactionType} transaction`
  }
  paramData.updated_at = new Date()

  var updateData;
  // var updateUser;
  if(transactionType == "Divecenter"){
    updateData = await transactionDivecenter.update(paramData, {
      where : {
        transaction_code : { [Op.eq] : req.body.external_id}
      }
    })

    // updateUser = await user.update({profile: profileUser}, {
    //   where : {
    //     id : { [Op.eq] : idUser}
    //   }
    // })
  }else if(transactionType == "Resort"){
    updateData = await transactionResort.update(paramData, {
      where : {
        transaction_code : { [Op.eq] : req.body.external_id}
      }
    })

    // updateUser = await user.update({profile: profileUser}, {
    //   where : {
    //     id : { [Op.eq] : idUser}
    //   }
    // })
  }else if(transactionType == "Liveaboard"){
    updateData = await transactionLiveaboard.update(paramData, {
      where : {
        transaction_code : { [Op.eq] : req.body.external_id}
      }
    })

    // updateUser = await user.update({profile: profileUser}, {
    //   where : {
    //     id : { [Op.eq] : idUser}
    //   }
    // })
  }else{
    return res.status(403).send({success : false, message : "Description not match"}) 
  }
  
  if(!updateData) return res.status(500).send({success : false, message : `Paid transaction failed`})
  // if(!updateUser) return res.status(500).send({success : false, message : `Paid transaction failed`})

  var checkUpdate;
  var emailVendor;
  if(transactionType == "Divecenter"){
    checkUpdate = await transactionDivecenter.findOne({
      where : {
        transaction_code : { [Op.eq] : req.body.external_id}
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
        transaction_code : { [Op.eq] : req.body.external_id}
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
        transaction_code : { [Op.eq] : req.body.external_id}
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
  let sendEmail = await template.emailPaySuccsesForVendor(transactionType, emailVendor, checkUpdate.dataValues)
  mailService(sendEmail)

  let sendEmail2 = await template.emailPaySuccsesForUser(transactionType, req.body.payer_email, checkUpdate.dataValues)
  mailService(sendEmail2)

  res.status(200).send({
      success : true,
      message : `Paid invoice`,
      data : checkUpdate
  })

  //res.status(200).send({success : true, message : "Paid Success"})
});

controller.post('/disburst', async(req,res) => {
  console.log(req.body)

  const getData = await mainModel.findOne({
    raw: true,
    nest: true,
    where : {
      id : { [Op.eq] : req.body.external_id}
    },
    include : [
      {
        model : user,
        attributes : ["id", "profile"]
      }
    ]
  })

  if(!getData) return res.status(200).send({success : false, message : "Data Not Found"})

  var paramData = {}
  if(req.body.status == 'COMPLETED'){
    // if pending
    if(getData.transaction_wallet_status_id != 'b684ff73-486f-45cb-bbca-fd3459e4b8ac'){
      console.log("TIDAK PENDING");
      return res.status(403).send({success : false, message : "Double Notif From Xendit"})
    }
    console.log("MASUK COMPLETE");
    paramData.transaction_wallet_status_id = "b648ff73-468f-45cb-bbbc-fd3659e4b8ac"
  }else{
    if(req.body.status == "PENDING"){
      console.log("MASUK PENDING");
      paramData.transaction_wallet_status_id = "b684ff73-486f-45cb-bbca-fd3459e4b8ac"
    }else{
      console.log("MASUK PENDING ATAU GAGAL");
      paramData.transaction_wallet_status_id = "b648ff73-468f-45cb-bbbc-fd3659e4b8ac"
    }
  }
  
  paramData.updated_by = {
    id : "xendit",
    type : "Disburst",
    description : `Xendit send notification`
  }
  paramData.updated_at = new Date()

  console.log("HASIL YANG AKAN DIUPDATE")
  console.log(paramData)

  let updateData = await mainModel.update(paramData, {
    where : {
      id : { [Op.eq] : req.body.external_id }
    }
  })
  if(!updateData) return res.status(500).send({success : false, message : `Disburst failed`})

  if(req.body.status == 'COMPLETED'){

    if(getData.transaction_wallet_status_id != 'b684ff73-486f-45cb-bbca-fd3459e4b8ac'){
      return res.status(403).send({success : false, message : "Double Notif From Xendit"})
    }

    var dataUser
    var idUser
    var profileUser
    dataUser = await user.findOne({
      where : {
        id : { [Op.eq] : getData.user_id}
      }
    })
    idUser = dataUser.dataValues.id
    profileUser = dataUser.dataValues.profile
    for(var i = 0; i < profileUser.permission.length; i++){
      if(getData.creator_type_id == "59cfbb65-e7cf-4d25-aae1-b439efa62188"){
        if(profileUser.permission[i].type == "divecenter"){
          profileUser.permission[i].data.user.balance = parseFloat(profileUser.permission[i].data.user.balance) - parseFloat(getData.total_withdrawl)
          //console.log(profileUser.permission[i].data.user)
        }
      }else if(getData.creator_type_id == "c7199dce-19b7-4bfd-84cc-d2f0845a3d86"){
        if(profileUser.permission[i].type == "resort"){
          console.log(" ============================= ini perhitungan uang ==============================");
          console.log(profileUser.permission[i].data.user.balance)
          console.log(getData.total_withdrawl)
          profileUser.permission[i].data.user.balance = parseFloat(profileUser.permission[i].data.user.balance) - parseFloat(getData.total_withdrawl)
          //console.log(profileUser.permission[i].data.user)
          console.log("SAMA DENGAN")
          console.log(profileUser.permission[i].data.user.balance)
        }
      }else if(getData.creator_type_id == "d2f95bbe-159b-4d47-9e07-33925e04c5e9"){
        if(profileUser.permission[i].type == "liveaboards"){
          profileUser.permission[i].data.user.balance = parseFloat(profileUser.permission[i].data.user.balance) - parseFloat(getData.total_withdrawl)
        }
      }
      
    }

    const updateUser = await user.update({profile: profileUser}, {
      where : {
        id : { [Op.eq] : idUser}
      }
    })
  }

  const checkUpdate = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.body.external_id}
    }
  })

  if(!checkUpdate) return res.status(200).send({success : false, message : "Data Not Found"})

  // Get log type private
  const dataLogType = await logType.findOne({
    where : { name : {[Op.eq] : `Public`}}
  })

  //Condition log logType
  if(!dataLogType) return res.status(500).send({success : false, message:`Disburst failed, please try again`})

  //Create Activity Log
  let dataLog = {model : model, old_data : getData, new_data : checkUpdate.dataValues}

  let insertLog = await logActivity.create({
    log_type_id : dataLogType.id,
    name : `Disburst`,
    description : `Xendit send notification disburst`,
    data_log : dataLog,
    created_by : {
    type : "System",
    id : "",
    description : `System create log for disburst`
    },
    updated_by : {
        type : "System",
        id : "",
        description : `System create log for disburst`
    }
  })

  if(!insertLog) return res.status(500).send({success: false, message:`Disburst failed, please try again`})

  // Melakukan penarikan email vendor jeung admin

  res.status(200).send({
      success : true,
      message : `Disburst successfully`,
  })
  // res.status(200).send({success : true, message : "disburst Success"})
});

module.exports = controller
