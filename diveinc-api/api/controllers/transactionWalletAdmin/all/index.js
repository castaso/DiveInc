`use strict`

const model = 'transaction_wallet_admin'
const table = 'transaction_wallet_admins'
const env = process.env.NODE_ENV || 'test'

const controller = require(`express`).Router({mergeParams : true})
const jwt = require(`jsonwebtoken`)
const Op = require('sequelize').Op
const { sanitizeSqlInput } = require('@helpers/sanitize')
const sequelize = require('@helpers/database')
const middleware = require('@helpers/middleware')

const mainModel = require('@models').transaction_wallet_admin
const user = require('@models').user
const transactionWalletAdminStatus = require('@models').transaction_wallet_admin_status
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

  if(sanitizeSqlInput(query.search.value) != `` && sanitizeSqlInput(query.search.value) != null){
      paramQuery = `${paramQuery} AND (m.type ILIKE '%${sanitizeSqlInput(query.search.value)}%' OR c.profile->'name'->'first_name' ILIKE '%${sanitizeSqlInput(query.search.value)}%' OR ts.name ILIKE '%${sanitizeSqlInput(query.search.value)}%' OR CAST(m.total as TEXT) ILIKE '%${sanitizeSqlInput(query.search.value)}%')`
      param = {
          active : true,
          [Op.or] : [
              {type : { [Op.iLike] : `%${sanitizeSqlInput(query.search.value)}%`}},
               {'$transaction_wallet_admin_status.name$' : { [Op.iLike] : `%${sanitizeSqlInput(query.search.value)}%`}},
              sequelize.literal(`u.profile->'name'->'first_name' ILIKE '%${sanitizeSqlInput(query.search.value)}%'`),
              sequelize.where(
                sequelize.cast(sequelize.col('total'), 'varchar'),
                    {[Op.like]: `%${sanitizeSqlInput(query.search.value)}%`}
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
  m.id, m.type, m.user_id, m.transaction_wallet_admin_status_id, m.total, ts.id, ts.name, u.id, u.profile
  FROM ${table} m 
  LEFT JOIN users u ON m.user_id = u.id
  LEFT JOIN transaction_wallet_admin_statuses ts ON m.transaction_wallet_admin_status_id = ts.id 
  ${paramQuery} ${orderQuery}`, {
      type : sequelize.QueryTypes.SELECT
  })
  
  let fetchData= await mainModel.findAll({
      where : param,
      include : [
        {
          model : transactionWalletAdminStatus,
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
    paramData.transaction_divecenter_status_id = 'bcc8ff37-468f-45cb-bccc-fd34cce4b8ac'
    paramData.payment_method = req.body
    paramData.xendit_fee = {
      total : parseFloat(req.body.paid_amount) - parseFloat(req.body.adjusted_received_amount),
    }
    paramData.total_money_income = (parseFloat(getData.dataValues.total_price) - parseFloat(getData.dataValues.diveinc_fee.fee_total) - parseFloat(getData.dataValues.diveinc_fee.task_total))
  }else if(transactionType == "Resort"){
    paramData.transaction_resort_status_id = 'bcc8ff37-468f-45cb-bccc-fd34cce4b8ac'
    paramData.payment_method = req.body
    paramData.xendit_fee = {
      total : parseFloat(req.body.paid_amount) - parseFloat(req.body.adjusted_received_amount),
    }
    paramData.total_money_income = (parseFloat(getData.dataValues.total_price) - parseFloat(getData.dataValues.diveinc_fee.fee_total) - parseFloat(getData.dataValues.diveinc_fee.task_total))
  }else if(transactionType == "Liveaboard"){
    paramData.transaction_liveaboard_status_id = 'bcc8ff37-468f-45cb-bccc-fd34cce4b8ac'
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
  if(transactionType == "Divecenter"){
    checkUpdate = await transactionDivecenter.findOne({
      where : {
        transaction_code : { [Op.eq] : req.body.external_id}
      }
    })
  }else if(transactionType == "Resort"){
    checkUpdate = await transactionResort.findOne({
      where : {
        transaction_code : { [Op.eq] : req.body.external_id}
      }
    })
  }else if(transactionType == "Liveaboard"){
    checkUpdate = await transactionLiveaboard.findOne({
      where : {
        transaction_code : { [Op.eq] : req.body.external_id}
      }
    })
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

  res.status(200).send({
      success : true,
      message : `Paid invoice`,
      data : checkUpdate
  })

  //res.status(200).send({success : true, message : "Paid Success"})
});

module.exports = controller
