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
        
        let result = await axios.call(`v1/room-aminity/datatable`, `GET`, null, cookie.accessToken, null, req._parsedUrl.query)
        
        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        
        var data = []
        for(var i = 0; i < result.data.data.length; i++){
            var oneData = []
            oneData.push(result.data.data[i].name)
            oneData.push(`
                <a href="#" onclick="editData('${result.data.data[i].id}');">Edit</a>`+
                ` || <a href="#" onclick="deleteData('${result.data.data[i].id}', '${result.data.data[i].name}');">Delete</a> 
            `)
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

        let result = await axios.call(`v1/room-aminity`, `GET`, null, cookie.accessToken, null, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    getById : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/room-aminity`, `GET`, null, cookie.accessToken, req.params.id, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    add : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/room-aminity`, `POST`, req.body, cookie.accessToken, null, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    update : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/room-aminity`, `PUT`, req.body, cookie.accessToken, req.params.id, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
    delete : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/room-aminity`, `DELETE`, null, cookie.accessToken, req.params.id, req._parsedUrl.query)

        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
}