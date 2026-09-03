`use strict`

const model = 'transaction_contribution'
const table = 'transaction_contributions'
const env = process.env.NODE_ENV || 'test'

const controller = require(`express`).Router({mergeParams : true})
const jwt = require(`jsonwebtoken`)
const Op = require('sequelize').Op
const sequelize = require('@helpers/database')
const middleware = require('@helpers/middleware')
const xendit = require('@helpers/xendit')

const mainModel = require('@models').transaction_contribution
const contribution = require('@models').contribution
const mainStatus = require('@models').transaction_contribution_status
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
        model : contribution
      }
    ]
  })

  if(!getData) return res.status(200).send({success: false, message: "Destination not found"})

  res.status(200).send({
      success : true,
      message : `success get contribution id detail : ${req.params.id}`,
      data : getData
  })
})

controller.post(`/`, async (req,res) => {
    res.status(200).send({
        success : true,
        message : `Create ${model} successfully id : ${req.params.id}`
    })
})

controller.delete(`/`, (req,res) => {
  res.status(200).send({
    success : true,
    message : `Delete ${model} successfully id : ${req.params.id}`
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
