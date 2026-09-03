`use strict`

const model = 'transaction_divecenter'
const table = 'transaction_divecenters'
const env = process.env.NODE_ENV || 'test'

const controller = require(`express`).Router({mergeParams : true})
const jwt = require(`jsonwebtoken`)
const Op = require('sequelize').Op
const sequelize = require('@helpers/database')
const middleware = require('@helpers/middleware')
const xendit = require('@helpers/xendit')

const mainModel = require('@models').transaction_divecenter
const divecenter = require('@models').divecenter
const mainStatus = require('@models').transaction_divecenter_status
const customer = require('@models').customer
const user = require('@models').user
const general = require('@models').general

//const room = require('@models').room
const packageData = require('@models').package

const logType = require('@models').log_type
const logActivity = require(`@models`).log_activity

const template = require(`@helpers/template`)
const mailService = require(`@service/email`)

function loadTask(data) {

  var packageData = data.package_data
  var totalPrice = 0;

  if(packageData.package){
      for(var i = 0; i< packageData.package.length; i++){

          for(var j = 0; j < packageData.package[i].packageItem.length; j++){
              var totalSummary = 0
              var summaryPrice = parseFloat(packageData.package[i].packagePrice) * parseFloat(packageData.package[i].packageItem[j].guest)
              // $(`#total${packageData.package[i].packageItem[j].id}`).text(formatRupiah(summaryPrice))
              totalSummary += summaryPrice

              for(var k = 0; k < packageData.package[i].packageItem[j].service.length; k++){
                  if(packageData.package[i].packageItem[j].service[k].qty > 0){
                      // $(`#extra${packageData.package[i].packageItem[j].id}`).append(`
                      //     <div class="list-person--item text-muted">
                      //         <div><i class="fas fa-plus fa-sm fas-fix mr-1"></i>${packageData.package[i].packageItem[j].service[k].name} (IDR&nbsp;${formatRupiah(packageData.package[i].packageItem[j].service[k].price)} x${packageData.package[i].packageItem[j].service[k].qty})</div>
                      //         <div class="list-price ml-2">IDR&nbsp; ${formatRupiah(parseFloat(packageData.package[i].packageItem[j].service[k].price) * parseFloat(packageData.package[i].packageItem[j].service[k].qty))}</div>
                      //     </div>
                      // `)

                      totalSummary += (parseFloat(packageData.package[i].packageItem[j].service[k].price) * parseFloat(packageData.package[i].packageItem[j].service[k].qty))
                  }
              }

              // $(`#summaryTotal${packageData.package[i].packageItem[j].id}`).text(formatRupiah(totalSummary)) 
              totalPrice += totalSummary
          }
      }
  }

  if(packageData.room){

    var night = (new Date(packageData.room_date.to) - new Date(packageData.room_date.from)) / (1000 * 3600 * 24)

    for(var i = 0; i < packageData.room.length; i++){
        
        for(var j = 0; j < packageData.room[i].roomItem.length; j++){
            var totalSummary = 0
            // $(`#night${packageData.room[i].roomItem[j].id}`).text(night)
            //var summaryPrice = parseFloat(night) * parseFloat(packageData.room[i].roomPrice)
            var summaryPrice = 0
            if(packageData.room[i].sharingRoom == "yes"){
                summaryPrice = parseFloat(night) * parseFloat(packageData.room[i].roomPrice) * parseFloat(packageData.room[i].roomItem[j].guest)
            }else{
                summaryPrice = parseFloat(night) * parseFloat(packageData.room[i].roomPrice)
            }
            // $(`#total${packageData.room[i].roomItem[j].id}`).text(formatRupiah(summaryPrice))
            totalSummary += summaryPrice

            for(var x = 0; x < packageData.room[i].roomItem[j].service.length; x++){
                if(packageData.room[i].roomItem[j].service[x].qty > 0){
                    // $(`#extra${packageData.room[i].roomItem[j].id}`).append(`
                    //     <div class="list-person--item text-muted">
                    //         <div class="mr-2"><i class="fas fa-plus fa-sm fas-fix mr-1"></i>${packageData.room[i].roomItem[j].service[x].name} (IDR&nbsp;${formatRupiah(packageData.room[i].roomItem[j].service[x].price)} x${packageData.room[i].roomItem[j].service[x].qty})</div>
                    //         <div class="list-price ml-2">IDR&nbsp;${formatRupiah(parseFloat(packageData.room[i].roomItem[j].service[x].price) * parseFloat(packageData.room[i].roomItem[j].service[x].qty))}</div>
                    //     </div>
                    // `)

                    totalSummary += (parseFloat(packageData.room[i].roomItem[j].service[x].price) * parseFloat(packageData.room[i].roomItem[j].service[x].qty))
                    // $(`#summaryTotal${packageData.room[i].roomItem[j].id}`).text(formatRupiah(totalSummary)) 
                }
            }

            totalPrice += totalSummary
        }
    }
  }
  
  
  //$('#totalSummary').text(`IDR ${formatRupiah(totalPrice)}`)
  var task = totalPrice / 10
  //$('#taskTotal').text(`IDR ${formatRupiah(task)}`)
  //$('#totalPrice').text(`IDR ${formatRupiah(totalPrice + task)}`)

  return task
}

