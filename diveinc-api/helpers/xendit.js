'use strict';

const Xendit = require('xendit-node');
const x = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY || ''
});

const { Disbursement } = x;
const disbursementSpecificOptions = {};
const d = new Disbursement(disbursementSpecificOptions);

const { Invoice } = x;
const invoiceSpecificOptions = {};
const i = new Invoice(invoiceSpecificOptions);

module.exports = {
    disbursment : async (data) => {        let disb = await d.create({
            externalID: data.id,
            bankCode: data.user_data.bank_name,
            accountHolderName: data.user_data.bank_account_name,
            accountNumber: data.user_data.bank_account_number,
            description: `Fisbusrt paid to ${data.user_data.bank_account_name}`,
            amount: data.total,
            emailTo: [data.user.profile.contact.email]
          });

        return disb;
    },
    invoice : async (data) => {
      let totalBayar = await loadItem(data);

      let invoice = await i.createInvoice({
          externalID: data.transaction_code,
          payerEmail: data.package_data.contact.email,
          description: `Invoice for ${data.type} Purchase`,
          amount: totalBayar,
          shouldSendEmail: false
        });

      return invoice;
  }
}

function loadItem(data) {

  var packageData = data.package_data
  var totalPrice = 0;

  if(data.type == "Liveaboard"){
      if(packageData.package){
        for(var i = 0; i< packageData.package.length; i++){
          var totalSummary = 0
          // var summaryPrice = parseFloat(packageData.package[i].packagePrice) * parseFloat(packageData.package[i].guest)
          // $(`#total${packageData.package[i].id}`).text(formatRupiah(summaryPrice))
          // totalSummary += summaryPrice

          for(var k = 0; k < packageData.package[i].service.length; k++){
              if(packageData.package[i].service[k].qty > 0){
                  // $(`#extra${packageData.package[i].id}`).append(`
                  //     <div class="list-person--item text-muted">
                  //         <div><i class="fas fa-plus fa-sm fas-fix mr-1"></i>${packageData.package[i].service[k].name} (IDR&nbsp;${formatRupiah(packageData.package[i].service[k].price)} x${packageData.package[i].service[k].qty})</div>
                  //         <div class="list-price">IDR&nbsp; ${formatRupiah(parseFloat(packageData.package[i].service[k].price) * parseFloat(packageData.package[i].service[k].qty))}</div>
                  //     </div>
                  // `)

                  totalSummary += (parseFloat(packageData.package[i].service[k].price) * parseFloat(packageData.package[i].service[k].qty))
              }
          }

          // $(`#summaryTotal${packageData.package[i].id}`).text(formatRupiah(totalSummary)) 
          totalPrice += totalSummary
      }
    }

    if(packageData.room){

      // var night = (new Date(packageData.room_date.to) - new Date(packageData.room_date.from)) / (1000 * 3600 * 24)

      for(var i = 0; i < packageData.room.length; i++){

        for(var j = 0; j < packageData.room[i].roomItem.length; j++){
            var totalSummary = 0
            
            var summaryPrice = 0
            
            summaryPrice =  parseFloat(packageData.room[i].roomItem[j].guest) * parseFloat(packageData.room[i].roomPrice)
            // $(`#total${packageData.room[i].roomItem[j].id}`).text(formatRupiah(summaryPrice))
            totalSummary += summaryPrice

            // $(`#summaryTotal${packageData.room[i].roomItem[j].id}`).text(formatRupiah(totalSummary)) 
            totalPrice += totalSummary
        }
      }
    }
  }else{
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
  }
  
  //$('#totalSummary').text(`IDR ${formatRupiah(totalPrice)}`)
  var task = totalPrice / 10
  //$('#taskTotal').text(`IDR ${formatRupiah(task)}`)
  //$('#totalPrice').text(`IDR ${formatRupiah(totalPrice + task)}`)

  return totalPrice + task
}