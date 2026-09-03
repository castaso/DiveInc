`use strict`

const axios = require(`@service/axios`)

function parseCookies (request) { 
    var list = {},
        rc = request.headers.cookie

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=')
        list[parts.shift().trim()] = decodeURI(parts.join('='))
    });

    return list;
}

function formatRupiah(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

function dateFormatSM(tanggal){
    let tgl = tanggal.toString().substring(0,10).split('-');
    const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return tgl[2]+' '+monthNamesShort[tgl[1]-1]+' '+tgl[0];
  }

module.exports = {
    datatable : async (req,res,next) => {
        
        var cookie = parseCookies(req)
        // console.log('reqq',req);
        
        let result = await axios.call(`v1/transaction-resort/datatable-admin`, `GET`, null, cookie.accessToken, null, req._parsedUrl.query)
        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        
        // var data = []
        // for(var i = 0; i < result.data.data.length; i++){
        //     var totalPrice = 0;
            
        //     var oneData = []
        //     oneData.push(result.data.data[i].transaction_code)

        //     var htmlPurchaseDetail = ``
        //     if(result.data.data[i].package_data.hasOwnProperty('room')) {
        //         for(let room of result.data.data[i].package_data.room) {
        //             htmlPurchaseDetail += room.roomName + `<br>`
        //             totalPrice += Number(room.roomPrice)
    
        //             for(let item of room.roomItem) {
    
        //                 if(item.hasOwnProperty('service')) {
        //                     htmlPurchaseDetail += `Service:<ul style="list-style: none; padding-left: 20px;">`
        //                     for(let service of item.service) {
        //                         htmlPurchaseDetail += `<li>-` + service.name + ` x` + service.qty + `</li>`
        //                         totalPrice += Number(service.price)
        //                     }
        //                     htmlPurchaseDetail += `</ul>`
        //                 }
        //             }
        //         }
        //     }

        //     if(result.data.data[i].package_data.hasOwnProperty('package')) {
        //         for(let package of result.data.data[i].package_data.package) {
        //             htmlPurchaseDetail += package.packageName + `<br>`
        //             totalPrice += Number(package.packagePrice)
    
        //             if(package.hasOwnProperty('service')) {
        //                 htmlPurchaseDetail += `Service:<ul style="list-style: none; padding-left: 20px;">`
        //                 for(let service of package.service) {
        //                     htmlPurchaseDetail += `<li>-` + service.name + ` x` + service.qty + `</li>`
        //                     totalPrice += Number(service.price)
        //                 }
        //                 htmlPurchaseDetail += `</ul>`
        //             }
        //         }
        //     }
            
        //     oneData.push(htmlPurchaseDetail)

        //     if(result.data.data[i].package_data.hasOwnProperty('room_date')) {
        //         oneData.push(`From: ` + dateFormatSM(result.data.data[i].package_data.room_date.from) + `<br>To: ` + dateFormatSM(result.data.data[i].package_data.room_date.to) )
        //     }
        //     else {
        //         oneData.push(`-`)
        //     }

        //     oneData.push(`total : IDR ${formatRupiah(totalPrice)}<br>
        //         diveinc fee : IDR ${formatRupiah(totalPrice * 0.2)}<br>
        //         vendor income : IDR ${formatRupiah(totalPrice - (totalPrice * 0.2))}
        //     `)

        //     if(result.data.data[i].transaction_resort_status_id == "b648ff73-468f-45cb-bbbc-fd3659e4b8ac"){
        //         oneData.push(`Ordered`)
        //     }else{
        //         oneData.push(result.data.data[i].transaction_resort_status.description);
        //     }

        //     // console.log();

        //     if(result.data.data[i].transaction_resort_status_id == "bccf8f37-486f-45cb-ccbc-fd34cce4b8ac"){
        //         oneData.push(`
        //             <a href="#" onclick="approveBallance('${result.data.data[i].id}','${(totalPrice - (totalPrice * 0.2))}');">Approved</a><br>
        //             <a href="#" onclick="showData('${result.data.data[i].id}');">Show</a>
        //         `)
        //     }else{
        //         oneData.push(`
        //             <a href="#" onclick="showData('${result.data.data[i].id}');">Show</a>
        //         `)
        //     }
            
        //     data.push(oneData)
        // }

        var data = []
        let dataResult = result.data.data
        
        for(var x = 0; x < dataResult.length; x++){
            var oneData = []
            let created = dataResult[x].created_at.split('T');
            let tgl = created[0].split('-').reverse().join('-');
            let time = created[1].substr(0,8).split(':');
            oneData.push(`<p>${result.data.data[x].transaction_code}<br/>created : <br/>${tgl} ${(parseInt(time[0])+7)%24}:${time[1]}:${time[2]} WIB</p>`)
            // console.log(result.data.data[x].resort_id +' == '+ resort_id);
            //if (result.data.data[x].resort_id ==  resort_id) {
                var packageData = result.data.data[x].package_data
                
                // console.log('harga package',packageData.package);
                // console.log('harga room',packageData.room);
                var htmlTotal = ""
                var totalPrice = 0;
                var packDateList =[];

                // var packDate = packDateList.join(',');
                // console.log('pDate',packDateList,packDate);

                //===============================room=================================
                if(packageData.room){
                    if(packageData.room_date){
                        var night = (new Date(packageData.room_date.to) - new Date(packageData.room_date.from)) / (1000 * 3600 * 24)
                        let fromDate = (packageData.room_date.from ? packageData.room_date.from : '-')
                        fromDate = (fromDate != '-' ? dateFormatSM(fromDate) : '');
                        let toDate = (packageData.room_date.to ? packageData.room_date.to : '-')
                        toDate = (toDate != '-' ? dateFormatSM(toDate) : '');

                        var htmlRoom = ``
                        for(var i = 0; i < packageData.room.length; i++){
                            var htmlRoomItem = ``
                            htmlRoom = `<tr style='background:#9dccf5'><td colspan='2' style='padding:0px 5px;'><b>${packageData.room[i].roomName}</b></td></tr>`
                            var totalSummary = 0
                            for(var j = 0; j < packageData.room[i].roomItem.length; j++){
                                htmlRoomItem = `<tr><td style='padding:0px 5px; border:none' colspan='2'>Room ${j+1}</td></tr>`
                                htmlRoomItem = `<tr><td style='padding:0px 5px; border:none'>Guest </td><td style='padding:0px 5px; border:none; text-align:right'> x ${packageData.room[i].roomItem[j].guest}</td></tr>`
                                // var htmlService = `<tr><td style='padding:0px; border:none'>Service</td><td style='padding:0px; border:none'></td></tr>`
                                var htmlService = '';
                                var summaryPrice = parseFloat(night) * parseFloat(packageData.room[i].roomPrice)
                                var serviceContent = '';
                                totalSummary += summaryPrice
                                if(packageData.room[i].roomItem[j].service){
                                    for(var k = 0; k < packageData.room[i].roomItem[j].service.length; k++){
                                        if(packageData.room[i].roomItem[j].service[k].qty > 0){
                                            serviceContent += `<tr style='font-size:0.8em'><td style='padding:0px; padding-left:10px; border:none; '>+ ${packageData.room[i].roomItem[j].service[k].name}</td> <td style='padding:0px 5px; border:none; text-align:right'>x ${packageData.room[i].roomItem[j].service[k].qty}</td></tr>` 
                                            totalSummary += (parseFloat(packageData.room[i].roomItem[j].service[k].price) * parseFloat(packageData.room[i].roomItem[j].service[k].qty))
                                        }
                                    }
                                }
                                if (serviceContent == '') {
                                    // htmlService = `<tr><td style='padding:0px; border:none'>Service </td><td style='padding:0px; border:none'></td><td style='padding:0px; border:none'></td></tr>`
                                    htmlService = ``
                                    // serviceContent = `<tr><td style='padding:0px; border:none' colspan='3'>None</td></tr>` 
                                }
                                htmlService += serviceContent
                                htmlRoomItem += htmlService
                            }

                            console.log("Summary room +=",totalSummary);
                            console.log("totalPrice room  +=",totalPrice);
                            totalPrice += totalSummary
                            htmlRoom += htmlRoomItem
                        }

                        htmlTotal = (typeof htmlRoom !== 'undefined' ? htmlRoom : "");
                        oneData.push(`<table width='100%' style='font-size:0.9em'><tr><td style='padding:0px; border:none' colspan='2'><i class='fa fa-calendar'></i> : <span style='font-weight:bold'>${fromDate} - ${toDate}</span></td></tr>${htmlTotal}</table>`)
                    }else{
                        oneData.push("<small><i>no schedule set</i></small>")
                    }
                    
                    // htmlTotal = (typeof htmlPackage !== "undefined" ? htmlPackage : "") + (typeof htmlRoom !== 'undefined' ? htmlRoom : "");
                    
                    /* oneData.push(`
                        <h5>Package :</h5>
                        <p style="font-size:14px;">Date : ${(packDate == '' ?'-':packDate)}</p>
                        <h5>Room : </h5>
                        <p style="font-size:14px;">From : ${fromDate} </br> To : ${toDate}</p>`
                    ) */
        
                }else{
                    // oneData.push("-")
                    oneData.push("<small><i>no room</i></small>")
                }

                //===============================package=================================
                if(packageData.package && typeof packageData.package !== 'undefined'){
                    var htmlPackage = ``
                    for(var i = 0; i< packageData.package.length; i++){
                        var htmlPackageItem = ``
                        var totalSummary = 0
                        for (let pi_idx = 0; pi_idx < packageData.package[i].packageItem.length; pi_idx++) {
                            var summaryPrice = parseFloat(packageData.package[i].packagePrice) * parseFloat(packageData.package[i].packageItem[pi_idx].guest);
                            totalSummary += summaryPrice;
                            
                        }
                        var serviceContent = '';
                        for (let m = 0; m < packageData.package[i].packageItem.length; m++) {
                            if(packageData.package[i].packageItem[m].package_date){
                                htmlPackage = `<tr><td style='padding:0px; border:none' colspan='2'><i class='fa fa-calendar'></i> : <span style='font-weight:bold'>${dateFormatSM(packageData.package[i].packageItem[m].package_date)}</span></td></tr>`;
                                htmlPackage += `<tr style='background:#FFF44F'><td colspan='2' style='padding:0px 5px'><b>${packageData.package[i].packageName}</b></td></tr>`
                                htmlPackage += `<tr><td style='padding:0px 5px; border:none'>Guest </td><td style='padding:0px 5px; border:none; text-align:right'> x ${packageData.package[i].packageItem[m].guest}</td></tr>`
                            }
                            
                            // htmlService = `<tr><td style='padding:0px; border:none'>Service : </td><td style='padding:0px; border:none'></td><td style='padding:0px; border:none'></td></tr>`
                            htmlService = ``
                            let pck = packageData.package[i].packageItem[m];
                            packDateList.push(pck.package_date);
                            if(pck.service){
                                for(var k = 0; k < pck.service.length; k++){
                                    if(pck.service[k].qty > 0){
                                        serviceContent += `<tr style='font-size:0.8em'><td style='padding:0px; padding-left:5px; border:none'>+${pck.service[k].name}</td> <td style='padding:0px;padding-left:10px; border:none; '>x ${pck.service[k].qty}</td></tr>` 
                                        totalSummary += (parseFloat(pck.service[k].price) * parseFloat(pck.service[k].qty));
                                    }
                                }
                            }
                
                            htmlService += serviceContent
                            htmlPackageItem += htmlService
                            
                        }
        
                        //$(`#summaryTotal${packageData.package[i].id}`).text(totalSummary) 
                        console.log("Summary package +=",totalSummary);
                        console.log("totalPrice package  +=",totalPrice);
                        totalPrice += totalSummary
                        htmlPackage += htmlPackageItem
                        // console.log("totalPrice2 package  +=",totalPrice);
                        
                    }

                    oneData.push(`<table  width='100%' style='font-size:0.9em'>${htmlPackage}</table>`)

                }else{
                    oneData.push("<small><i>no package</i></small>")
                }

                oneData.push(`
                    Transaction price : IDR ${formatRupiah(totalPrice)}<br>
                    VAT : IDR ${formatRupiah(totalPrice * 0.1)}<br>
                    Total Transfer: IDR ${formatRupiah(Math.round(totalPrice*1.1*100)/100)}<br><br>
                    diveinc fee : IDR ${formatRupiah(totalPrice * 0.2)}<br>
                    Vendor income : IDR ${formatRupiah(totalPrice - (totalPrice * 0.2))}
                `)
                // oneData.push(`IDR ${formatRupiah(Math.round(totalPrice*1.1*100)/100 )}<br>
                //     <small style='font-size:0.7em'>(incl. fee : IDR ${formatRupiah(totalPrice * 0.2)})</small><br>
                // `);
                // oneData.push(`-`);
                /* oneData.push(`Total : IDR ${formatRupiah(totalPrice)}<br>
                    Diveinc fee : IDR ${formatRupiah(totalPrice * (general.resort_fee / 100))}<br>
                    Your income : IDR ${formatRupiah(totalPrice - (totalPrice * (general.resort_fee / 100)))}
                `) */
                // oneData.push(`IDR ${totalPrice + (totalPrice / 10)}`)
                // oneData.push(`IDR ${totalPrice + (totalPrice / 10)}`)
                let namaStatus = [];
                
                    namaStatus['c7999dce-19b7-4bfd-84cc-d2f0845a3d86'] = "created";
                    namaStatus['d2f95bbe-159b-4447-9e07-33925e04c5e9'] = "scheduled";
                    namaStatus['59cfbb65-efff-4d25-aae1-b439efa62188'] = "extra data";
                    namaStatus['b648ff73-468f-45cb-bbbc-fd3659e4b8ac'] = "ordered";
                    namaStatus['b648ff73-468f-45cb-babc-fd3459e4b8ac'] = "reserved";
                    namaStatus['bbb8ff73-468f-45cb-babc-fd3444e4b8ac'] = "approved";
                    namaStatus['bcc8ff73-468f-45cb-babc-fd34cce4b8ac'] = "rejected";
                    namaStatus['bcc8ff37-468f-45cb-bccc-fd34cce4b8ac'] = "transfered";
                    namaStatus['baa8ff37-468f-45cb-bccc-fd34aae4b8ac'] = "done";
                    namaStatus['baa8ff37-468f-455b-b5c5-fc34aae4b8ac'] = "cancelled";
                
                let status_id = result.data.data[x].transaction_resort_status_id; 
                let button_list = '';
                if(status_id == "b648ff73-468f-45cb-bbbc-fd3659e4b8ac"){
                    oneData.push("Ordered")
                    button_list = `<div class="d-flex">
                        <button onClick="confirm('${result.data.data[x].id}')" class="btnConfirmBooking btn btn-sm btn-success flex-grow-1 mr-1"><i class="fas fa-check"></i></button>
                        <button onClick="decline('${result.data.data[x].id}')" class="btnDeclineBooking btn btn-sm btn-danger flex-grow-1"><i class="fas fa-times"></i></button>
                    </div>`;
                }else if(status_id == "bbb8ff73-468f-45cb-babc-fd3444e4b8ac"){
                    oneData.push("Approved")
                }else if(status_id == "bcc8ff73-468f-45cb-babc-fd34cce4b8ac"){
                    oneData.push("Rejected")
                }else{
                    oneData.push(namaStatus[status_id]);
                }
        
                /* oneData.push(`
                    <div class="d-block mb-1">
                        <a onClick="getDetail('${result.data.data[x].id}')" class="btn btn-sm btn-outline-primary btn-block"><!--<i class="fas fa-eye mr-2"></i>-->Details</a>
                    </div>${button_list}`) */

                if(status_id == "bccf8f37-486f-45cb-ccbc-fd34cce4b8ac"){
                    oneData.push(`
                        <a href="#" onclick="approveBallance('${result.data.data[x].id}','${(totalPrice - (totalPrice * 0.2))}');">Approved</a><br>
                        <a href="#" onclick="showData('${result.data.data[x].id}');">Show</a>
                    `)
                }else{
                    oneData.push(`
                        <a href="#" onclick="showData('${result.data.data[x].id}');">Show</a>
                    `)
                }

                // oneData.push(`
                //     <div class="d-block mb-1">
                //         <a onClick="loadTransactionDetailById('${result.data.data[x].id}')" class="btn btn-sm btn-outline-primary btn-block"><!--<i class="fas fa-eye mr-2"></i>-->Details</a>
                //     </div>${button_list}`)
                    
                data.push(oneData)
            //}
        }
        var hardcode = {
            draw : result.data.dataTableInfo.draw,
            recordsTotal : result.data.dataTableInfo.recordsTotal,
            recordsFiltered : result.data.dataTableInfo.recordsFiltered,
            data : data
        }
        
        res.status(result.status).send(hardcode)
    },
    getAll : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/transaction-resort`, `GET`, null, cookie.accessToken, null, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    getById : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/transaction-resort`, `GET`, null, cookie.accessToken, req.params.id, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    update : async (req,res,next) => {

        console.log('haiiiiiiiiii')

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/transaction-wallet/${req.params.id}/approved`, `PUT`, req.body, cookie.accessToken, null, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
}