function loadTotal(data) {

  var packageData = data.package_data
  var totalPrice = 0;

  if(packageData.package){
      for(var i = 0; i< packageData.package.length; i++){

          for(var j = 0; j < packageData.package[i].packageItem.length; j++){
              var totalSummary = 0
              var summaryPrice = parseFloat(packageData.package[i].packagePrice) * parseFloat(packageData.package[i].packageItem[j].guest)
              // $(`#total${packageData.package[i].packageItem[j].id}`).text(formatRupiah(summaryPrice))
              totalSummary += summaryPrice

              for(var k = 0; k < packageData.package[i].packageItem[j].service.length; k++){
                  if(packageData.package[i].packageItem[j].service[k].qty > 0){
                      // $(`#extra${packageData.package[i].packageItem[j].id}`).append(`
                      //     <div class="list-person--item text-muted">
                      //         <div><i class="fas fa-plus fa-sm fas-fix mr-1"></i>${packageData.package[i].packageItem[j].service[k].name} (IDR&nbsp;${formatRupiah(packageData.package[i].packageItem[j].service[k].price)} x${packageData.package[i].packageItem[j].service[k].qty})</div>
                      //         <div class="list-price ml-2">IDR&nbsp; ${formatRupiah(parseFloat(packageData.package[i].packageItem[j].service[k].price) * parseFloat(packageData.package[i].packageItem[j].service[k].qty))}</div>
                      //     </div>
                      // `)

                      totalSummary += (parseFloat(packageData.package[i].packageItem[j].service[k].price) * parseFloat(packageData.package[i].packageItem[j].service[k].qty))
                  }
              }

              // $(`#summaryTotal${packageData.package[i].packageItem[j].id}`).text(formatRupiah(totalSummary)) 
              totalPrice += totalSummary
          }
      }
  }

  if(packageData.room){

    var night = (new Date(packageData.room_date.to) - new Date(packageData.room_date.from)) / (1000 * 3600 * 24)

    for(var i = 0; i < packageData.room.length; i++){
        
        for(var j = 0; j < packageData.room[i].roomItem.length; j++){
            var totalSummary = 0
            // $(`#night${packageData.room[i].roomItem[j].id}`).text(night)
            //var summaryPrice = parseFloat(night) * parseFloat(packageData.room[i].roomPrice)
            var summaryPrice = 0
            if(packageData.room[i].sharingRoom == "yes"){
                summaryPrice = parseFloat(night) * parseFloat(packageData.room[i].roomPrice) * parseFloat(packageData.room[i].roomItem[j].guest)
            }else{
                summaryPrice = parseFloat(night) * parseFloat(packageData.room[i].roomPrice)
            }
            // $(`#total${packageData.room[i].roomItem[j].id}`).text(formatRupiah(summaryPrice))
            totalSummary += summaryPrice

            for(var x = 0; x < packageData.room[i].roomItem[j].service.length; x++){
                if(packageData.room[i].roomItem[j].service[x].qty > 0){
                    // $(`#extra${packageData.room[i].roomItem[j].id}`).append(`
                    //     <div class="list-person--item text-muted">
                    //         <div class="mr-2"><i class="fas fa-plus fa-sm fas-fix mr-1"></i>${packageData.room[i].roomItem[j].service[x].name} (IDR&nbsp;${formatRupiah(packageData.room[i].roomItem[j].service[x].price)} x${packageData.room[i].roomItem[j].service[x].qty})</div>
                    //         <div class="list-price ml-2">IDR&nbsp;${formatRupiah(parseFloat(packageData.room[i].roomItem[j].service[x].price) * parseFloat(packageData.room[i].roomItem[j].service[x].qty))}</div>
                    //     </div>
                    // `)

                    totalSummary += (parseFloat(packageData.room[i].roomItem[j].service[x].price) * parseFloat(packageData.room[i].roomItem[j].service[x].qty))
                    // $(`#summaryTotal${packageData.room[i].roomItem[j].id}`).text(formatRupiah(totalSummary)) 
                }
            }

            totalPrice += totalSummary
        }
    }
  }
  
  
  //$('#totalSummary').text(`IDR ${formatRupiah(totalPrice)}`)
  var task = totalPrice / 10
  //$('#taskTotal').text(`IDR ${formatRupiah(task)}`)
  //$('#totalPrice').text(`IDR ${formatRupiah(totalPrice + task)}`)

  return totalPrice + task
}

