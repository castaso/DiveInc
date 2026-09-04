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
        
        let result = await axios.call(`v1/transaction-liveaboard/datatable-admin`, `GET`, null, cookie.accessToken, null, req._parsedUrl.query)
        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        
        console.log(JSON.stringify(result.data.data))

        let packageList = [];
        var data = []
        var dataResult = result.data.data;
        
        for(var x = 0; x < result.data.data.length; x++){
            var oneData = []
            //0
            
            let created = dataResult[x].created_at.split('T');
            let tgl = created[0].split('-').reverse().join('-');
            let time = created[1].substr(0,8).split(':');
            oneData.push(`<p>${result.data.data[x].transaction_code}<br/>created : <br/>${tgl} ${(parseInt(time[0])+7)%24}:${time[1]}:${time[2]} WIB</p>`)
            
            var packageData = dataResult[x].package_data
            // if(result.data.data[x].liveaboard_id == liveaboard_id){
                
                let srvcList = [];
                let tglShow = '-';
                if (packageData.package) {
                    let tgl_start = packageData.package[0].package_date;
                    let tgl_start_add = new Date(tgl_start);
                    let dS = new Date(tgl_start);
                    let dayCount = 1;
                    if (typeof packageData.package[0].day !== 'undefined') {
                        dayCount = packageData.package[0].day
                    }
                    console.log('id',packageData.package[0].id);
                    console.log('dC',packageList);
                    let tgl_end = new Date(dS.setDate(tgl_start_add.getDate() + parseInt(dayCount) - 1));
                    let tgl_end_show =(tgl_end.getFullYear()+'-'+(tgl_end.getMonth()+1).toString().padStart(2,'0')+'-'+tgl_end.getDate().toString().padStart(2,'0'));
                    tglShow = dateFormatSM(tgl_start) + '-' + dateFormatSM(tgl_end_show);
                    srvcList = packageData.package[0].service;
                    
                    
                }
        
                var totalPrice = 0;
                if(packageData.room){
                    
                    //var night = (new Date(packageData.room_date.to) - new Date(packageData.room_date.from)) / (1000 * 3600 * 24)
                    var htmlRoom = ``
                    for(var i = 0; i < packageData.room.length; i++){
                        
                        htmlRoom += `<tr style='background:#9dccf5'><td colspan='2' style='padding:0px 5px;'><b>${packageData.room[i].roomName.toUpperCase()}</b></td></tr>`
                        var htmlRoomItem = ``
                        var totalSummary = 0
                        
                        htmlRoomItem += `<tr>
                            <td style='padding:0px 5px; border:none'>Guest </td>
                            <td style='padding:0px 5px; border:none; text-align:right'> x ${packageData.room[i].roomItem[0].guest}</td>
                            </tr>`
                        
                        //var summaryPrice = parseFloat(night) * parseFloat(packageData.room[i].roomPrice)
                        var summaryPrice = packageData.room[i].roomItem[0].guest * packageData.room[i].roomPrice
                        totalSummary += summaryPrice
                        htmlRoom += htmlRoomItem
                        totalPrice += totalSummary;
                    }

                    totalSummary = 0;
                    var htmlService = '';
                    var htmlTotal = htmlRoom;
                    if (srvcList.length > 0) {
                        htmlService = `<tr>
                        <td style='padding:0px 5px; border:none; background:#FFF44F' colspan='2'>Additional </td>
                        </tr>`;
                        var htmlServiceItem = '';
                        for(var i = 0; i < srvcList.length; i++){
                            if (parseFloat(srvcList[i].qty) > 0) {
                                htmlServiceItem += `<tr><td style='padding:0px 10px; border:none'><small>+ ${srvcList[i].name}</small></td>
                                <td style='padding:0px 10px; border:none; text-align:right'><small>x ${srvcList[i].qty}</small></td></tr>` 
                                totalSummary += (parseFloat(srvcList[i].qty) * parseFloat(srvcList[i].price))
                            }
                        }

                        if (htmlServiceItem != '') {
                            htmlService += htmlServiceItem
                        }else{
                            htmlService = '';
                        }
                        
                    }
                    htmlRoom += htmlService
                    htmlTotal = htmlRoom
                    totalPrice += totalSummary;
                    //1
                    oneData.push(`<table width='100%' style='font-size:0.9em'><tr><td style='padding:0px; border:none'>Date: </td><td style='padding:0px; border:none'><span style='font-weight:bold'>${tglShow}</span></td></tr>${htmlTotal}</table>`)
                    
                }else{
                    //1
                    // oneData.push("-")
                    //2
                    oneData.push("-")
                }

                
                
                //3
                oneData.push(`
                    Transaction price : IDR ${formatRupiah(totalPrice)}<br>
                    VAT : IDR ${formatRupiah(totalPrice * 0.1)}<br>
                    Total Transfer: IDR ${formatRupiah(Math.round(totalPrice*1.1*100)/100)}<br><br>
                    diveinc fee : IDR ${formatRupiah(totalPrice * 0.2)}<br>
                    Vendor income : IDR ${formatRupiah(totalPrice - (totalPrice * 0.2))}
                `)
                // oneData.push(`IDR ${totalPrice + (totalPrice / 10)}`)
                // oneData.push(`IDR ${totalPrice + (totalPrice / 10)}`)
                var status_id = result.data.data[x].transaction_liveaboard_status_id;

                if(status_id == "b648ff73-468f-45cb-bbbc-fd3659e4b8ac"){
                    oneData.push(`Ordered`)
                }else{
                    oneData.push(result.data.data[x].transaction_liveaboard_status.description);
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
                
                
                data.push(oneData)
            // }

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

        let result = await axios.call(`v1/transaction-liveaboard`, `GET`, null, cookie.accessToken, null, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    getById : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/transaction-liveaboard`, `GET`, null, cookie.accessToken, req.params.id, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    update : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/transaction-liveaboard/${req.params.id}`, `PUT`, req.body, cookie.accessToken, null, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
}