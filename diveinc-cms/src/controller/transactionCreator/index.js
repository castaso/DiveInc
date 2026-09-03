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

module.exports = {
    datatable : async (req,res,next) => {
        
        var cookie = parseCookies(req)
        
        let result = await axios.call(`v1/transaction-creator/datatable`, `GET`, null, cookie.accessToken, null, req._parsedUrl.query)
        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        
        var data = []
        for(var i = 0; i < result.data.data.length; i++){
            console.log(result.data.data[i])
            var oneData = []
            oneData.push(result.data.data[i].creator_type.name)

            var htmlData = `
                <ul>
                    <li>Name : ${result.data.data[i].data.user.name}</li>
                    <li>Bank : ${result.data.data[i].data.user.bank_name}</li>
                    <li>Phone : ${result.data.data[i].data.user.phone_number}</li>
                    <li>Account Name : ${result.data.data[i].data.user.bank_account_name}</li>
                    <li>Account Number : ${result.data.data[i].data.user.bank_account_number}</li>
                    <li>Business Name : ${result.data.data[i].data.business.type} - ${result.data.data[i].data.business.name}</li>
                    <li>Address : ${result.data.data[i].data.business.address}</li>
                    <li>Web : ${result.data.data[i].data.business.social_media}</li>
                </ul>
            `
            oneData.push(htmlData)
            oneData.push(result.data.data[i].user.profile.contact.email)

            if(result.data.data[i].file.url){
                oneData.push(`<a href="${result.data.data[i].file.url}">Download</a>`)
            }else{
                var htmlDownload = ``
                for(var j = 0; j < result.data.data[i].file.length; j++){
                    htmlDownload += `<a href="${result.data.data[i].file[j].value.url}">${result.data.data[i].file[j].key}</a><br>`
                }
                oneData.push(htmlDownload)
            }
            

            if(result.data.data[i].creator_status.name == "Request"){
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

        let result = await axios.call(`v1/transaction-creator`, `GET`, null, cookie.accessToken, null, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    getById : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/transaction-creator`, `GET`, null, cookie.accessToken, req.params.id, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    add : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/transaction-creator`, `POST`, req.body, cookie.accessToken, null, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    update : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/transaction-creator`, `PUT`, req.body, cookie.accessToken, req.params.id, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    delete : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/transaction-creator`, `DELETE`, null, cookie.accessToken, req.params.id, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    accept : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/transaction-creator/${req.params.id}/accept`, `PUT`, null, cookie.accessToken, null, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    reject : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/transaction-creator/${req.params.id}/reject`, `PUT`, null, cookie.accessToken, null, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
}