controller.get(`/`, async (req,res) => {

  let getData = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    },
    include : [
      mainStatus,
      {
        model : divecenter,
        include : [packageData]
      }
    ]
  })

  console.log('geDa',getData.dataValues.package_data);

  if(!getData) return res.status(200).send({success: false, message: "Destination not found"})

  res.status(200).send({
      success : true,
      message : `success get divecenter id detail : ${req.params.id}`,
      data : getData
  })
})

controller.post(`/`, async (req,res) => {
    res.status(200).send({
        success : true,
        message : `Create ${model} successfully id : ${req.params.id}`
    })
})

controller.put(`/schedule`, middleware.checkToken, async (req,res) => {

  let {
    package_data,
    begin_time
  } = req.body

  if(!package_data) return res.status(403).send({success: false, message: "Invalid body"})

  const getData = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    }
  })

  if(!getData) return res.status(200).send({success : false, message : "Data Not Found"})

  var paramData = {}
  paramData.package_data = package_data
  paramData.begin_time = begin_time
  paramData.transaction_divecenter_status_id = 'd2f95bbe-159b-4447-9e07-33925e04c5e9'

  paramData.updated_by = {
    id : "",
    type : "Customer Website",
    description : `User update new ${model}`
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
    name : `Update ${model}`,
    description : `User update ${model}`,
    data_log : dataLog,
    created_by : {
    type : "System",
    id : "",
    description : `System create log for updating ${model}`
    },
    updated_by : {
        type : "System",
        id : "",
        description : `System create log for updating ${model}`
    }
  })

  if(!insertLog) return res.status(500).send({success: false, message:`Accept ${model} failed, please try again`})

  res.status(200).send({
      success : true,
      message : `Accept ${model} successfully`,
      data : checkUpdate
  })
})

