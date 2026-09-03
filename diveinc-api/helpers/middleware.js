`use strict`

const env = process.env.NODE_ENV || 'test'

const jwt = require('jsonwebtoken')
const tokenConfig = require(`@config/jsonwebtoken`)[env]

module.exports = {
    // For Valid Email
    checkToken : (req,res,next) => {
    
        var token = req.headers.authorization
        
        if(!token) return res.status(403).send({success: false, message:"Token is required"})
        if(!token.includes(`Bearer `)) return res.status(403).send({success: false, message:"Token is not valid"})
        
        token = token.replace(`Bearer `, ``)
        jwt.verify(token, tokenConfig.tokenSecret, function(err, decoded) {
            if(err){
                return res.status(401).send({success: false, message:"Token has expired"})
            }else {
                req.decoded = decoded
                next()
            }
        })
    },

    checkOptionalToken : (req,res,next) => {
    
        console.log(req.headers)
        var token = req.headers.authorization || ''
        
        // if(!token) return res.status(403).send({success: false, message:"Token is required"})
        // if(!token.includes(`Bearer `)) return res.status(403).send({success: false, message:"Token is not valid"})
        
        token = token.replace(`Bearer `, ``)
        jwt.verify(token, tokenConfig.tokenSecret, function(err, decoded) {
            if(err){
                //return res.status(401).send({success: false, message:"Token has expired"})
                next()
            }else {
                req.decoded = decoded
                next()
            }
        })
    },

    checkRefreshToken : (req,res,next) => {
        var token = req.headers.authorization
        
        if(!token) return res.status(403).send({success: false, message:"Refresh token is required"})
        if(!token.includes(`Bearer `)) return res.status(403).send({success: false, message:"Refresh token is not valid"})
        
        token = token.replace(`Bearer `, ``)
        
        jwt.verify(token, tokenConfig.refreshTokenSecret, function(err, decoded) {
            if(err){
                return res.status(401).send({success: false, message:"Refresh token has expired"})
            }else {
                req.decoded = decoded
                next()
            }
        })
    },

    checkLinkToken : (req,res,next) => {
        var token = req.query.token
        
        if(!token) return res.status(403).send({success: false, message:"Link ID is required"})
        
        jwt.verify(token, tokenConfig.tokenLinkSecret, function(err, decoded) {
            if(err){
                return res.status(401).send({success: false, message:"Link has expired"})
            }else {
                req.decoded = decoded
                next()
            }
        })
    },

    checkRequestToken : (req,res,next) => {
        var token = req.body.token;
        console.log(token);
        
        if(!token) return res.status(403).send({success: false, message:"Token is required"})
        
        jwt.verify(token, tokenConfig.tokenSecret, function(err, decoded) {
            if(err){
                return res.status(401).send({success: false, message:"Token has expired"})
            }else {
                req.decoded = decoded
                next()
            }
        })
    }
  }