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
    getAll : async (req,res,next) => {

        var cookie = parseCookies(req)

        let result = await axios.call(`v1/user/vendor`, `GET`, null, cookie.accessToken, null, req._parsedUrl.query)

        console.log(result.data);
        if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(result.status).send(result.data)
    },
}