controller.put(`/extra`, middleware.checkToken, async (req,res) => {

  let {
    package_data
  } = req.body

  if(!package_data) return res.status(403).send({success: false, message: "Invalid body"})

  const getData = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    }
  })

  if(!getData) return res.status(200).send({success : false, message : "Data Not Found"})

  var paramData = {}
  paramData.package_data = package_data
  paramData.transaction_divecenter_status_id = '59cfbb65-efff-4d25-aae1-b439efa62188'

  paramData.updated_by = {
    id : "",
    type : "Customer Website",
    description : `User update new ${model}`
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
    name : `Update ${model}`,
    description : `User update ${model}`,
    data_log : dataLog,
    created_by : {
    type : "System",
    id : "",
    description : `System create log for updating ${model}`
    },
    updated_by : {
        type : "System",
        id : "",
        description : `System create log for updating ${model}`
    }
  })

  if(!insertLog) return res.status(500).send({success: false, message:`Accept ${model} failed, please try again`})

  res.status(200).send({
      success : true,
      message : `Accept ${model} successfully`,
      data : checkUpdate
  })
})

controller.put(`/guest`, middleware.checkToken, async (req,res) => {

  let {
    package_data
  } = req.body

  if(!package_data) return res.status(403).send({success: false, message: "Invalid body"})

  const getData = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    },
    include : [
      {
        model : divecenter,
        include : [
          {
            model : user
          }
        ]
      }
    ]
  })

  const generalData = await general.findOne({})

  if(!getData) return res.status(200).send({success : false, message : "Data Not Found"})

  var paramData = {}
  paramData.package_data = package_data
  // paramData.diveinc_fee = {
  //   percent : generalData.divecenter_fee,
  //   total : 0
  // }
  paramData.transaction_divecenter_status_id = 'b648ff73-468f-45cb-bbbc-fd3659e4b8ac'

  paramData.updated_by = {
    id : "",
    type : "Customer Website",
    description : `User update new ${model}`
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
    },
    include:[
      {
        model : divecenter,
        include : [
          {
            model : user
          }
        ]
      }
    ]
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
    name : `Update ${model}`,
    description : `User update ${model}`,
    data_log : dataLog,
    created_by : {
    type : "System",
    id : "",
    description : `System create log for updating ${model}`
    },
    updated_by : {
        type : "System",
        id : "",
        description : `System create log for updating ${model}`
    }
  })

  if(!insertLog) return res.status(500).send({success: false, message:`Accept ${model} failed, please try again`})

  let sendEmail = await template.emailDivecenterRequestForUser(checkUpdate.dataValues)
  let sendEmail2 = await template.emailDivecenterRequestForVendor(checkUpdate.dataValues, getData.dataValues.divecenter.dataValues.user.dataValues.data_register.data.email)
  mailService(sendEmail)
  mailService(sendEmail2)

  res.status(200).send({
      success : true,
      message : `Accept ${model} successfully`,
      data : checkUpdate
  })
})

controller.put(`/approve`, middleware.checkToken, async (req,res) => {

  const getData = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    }
  })

  const generalData = await general.findOne({})

  if(!getData) return res.status(200).send({success : false, message : "Data Not Found"})

  getData.dataValues.type = "Divecenter"
  // Panggil Xendit
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++")
  //Fungsi XENDIT
  let createInvoice = await xendit.invoice(getData.dataValues)
  console.log("======================================================")
  console.log(createInvoice)

  //return
  
  var paramData = {}
  paramData.transaction_divecenter_status_id = 'bbb8ff73-468f-45cb-babc-fd3444e4b8ac'
  paramData.total_price = loadTotal(getData.dataValues)
  paramData.diveinc_fee = {
    percent : generalData.divecenter_fee,
    task : 10,
    task_total : loadTask(getData.dataValues),
    fee_total : (loadTotal(getData.dataValues)-loadTask(getData.dataValues))*0.2
  }

  paramData.updated_by = {
    id : req.decoded.id,
    type : "Vendor Website",
    description : `User update new ${model}`
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
    name : `Update ${model}`,
    description : `User update ${model}`,
    data_log : dataLog,
    created_by : {
    type : "System",
    id : "",
    description : `System create log for updating ${model}`
    },
    updated_by : {
        type : "System",
        id : "",
        description : `System create log for updating ${model}`
    }
  })

  if(!insertLog) return res.status(500).send({success: false, message:`Accept ${model} failed, please try again`})

  checkUpdate.dataValues.email = createInvoice.payer_email
  checkUpdate.dataValues.link = createInvoice.invoice_url

  console.log(checkUpdate.dataValues)
  let sendEmail = await template.emailDivecenterApprove(checkUpdate.dataValues)
  mailService(sendEmail)

  res.status(200).send({
      success : true,
      message : `Accept ${model} successfully`,
      data : checkUpdate
  })
})

