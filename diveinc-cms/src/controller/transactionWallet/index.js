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

function formatDate(date) {

    console.log(date)
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
  
    var day = date.getDate();
    if(day < 10){
        day = `0${day}`
    }
    var monthIndex = date.getMonth() + 1;
    if(monthIndex < 10){
        monthIndex = `0${monthIndex}`
    }
    var year = date.getFullYear();

    var hours = date.getHours();
    if(hours < 10){
        hours = `0${hours}`
    }
    var minutes = date.getMinutes();
    if(minutes < 10){
        minutes = `0${minutes}`
    }
  
    return day + '-' + monthIndex + '-' + year + ' ' + hours + ':' + minutes;
}

module.exports = {
    datatable : async (req,res,next) => {
        
        var cookie = parseCookies(req)
        
        let result = await axios.call(`v1/transaction-wallet/datatable`, `GET`, null, cookie.accessToken, null, req._parsedUrl.query)
        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        
        var data = []
        const monthS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
        for(var i = 0; i < result.data.data.length; i++){
            var oneData = []
            oneData.push(result.data.data[i].type)
            oneData.push(result.data.data[i].transaction_wallet_status.name)
            let data_break = formatDate(new Date(result.data.data[i].created_at)).split(' ');
            let tgl = data_break[0].split('-');
            let new_tgl = tgl[0]+' '+monthS[tgl[1]-1]+' '+tgl[2];
            oneData.push(new_tgl+', '+data_break[1]);
            
            for(var j = 0; j < result.data.data[i].user.profile.permission.length; j++){
                if(result.data.data[i].user.profile.permission[j].creator_type_id == result.data.data[i].creator_type_id){
                    console.log(result.data.data[i].user.profile.permission[j].data.user)
                    console.log(result.data.data[i].user.profile.permission[j].data.business)
                    oneData.push(result.data.data[i].user.profile.permission[j].data.business.name+` (${result.data.data[i].user.profile.permission[j].data.business.type})`)
                }
            }
            oneData.push(result.data.data[i].user_data.balance)
            oneData.push(result.data.data[i].total)

            if(result.data.data[i].transaction_wallet_status.name == "Request"){
                oneData.push(`
                <a href="#" onclick="accept('${result.data.data[i].id}');">Accept</a>`+
                ` || <a href="#" onclick="reject('${result.data.data[i].id}');">Reject</a>
            `)
            }else{
                oneData.push(`-`)
            }
            
            data.push(oneData)
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

        let result = await axios.call(`v1/transaction-wallet`, `GET`, null, cookie.accessToken, null, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    getById : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/transaction-wallet`, `GET`, null, cookie.accessToken, req.params.id, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    add : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/transaction-wallet`, `POST`, req.body, cookie.accessToken, null, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    update : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/transaction-wallet`, `PUT`, req.body, cookie.accessToken, req.params.id, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    delete : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/transaction-wallet`, `DELETE`, null, cookie.accessToken, req.params.id, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    accept : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/transaction-wallet/${req.params.id}/accept`, `PUT`, null, cookie.accessToken, null, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
}