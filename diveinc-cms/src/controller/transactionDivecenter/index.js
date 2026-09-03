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
    console.log('TANGAAALLLLL')
    console.log(tanggal)
    let tgl = tanggal.toString().substring(0,10).split('-');
    const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return tgl[2]+' '+monthNamesShort[tgl[1]-1]+' '+tgl[0];
}

module.exports = {
    datatable : async (req,res,next) => {
        
        var cookie = parseCookies(req)
        
        let result = await axios.call(`v1/transaction-divecenter/datatable-admin`, `GET`, null, cookie.accessToken, null, req._parsedUrl.query)
        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        
        // var data = []
        // for(var i = 0; i < result.data.data.length; i++){
        //     var totalPrice = 0;
            
        //     var oneData = []
        //     oneData.push(result.data.data[i].transaction_code)

        //     var htmlPurchaseDetail = ``
        //     var htmlDate = []
            
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
                    
        //             for(let item of package.packageItem){
        //                 htmlDate.push(item.package_date)
        //             }
        //         }
        //     }
            
        //     oneData.push(htmlPurchaseDetail)

        //     htmlDate = htmlDate.sort(function(a,b){
        //         return new Date(a) - new Date(b);
        //     });

        //     var showDate = [];
        //     for(let dt of htmlDate){
        //         if (typeof dt !== 'undefined') {
        //             showDate.push(dateFormatSM(dt));
        //         }
        //     }

        //     oneData.push(showDate.join('<br/>'));

        //     oneData.push(`total : IDR ${formatRupiah(totalPrice)}<br>
        //         diveinc fee : IDR ${formatRupiah(totalPrice * 0.2)}<br>
        //         Vendor income : IDR ${formatRupiah(totalPrice - (totalPrice * 0.2))}
        //     `)

        //     if(result.data.data[i].transaction_divecenter_status_id == "b648ff73-468f-45cb-bbbc-fd3659e4b8ac"){
        //         oneData.push(`Ordered`)
        //     }else{
        //         oneData.push(result.data.data[i].transaction_divecenter_status.description);
        //     }

        //     if(result.data.data[i].transaction_divecenter_status_id == "bccf8f37-486f-45cb-ccbc-fd34cce4b8ac"){
        //         oneData.push(`
        //             <a href="#" onclick="approveBallance('${result.data.data[i].id}');">Approved</a><br>
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
    for(var x = 0; x < result.data.data.length; x++){
        var oneData = []
        // console.log('plcs',result.data.data[x]);
        // console.log(result.data.data[x].divecenter_id +' == '+ divecenter_id);
            let created = dataResult[x].created_at.split('T');
            let tgl = created[0].split('-').reverse().join('-');
            let time = created[1].substr(0,8).split(':');
            oneData.push(`<p>${result.data.data[x].transaction_code}<br/>created : <br/>${tgl} ${(parseInt(time[0])+7)%24}:${time[1]}:${time[2]} WIB</p>`)
            
            var packageData = result.data.data[x].package_data
            var totalPrice = 0;
            var packDateList = [];
            if(packageData.package && typeof packageData.package !== 'undefined'){
                var htmlPackage = ``
                for(var i = 0; i< packageData.package.length; i++){
                    var htmlPackageItem = ``
                    var totalSummary = 0
                    if (typeof packageData.package[i].packageItem !== 'undefined') {
                        
                        for (let pi_idx = 0; pi_idx < packageData.package[i].packageItem.length; pi_idx++) {
                            var summaryPrice = parseFloat(packageData.package[i].packagePrice) * parseFloat(packageData.package[i].packageItem[pi_idx].guest);
                            totalSummary += summaryPrice;   
                        }
                        var serviceContent = '';
                        for (let m = 0; m < packageData.package[i].packageItem.length; m++) {
                            dayCount = packageData.package[0].day
                            console.log(packageData.package[i].packageItem)
                            if(packageData.package[i].packageItem[m].package_date){
                                htmlPackage = `<tr><td style='padding:0px; border:none'>Date: </td><td style='padding:0px; border:none'><span style='font-weight:bold'>${dateFormatSM(packageData.package[i].packageItem[m].package_date)}</span></td></tr>`;
                                htmlPackage += `<tr style='background:#FFF44F'><td colspan='2' style='padding:0px 5px'><b>${packageData.package[i].packageName}</b></td></tr>`
                                htmlPackage += `<tr><td style='padding:0px 5px; border:none'>Guest </td><td style='padding:0px 5px; border:none; '> x ${packageData.package[i].packageItem[m].guest}</td></tr>`
                            }
                            // htmlService = `<tr><td style='padding:0px; border:none'>Service : </td><td style='padding:0px; border:none'></td><td style='padding:0px; border:none'></td></tr>`
                            htmlService = ``
                            let pck = packageData.package[i].packageItem[m];
                            packDateList.push(pck.package_date);
                            if (typeof pck.service !=='undefined') {
                                for(var k = 0; k < pck.service.length; k++){
                                    if(pck.service[k].qty > 0){
                                        serviceContent += `<tr style='font-size:0.8em'><td style='padding:0px; padding-left:5px; border:none'>+${pck.service[k].name}</td> <td style='padding:0px; border:none;'>x ${pck.service[k].qty}</td></tr>` 
                                        totalSummary += (parseFloat(pck.service[k].price) * parseFloat(pck.service[k].qty));
                                    }
        
                                }                            
                            }
                            htmlService += serviceContent
                            htmlPackageItem += htmlService
                            
                        }
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
                oneData.push("-")
                // oneData.push("-")
            }

            oneData.push(`
                Transaction price : IDR ${formatRupiah(totalPrice)}<br>
                VAT : IDR ${formatRupiah(totalPrice * 0.1)}<br>
                Total Transfer: IDR ${formatRupiah(Math.round(totalPrice*1.1*100)/100)}<br><br>
                diveinc fee : IDR ${formatRupiah(totalPrice * 0.2)}<br>
                Vendor income : IDR ${formatRupiah(totalPrice - (totalPrice * 0.2))}
            `)

            // oneData.push(`IDR ${formatRupiah(Math.round(totalPrice*1.1*100)/100)}<br>
            //     <small style='font-size:0.7em'>(incl. fee : IDR ${formatRupiah(totalPrice * 0.2)})</small><br>
            // `)
            // oneData.push(`IDR ${totalPrice + (totalPrice / 10)}`)
            /*
                c7999dce-19b7-4bfd-84cc-d2f0845a3d86 - created
                d2f95bbe-159b-4447-9e07-33925e04c5e9 - scheduled
                59cfbb65-efff-4d25-aae1-b439efa62188 - extra data
                b648ff73-468f-45cb-bbbc-fd3659e4b8ac - guest data
                b648ff73-468f-45cb-babc-fd3459e4b8ac - reserved
                bbb8ff73-468f-45cb-babc-fd3444e4b8ac - approved
                bcc8ff73-468f-45cb-babc-fd34cce4b8ac - rejected
                bcc8ff37-468f-45cb-bccc-fd34cce4b8ac - transfered
                baa8ff37-468f-45cb-bccc-fd34aae4b8ac - done
                baa8ff37-468f-455b-b5c5-fc34aae4b8ac - cancelled
            */
            let status_id = result.data.data[x].transaction_divecenter_status.id;
            if (status_id == 'b648ff73-468f-45cb-bbbc-fd3659e4b8ac') {
                oneData.push('Ordered');
            }else{
                oneData.push(result.data.data[x].transaction_divecenter_status.description);
            }

            if(status_id == "bccf8f37-486f-45cb-ccbc-fd34cce4b8ac"){
                oneData.push(`
                    <a href="#" onclick="approveBallance('${result.data.data[x].id}');">Approved</a><br>
                    <a href="#" onclick="showData('${result.data.data[x].id}');">Show</a>
                `)
            }else{
                oneData.push(`
                    <a href="#" onclick="showData('${result.data.data[x].id}');">Show</a>
                `)
            }
            
            data.push(oneData);
            
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

        let result = await axios.call(`v1/transaction-divecenter`, `GET`, null, cookie.accessToken, null, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    getById : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/transaction-divecenter`, `GET`, null, cookie.accessToken, req.params.id, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    update : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/transaction-wallet/${req.params.id}/approved`, `PUT`, req.body, cookie.accessToken, null, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
}