controller.delete(`/`, (req,res) => {
  res.status(200).send({
    success : true,
    message : `Delete ${model} successfully id : ${req.params.id}`
  })
})

controller.put(`/publish`, middleware.checkToken, async (req,res) => {

  const getData = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    }
  })

  if(!getData) return res.status(200).send({success : false, message : "Data Not Found"})

  var dataPublish = getData.publish
  if(dataPublish){
    dataPublish = false
  }else{
    dataPublish = true
  }
  var paramData = {}
  paramData.publish = dataPublish

  paramData.updated_by = {
    id : req.decoded.id,
    type : "User Website",
    description : `User update new ${model}`
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
    name : `Update ${model}`,
    description : `User update ${model}`,
    data_log : dataLog,
    created_by : {
    type : "System",
    id : "",
    description : `System create log for updating ${model}`
    },
    updated_by : {
        type : "System",
        id : "",
        description : `System create log for updating ${model}`
    }
  })

  if(!insertLog) return res.status(500).send({success: false, message:`Accept ${model} failed, please try again`})

  res.status(200).send({
      success : true,
      message : `Accept ${model} successfully`,
  })
})

controller.put(`/reject`, middleware.checkToken, async (req,res) => {

  const getData = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    }
  })

  if(!getData) return res.status(200).send({success : false, message : "Data Not Found"})

  var paramData = {}
  paramData.transaction_divecenter_status_id = 'bcc8ff73-468f-45cb-babc-fd34cce4b8ac'

  paramData.updated_by = {
    id : req.decoded.id,
    type : "Customer Website",
    description : `User update new ${model}`
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
    },
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
    name : `Cancel ${model}`,
    description : `User cancel ${model}`,
    data_log : dataLog,
    created_by : {
    type : "System",
    id : "",
    description : `System create log for updating ${model}`
    },
    updated_by : {
        type : "System",
        id : "",
        description : `System create log for updating ${model}`
    }
  })

  if(!insertLog) return res.status(500).send({success: false, message:`Cancel ${model} failed, please try again`})

  let sendEmail = await template.emailDivecenterRejected(checkUpdate.dataValues)
  mailService(sendEmail)

  res.status(200).send({
      success : true,
      message : `Cancel ${model} successfully`,
      data : checkUpdate
  })
})

controller.put(`/cancel`, middleware.checkToken, async (req,res) => {

  let {
    cancelation_data
  } = req.body

  // if(!cancelation_data) return res.status(403).send({success: false, message: "Invalid body"})

  const getData = await mainModel.findOne({
    where : {
      id : { [Op.eq] : req.params.id}
    }
  })

  if(!getData) return res.status(200).send({success : false, message : "Data Not Found"})

  var paramData = {}
  // paramData.package_data = package_data
  paramData.transaction_divecenter_status_id = 'baa8ff37-468f-455b-b5c5-fc34aae4b8ac'

  paramData.updated_by = {
    id : req.decoded.id,
    type : "Customer Website",
    description : `User update new ${model}`
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
    name : `Cancel ${model}`,
    description : `User cancel ${model}`,
    data_log : dataLog,
    created_by : {
    type : "System",
    id : "",
    description : `System create log for updating ${model}`
    },
    updated_by : {
        type : "System",
        id : "",
        description : `System create log for updating ${model}`
    }
  })

  if(!insertLog) return res.status(500).send({success: false, message:`Cancel ${model} failed, please try again`})

  res.status(200).send({
      success : true,
      message : `Cancel ${model} successfully`,
      data : checkUpdate
  })
})

module.exports = controller
