'use strict';

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
    goLogin : async (req,res, next) => {
        var cookies = parseCookies(req)
        if(!cookies.accessToken) return res.redirect(`/login`)
        next()
    },
    goHome : async (req,res, next) => {
        var cookies = parseCookies(req)
        if(cookies.accessToken) return res.redirect(`/`)
        next()
    }
}