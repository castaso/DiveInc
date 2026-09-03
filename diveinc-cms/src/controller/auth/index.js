`use strict`

const axios = require(`@service/axios`)

module.exports = {
    login : async (req,res,next) => {
        let login = await axios.call(`v1/user/admin/login/email`, `POST`, req.body, null, null, req._parsedUrl.query)
        if(!login.data.message) return res.status(500).send({success : false, message : `Internal server error`})
        res.status(login.status).send(login.data)
    },
    // resetPassword : async (req,res,next) => {
    //     var data = {
    //         email : req.body.email
    //     }

    //     let resetPassword = await axios.call(`v1/admin/reset-password`, `POST`, data, null, null, req._parsedUrl.query)

    //     if(!resetPassword.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    //     res.status(resetPassword.status).send(resetPassword.data)
    // }
}