`use strict`

const model = 'user'
const env = process.env.NODE_ENV || 'test'

const controller = require(`express`).Router({mergeParams : true})
const jwt = require(`jsonwebtoken`)
const Op = require('sequelize').Op

const user = require('@models').user
const role = require('@models').role
const creatorStatus = require('@models').creator_status
const logType = require('@models').log_type
const logActivity = require(`@models`).log_activity

const divecenter = require('@models').transaction_divecenter
const resort = require('@models').transaction_resort
const liveaboard = require('@models').transaction_liveaboard

const modelResort = require('@models').resort
const modelDivecenter = require('@models').divecenter
const modelLiveaboard = require('@models').liveaboard

const sha256 = require("js-sha256")
const validator = require("email-validator")
const uuid_validate = require("uuid-validate")

const tokenConfig = require(`@config/jsonwebtoken`)[env]
const middleware = require(`@helpers/middleware`)

const template = require(`@helpers/template`)
const mailService = require(`@service/email`)

controller.get(`/`, async (req,res) => {

  res.status(200).send({
      success : true,
      message : "Success"
  })
})

controller.post(`/`, async (req,res) => {
    res.status(200).send({
        success : true,
        message : `Create ${model} successfully`
    })
})

controller.put(`/`, (req,res) => {
  res.status(200).send({
      success : true,
      message : `Edit ${model} successfully`
  })
})

controller.delete(`/`, (req,res) => {
  res.status(200).send({
    success : true,
    message : `Delete ${model} successfully`
  })
})

controller.post(`/website/login/email`, async (req,res) => {

  let {
    email,
    password
  } = req.body

  if(!validator.validate(email)) return res.status(403).send({success: false, message: `Email is not valid`})
  if(!email || !password) return res.status(403).send({success: false, message: `Email and password required`})

  let getData = await user.findOne({
    where : {
      data_register: {
        data: {
          email: email,
          password: sha256(password)
        },
        type : `email`
      },
    }
  }) 

  if(!getData) return res.status(200).send({success: false, message: `Account not found, please check your email and password`})
  if(!getData.verify) return res.status(200).send({success: false, message: `Account not verify, please check your email`})
  if(!getData.active) return res.status(200).send({success: false, message: `Account has been deleted, for more information please contact Diveinc.co`})

// Insert data login
const data_login = getData.data_login
for(var i = 0; i < data_login.length; i++) {
  if (data_login[i].type == 'Website') {
    data_login.splice(i, 1)
  }
}

data_login.push({
  type : 'Website',
  login_at : new Date()
})
const insertDataLogin = await user.update({
  data_login : data_login,
  updated_at : new Date(),
  updated_by : {
    type : "System",
    id : "",
    description : "User login to system"
  }
},{
  where : { id : {[Op.eq] : getData.id}}
})

// Error update data login condition
if(!insertDataLogin) return res.status(500).send({success: false, message:"Login failed, please try again"})

const checkLogin = await user.findOne({
  where : { id : {[Op.eq] : getData.id}}
})

if(!checkLogin) return res.status(500).send({success: false, message:"Login failed, please try again"})

// Get log type system
const dataLogType = await logType.findOne({
  where : { name : {[Op.eq] : `System`}}
})

//Condition log logType
if(!dataLogType) return res.status(500).send({success : false, message:"Login failed, please try again"})

//Create Activity Log
let dataLog = {model : model, old_data : getData.dataValues, new_data : checkLogin.dataValues}

var emailUser = getData.data_register.data.email

let insertLog = await logActivity.create({
  log_type_id : dataLogType.id,
  name : `Website Login`,
  description : `${emailUser[0]} has login to website diveinc.co`,
  data_log : dataLog,
  created_by : {
    type : "System",
    id : "",
    description : "System create log authentication"
  },
  created_at : new Date()
})

if(!insertLog) return res.status(500).send({success: false, message:"Login failed, please try again"})

var dataToken = {
  id : getData.id,
  role_id : getData.role_id
}

// Generate Token
let token = await jwt.sign(dataToken, tokenConfig.tokenSecret, { expiresIn: tokenConfig.tokenLife })
let refreshToken = await jwt.sign(dataToken, tokenConfig.refreshTokenSecret, { expiresIn: tokenConfig.refreshTokenLife })

// Success Condition
  res.status(200).send({
    success : true,
    message : "Login successfully",
    data : {
      accessToken : token,
      refreshToken : refreshToken
    }
  })
})

controller.post(`/website/forget-password/email`, async (req,res) => {

  let {
    email
  } = req.body

  if(!validator.validate(email)) return res.status(403).send({success: false, message: `Email is not valid`})

  let getData = await user.findOne({
    where : {
      data_register: {
        data: {
          email: email,
        },
        type : `email`
      }
    }
  }) 
  

  if(!getData) return res.status(200).send({success: false, message: `Email not found, please check your email and password`})
  if(!getData.verify) return res.status(200).send({success: false, message: `Account not verify, please check your email`})
  if(!getData.active) return res.status(200).send({success: false, message: `Account has been deleted, for more information please contact Diveinc.co`})

  // Get log type system
  const dataLogType = await logType.findOne({
    where : { name : {[Op.eq] : `System`}}
  })

  //Condition log logType
  if(!dataLogType) return res.status(500).send({success : false, message:"Reset Password failed, please try again"})

  //Create Activity Log
  let dataLog = {model : model, old_data : getData.dataValues, new_data : getData.dataValues}

  var emailUser = getData.data_register.data.email

  let insertLog = await logActivity.create({
    log_type_id : dataLogType.id,
    name : `Website Forget Password Request`,
    description : `${emailUser[0]} has request forget password website diveinc.co`,
    data_log : dataLog,
    created_by : {
      type : "System",
      id : "",
      description : "System create log authentication"
    },
    created_at : new Date()
  }) 

  if(!insertLog) return res.status(500).send({success: false, message:"request forget password failed, please try again"})

  var dataToken = {
    email : email,
  }
  // Generate Token
  let token = await jwt.sign(dataToken, tokenConfig.tokenSecret, { expiresIn: tokenConfig.tokenLife })

  let sendEmail = await template.emailForgotPassword(email, token)
  mailService(sendEmail)

  // Success Condition
  res.status(200).send({
    success : true,
    message : "Email has been sent",
  })
})

controller.get(`/website/forgot-password`, async (req,res) => {
  // let {
  //   token
  // } = req.body

  let dt = '';
  token = req.query.token;
  jwt.verify(token, tokenConfig.tokenSecret, function(err, decoded) {
      if(err){
          return res.status(401).send({success: false, message:"Token has expired"})
      }else {
          req.decoded = decoded
          dt = `<form>
          <div class="form-row">
              <div class="col-md-12 mb-4">
                  <label for="email_address">New Password</label>
                  <input id="newpasswordInput" type="password" class="form-control form-control-lg rounded-0" name="new_password" required>
                  <span class="passwordInputIcon" id="newpasswordInputIcon" onmousedown="typeText('newpasswordInput')" onmouseup="typePassword('newpasswordInput')"><i class="fas fa-eye-slash"></i></span>    
              </div>
          </div>
          <div class="form-row">
              <div class="col-md-12 mb-4">
                  <label for="email_address">Retype New Password</label>
                  <input id="retypenewpasswordInput" type="password" name="retype_new_password" class="form-control form-control-lg rounded-0" required>
                  <span class="passwordInputIcon" id="retypenewpasswordInputIcon" onmousedown="typeText('retypenewpasswordInput')" onmouseup="typePassword('retypenewpasswordInput')"><i class="fas fa-eye-slash"></i></span>    
                </div>
          </div>
          <button class="btn btn-outline-primary btn-lg-2 btn-block" type="button" onclick="submitForm()">Reset Password</button>
      </form>`
      }
  })
  // $.each(req.body, function(i,v){
  //   dt += `${i} = ${v}`;
  // });

  res.status(200).send({
    success : true,
    message : "Success",
    data : dt
  })
});

controller.post(`/admin/login/email`, async (req,res) => {

  let {
    email,
    password
  } = req.body

  if(!validator.validate(email)) return res.status(403).send({success: false, message: `Email is not valid`})
  if(!email || !password) return res.status(403).send({success: false, message: `Email and password required`})

  let getData = await user.findOne({
    where : {
      data_register: {
        data: {
          email: email,
          password: sha256(password)
        },
        type : `email`
      },
      role_id : { [Op.not] : 'c5009ed4-2f47-4822-8aa5-2264fe2dcf13'}
    }
  }) 

  if(!getData) return res.status(200).send({success: false, message: `Account not found, please check your email and password`})
  if(!getData.verify) return res.status(200).send({success: false, message: `Account not verify, please check your email`})
  if(!getData.active) return res.status(200).send({success: false, message: `Account has been deleted, for more information please contact Diveinc.co`})

// Insert data login
const data_login = getData.data_login
for(var i = 0; i < data_login.length; i++) {
  if (data_login[i].type == 'Admin') {
    data_login.splice(i, 1)
  }
}

data_login.push({
  type : 'Admin',
  login_at : new Date()
})

const insertDataLogin = await user.update({
  data_login : data_login,
  updated_at : new Date(),
  updated_by : {
    type : "System",
    id : "",
    description : "User login to system"
  }
},{
  where : { id : {[Op.eq] : getData.id}}
})

// Error update data login condition
if(!insertDataLogin) return res.status(500).send({success: false, message:"Login failed, please try again"})

const checkLogin = await user.findOne({
  where : { id : {[Op.eq] : getData.id}}
})

if(!checkLogin) return res.status(500).send({success: false, message:"Login failed, please try again"})

// Get log type system
const dataLogType = await logType.findOne({
  where : { name : {[Op.eq] : `System`}}
})

//Condition log logType
if(!dataLogType) return res.status(500).send({success : false, message:"Login failed, please try again"})

//Create Activity Log
let dataLog = {model : model, old_data : getData.dataValues, new_data : checkLogin.dataValues}

var emailUser = getData.data_register.data.email

let insertLog = await logActivity.create({
  log_type_id : dataLogType.id,
  name : `Admin Login`,
  description : `${emailUser[0]} has login to website diveinc.co`,
  data_log : dataLog,
  created_by : {
    type : "System",
    id : "",
    description : "System create log authentication"
  },
  created_at : new Date()
})

if(!insertLog) return res.status(500).send({success: false, message:"Login failed, please try again"})

var dataToken = {
  id : getData.id,
  role_id : getData.role_id
}

// Generate Token
let token = await jwt.sign(dataToken, tokenConfig.tokenSecret, { expiresIn: tokenConfig.tokenLife })
let refreshToken = await jwt.sign(dataToken, tokenConfig.refreshTokenSecret, { expiresIn: tokenConfig.refreshTokenLife })

// Success Condition
  res.status(200).send({
    success : true,
    message : "Login successfully",
    data : {
      accessToken : token,
      refreshToken : refreshToken
    }
  })
});

controller.post(`/website/register/email`, async (req,res) => {

  let {
    email,
    password,
    subscribe
  } = req.body

  if(!validator.validate(email)) return res.status(403).send({success: false, message: `Email is not valid`})
  if(!email || !password || !subscribe) return res.status(403).send({success: false, message: `Invalid body required`})

  let getData = await user.findOne({
    where : {
      data_register: {
        data: {
          email: email
        },
        type : `email`
      }
    }
  }) 

  if(getData) return res.status(200).send({success: false, message: `Account already exist, please use another email`})

const insertDataRegister = await user.create({
  role_id : "c5009ed4-2f47-4822-8aa5-2264fe2dcf13",
  user_id : "UW-"+new Date().getTime(),
  data_register : {
    data : {
      email : email,
      password : sha256(password)
    },
    type : "email"
  },
  profile: {
    name: {
      last_name: null,
      first_name: null
    },
    picture: {
      url: "https://mediaproxy.salon.com/width/1200/height/1200/https://media.salon.com/2019/04/suprised-man.jpg",
      path: "width/1200/height/1200/https://media.salon.com/2019/04/suprised-man.jpg",
      baseUrl: "https://mediaproxy.salon.com/"
    },
    contact: {
      email : email,
      recovery_email : null,
      phone : null
    },
    address: {
      street: null,
      village : null,
      subdistrict: null,
      postal_code: null,
      city: null,
      province: null,
      region : null,
      latitude : null,
      longitude : null
    },
    wallet: {
      balance : 0,
      bank_id : null,
      bank_name : null,
      account_number : null,
      account_name : null
    },
    utility : {
      currency : "IDR",
      language : "English"
    },
    permission : [
      {
        type : "resort",
        creator_type_id : "c7199dce-19b7-4bfd-84cc-d2f0845a3d86",
        creator_status_id : "c7199dce-19b7-4bfd-84cc-d2f0845a3d86",
        data : {}
      },
      {
        type : "liveaboards",
        creator_type_id : "d2f95bbe-159b-4d47-9e07-33925e04c5e9",
        creator_status_id : "c7199dce-19b7-4bfd-84cc-d2f0845a3d86",
        data : {}
      },
      {
        type : "divecenter",
        creator_type_id : "59cfbb65-e7cf-4d25-aae1-b439efa62188",
        creator_status_id : "c7199dce-19b7-4bfd-84cc-d2f0845a3d86",
        data : {}
      },
      {
        type : "contribution",
        creator_type_id : "b648ff73-468f-45cb-b7dc-fd3659e4b8ac",
        creator_status_id : "c7199dce-19b7-4bfd-84cc-d2f0845a3d86",
        data : {}
      }
    ],
    is_complete : false
  },
  verify: false,
  subscribe: subscribe,
  active: true,
  created_at : new Date(),
  created_by : {
    type : "System",
    id : "",
    description : "User register to system"
  }
})

// Error update data login condition
if(!insertDataRegister) return res.status(500).send({success: false, message:"Register failed, please try again"})

const checkRegister = await user.findOne({
  where : { 
    data_register: {
      data: {
        email: email
      },
      type : `email`
    } 
  }
})

if(!checkRegister) return res.status(500).send({success: false, message:"Register failed, please try again"})

// Get log type system
const dataLogType = await logType.findOne({
  where : { name : {[Op.eq] : `System`}}
})

//Condition log logType
if(!dataLogType) return res.status(500).send({success : false, message:"Register failed, please try again"})

//Create Activity Log
let dataLog = {model : model, old_data : null, new_data : checkRegister.dataValues}

let insertLog = await logActivity.create({
  log_type_id : dataLogType.id,
  name : `Website Register User`,
  description : `${email} has registered to website diveinc.co`,
  data_log : dataLog,
  created_by : {
    type : "System",
    id : "",
    description : "System create log authentication"
  },
  created_at : new Date()
})

if(!insertLog) return res.status(500).send({success: false, message:"Login failed, please try again"})

var dataToken = {
  email : email,
}

// Generate Token
let token = await jwt.sign(dataToken, tokenConfig.tokenLinkSecret, { expiresIn: tokenConfig.tokenLinkLife })

let sendEmail = await template.emailRegister(email, token)
mailService(sendEmail)

// Success Condition
  res.status(200).send({
    success : true,
    message : "Register successfully"
  })
})

controller.get(`/my-profile`, middleware.checkToken, async (req,res) => {

  if(!req.decoded.id) return res.status(401).send({success : false, message : "Token not valid"})

  let getData = await user.findOne({
    where : {
      id : { [Op.eq] : req.decoded.id }
    },
    attributes : ["id", "profile"]
  }) 

  if(!getData) return res.status(401).send({success: false, message: `Account not found`})

  res.status(200).send({
      success : true,
      message : "Success",
      data : getData.dataValues
  })
})

controller.post(`/my-profile/save-info`, middleware.checkToken, async (req,res) => {

  let {
    first_name,
    last_name,
    phone
  } = req.body

  if(!first_name || !phone || !last_name) return res.status(403).send({success: false, message: `Invalid body required`})

  let getData = await user.findOne({
    where : {
      id : { [Op.eq] : req.decoded.id }
    }
  }) 

  if(!getData) return res.status(200).send({success: false, message: `Account not found, please check your email and password`})

// Insert data profile
const profile = getData.dataValues.profile
profile.name.first_name = first_name
profile.name.last_name = last_name
profile.contact.phone = phone || null
profile.is_complete = true

const updateProfile = await user.update({
  profile : profile,
  updated_at : new Date(),
  updated_by : {
    type : "System",
    id : "",
    description : "User update user info"
  }
},{
  where : { id : {[Op.eq] : getData.id}}
})

// Error update data login condition
if(!updateProfile) return res.status(500).send({success: false, message:"Update profile, please try again"})

const checkData = await user.findOne({
  where : { id : {[Op.eq] : getData.id}}
})

if(!checkData) return res.status(500).send({success: false, message:"Update profile, please try again"})

// Get log type system
const dataLogType = await logType.findOne({
  where : { name : {[Op.eq] : `System`}}
})

//Condition log logType
if(!dataLogType) return res.status(500).send({success : false, message:"Login failed, please try again"})

//Create Activity Log
let dataLog = {model : model, old_data : getData.dataValues, new_data : checkData.dataValues}

let insertLog = await logActivity.create({
  log_type_id : dataLogType.id,
  name : `Website Update Profile Information`,
  description : `${profile.contact.email} has upadated his/her information`,
  data_log : dataLog,
  created_by : {
    type : "System",
    id : "",
    description : "System create log authentication"
  },
  created_at : new Date()
})

if(!insertLog) return res.status(500).send({success: false, message:"Login failed, please try again"})
// Success Condition
  res.status(200).send({
    success : true,
    message : "Update profile successfully",
  })
})

controller.post(`/my-profile/save-wallet`, middleware.checkToken, async (req,res) => {

  let {
    bank_name,
    account_name,
    account_number
  } = req.body

  if(!bank_name || !account_name || !account_number) return res.status(403).send({success: false, message: `Invalid body required`})

  let getData = await user.findOne({
    where : {
      id : { [Op.eq] : req.decoded.id }
    }
  }) 

  if(!getData) return res.status(200).send({success: false, message: `Account not found, please check your email and password`})

// Insert data profile
const profile = getData.dataValues.profile
profile.wallet.balance = 1000000 // hardcode
profile.wallet.bank_id = null
profile.wallet.bank_name = bank_name
profile.wallet.account_name = account_name
profile.wallet.account_number = account_number

const updateProfile = await user.update({
  profile : profile,
  updated_at : new Date(),
  updated_by : {
    type : "System",
    id : "",
    description : "User update user info"
  }
},{
  where : { id : {[Op.eq] : getData.id}}
})

// Error update data login condition
if(!updateProfile) return res.status(500).send({success: false, message:"Update profile, please try again"})

const checkData = await user.findOne({
  where : { id : {[Op.eq] : getData.id}}
})

if(!checkData) return res.status(500).send({success: false, message:"Update profile, please try again"})

// Get log type system
const dataLogType = await logType.findOne({
  where : { name : {[Op.eq] : `System`}}
})

//Condition log logType
if(!dataLogType) return res.status(500).send({success : false, message:"Login failed, please try again"})

//Create Activity Log
let dataLog = {model : model, old_data : getData.dataValues, new_data : checkData.dataValues}

let insertLog = await logActivity.create({
  log_type_id : dataLogType.id,
  name : `Website Update Wallet Information`,
  description : `${profile.contact.email} has upadated his/her wallet information`,
  data_log : dataLog,
  created_by : {
    type : "System",
    id : "",
    description : "System create log authentication"
  },
  created_at : new Date()
})

if(!insertLog) return res.status(500).send({success: false, message:"Login failed, please try again"})
// Success Condition
  res.status(200).send({
    success : true,
    message : "Update profile successfully",
  })
})

controller.get(`/my-permission`, middleware.checkToken, async (req,res) => {

  if(!req.decoded.id) return res.status(401).send({success : false, message : "Token not valid"})

  let getData = await user.findOne({
    where : {
      id : { [Op.eq] : req.decoded.id }
    },
    attributes : ["id", "profile"]
  }) 

  if(!getData) return res.status(401).send({success: false, message: `Account not found`})

  var permission = getData.dataValues.profile.permission
  for(var i = 0; i < permission.length; i++){
    const statusCreator = await creatorStatus.findOne({
      where : {
        id : { [Op.eq] : permission[i].creator_status_id}
      }
    })
    
    if(statusCreator){
      getData.dataValues.profile.permission[i].status_name = statusCreator.dataValues.name
    }

    //console.log(getData.dataValues.profile.permission)
  }

  res.status(200).send({
      success : true,
      message : "Success",
      data : getData.dataValues
  })
})

controller.get(`/my-order`, middleware.checkToken, async (req,res) => {

  var customer_id = req.decoded.id;

  let fetchResort = await resort.findAll({
    where : {
      active : true,
      customer_id : customer_id
    },
    include : [modelResort]
  });

  let fetchLiveaboard = await liveaboard.findAll({
    where : {
      active : true,
      customer_id : customer_id
    },
    include:[modelLiveaboard]
  });

  let fetchDivecenter = await divecenter.findAll({
    where : {
      active : true,
      customer_id : customer_id
    },
    include: [modelDivecenter]
  });

  var data = [
    {
      type : 'resort',
      data : fetchResort
    },
    {
      type : 'divecenter',
      data : fetchDivecenter
    },
    {
      type : 'liveaboard',
      data : fetchLiveaboard
    }
  ];

  res.status(200).send({
      success : true,
      message : "Success",
      data : data
  })
})

controller.put(`/ganti-password`, middleware.checkRequestToken, async (req,res) => {

  let {
    password, re_password, token
  } = req.body

  if(password != re_password){
    console.log('passwd',password, re_password);
    return res.status(200).send({success: false, message: `Password not match`})
  }

  let email = req.decoded.email
  let getData = await user.findOne({
    where : {
      data_register: {
        data: {
          email: email,
        },
      }
    }
  }) 

  // console.log('getData berhasil');
  // console.log(getData.dataValues.data_register);

  if(!getData) return res.status(200).send({success: false, message: `Email not found, please check your email and password`})
  if(!getData.verify) return res.status(200).send({success: false, message: `Account not verify, please check your email`})
  if(!getData.active) return res.status(200).send({success: false, message: `Account has been deleted, for more information please contact Diveinc.co`})

  // Update data email
  const data_register = getData.dataValues.data_register
  data_register.data.email = email
  data_register.data.password = sha256(password)
  console.log(data_register);

  const updateData = await user.update({
    data_register : data_register,
    updated_at : new Date(),
    updated_by : {
      type : "System",
      id : "",
      description : "User change password from forgot password"
    }
  },{
    where : { id : {[Op.eq] : getData.id}}
  })
  
  if(!updateData) return res.status(500).send({success : false, message : `Accept ${model} failed`})
  console.log('updateData berhasil');

  const checkUpdate = await user.findOne({
    where : {
      data_register: {
        data: {
          email: email,
        },
      }
    }
  })

  
  if(!checkUpdate) return res.status(200).send({success : false, message : "Data Not Found"})
  // console.log('checkupdate berhasil');

  // Get log type private
  const dataLogType = await logType.findOne({
    where : { name : {[Op.eq] : `Public`}}
  })

  //Condition log logType
  if(!dataLogType) return res.status(500).send({success : false, message:`Accept ${model} failed, please try again`})

  //Create Activity Log
  let dataLog = {model : model, old_data : getData.dataValues, new_data : checkUpdate.dataValues}

  let insertLog = await logActivity.create({
    log_type_id : dataLogType.id,
    name : `Update Password ${model}`,
    description : `User update password ${model}`,
    data_log : dataLog,
    created_by : {
    type : "System",
    id : "",
    description : `System create log for updating ${model}`
    },
    updated_by : {
        type : "System",
        id : "",
        description : `System create log for updating ${model}`
    }
  })
  // console.log('insertlog berhasil');

  if(!insertLog) return res.status(500).send({success: false, message:`Accept ${model} failed, please try again`})

  res.status(200).send({
      success : true,
      message : `Update ${model} successfully`,
  })
})

controller.put(`/change-password`, middleware.checkToken, async (req,res) => {

  let {
    password, re_password, old_password
  } = req.body

  if(password != re_password){
    console.log('passwd',password, re_password);
    return res.status(200).send({success: false, message: `Password not match`})
  }
  let getData = await user.findOne({
    where : {
      id: { [Op.eq] : req.decoded.id}
    }
  }) 

  // console.log('getData berhasil');
  // console.log(getData.dataValues.data_register);

  if(!getData) return res.status(200).send({success: false, message: `User not found`})
  // Update data email

  console.log(getData.dataValues.data_register.data.password);
  console.log(old_password);
  console.log(sha256(old_password));
  if(getData.dataValues.data_register.data.password != sha256(old_password)) return res.status(403).send({success: false, message: `Your old password is wrong`})
  if(password != re_password) return res.status(403).send({success: false, message: `Password and confirmation isn't match`})

  const data_register = getData.dataValues.data_register
  data_register.data.password = sha256(password)

  const updateData = await user.update({
    data_register : data_register,
    updated_at : new Date(),
    updated_by : {
      type : "System",
      id : "",
      description : "User change password from profile"
    }
  },{
    where : { id : {[Op.eq] : getData.id}}
  })
  
  if(!updateData) return res.status(500).send({success : false, message : `Accept ${model} failed`})
  console.log('updateData berhasil');

  const checkUpdate = await user.findOne({
    where : {
      id: { [Op.eq] : req.decoded.id}
    }
  })

  
  if(!checkUpdate) return res.status(200).send({success : false, message : "Data Not Found"})
  // console.log('checkupdate berhasil');

  // Get log type private
  const dataLogType = await logType.findOne({
    where : { name : {[Op.eq] : `Public`}}
  })

  //Condition log logType
  if(!dataLogType) return res.status(500).send({success : false, message:`Accept ${model} failed, please try again`})

  //Create Activity Log
  let dataLog = {model : model, old_data : getData.dataValues, new_data : checkUpdate.dataValues}

  let insertLog = await logActivity.create({
    log_type_id : dataLogType.id,
    name : `Update Password ${model}`,
    description : `User update password ${model}`,
    data_log : dataLog,
    created_by : {
    type : "System",
    id : "",
    description : `System create log for updating ${model}`
    },
    updated_by : {
        type : "System",
        id : "",
        description : `System create log for updating ${model}`
    }
  })
  // console.log('insertlog berhasil');

  if(!insertLog) return res.status(500).send({success: false, message:`Accept ${model} failed, please try again`})

  res.status(200).send({
      success : true,
      message : `Update ${model} successfully`,
  })
})

controller.get(`/vendor`, async (req,res) => {

  var fetchUser = await user.findAll({
    attributes : ["id", "profile"]
  });

  var dataUser = []

  for(var i = 0; i < fetchUser.length; i ++){
    var isValidUser = false;
    for(var j = 0; j< fetchUser[i].dataValues.profile.permission.length; j++){
      if(fetchUser[i].dataValues.profile.permission[j].data.user != null){
        isValidUser = true
      }
    }

    if(isValidUser){
      dataUser.push(fetchUser[i].dataValues)
    }
  }

  res.status(200).send({
      success : true,
      message : "Success",
      data : dataUser
  })
})

controller.get(`/verified`, middleware.checkLinkToken, async (req,res) => {

  
  let getData = await user.findOne({
    where : {
      data_register: {
        data: {
          email: req.decoded.email,
        },
        type : `email`
      },
    }
  }) 

  if(!getData) return res.status(200).send({success: false, message: `Account not found, please register first`})

const updateProfile = await user.update({
  verify: true,
  updated_at : new Date(),
  updated_by : {
    type : "System",
    id : "",
    description : "User click verification link"
  }
},{
  where : { id : {[Op.eq] : getData.id}}
})

// Error update data login condition
if(!updateProfile) return res.status(500).send({success: false, message:"Update profile failed, please try again"})

const checkData = await user.findOne({
  where : { id : {[Op.eq] : getData.id}}
})

if(!checkData) return res.status(500).send({success: false, message:"Update profile failed, please try again"})

// Get log type system
const dataLogType = await logType.findOne({
  where : { name : {[Op.eq] : `System`}}
})

//Condition log logType
if(!dataLogType) return res.status(500).send({success : false, message:"Update profile failed, please try again"})

//Create Activity Log
let dataLog = {model : model, old_data : getData.dataValues, new_data : checkData.dataValues}

let insertLog = await logActivity.create({
  log_type_id : dataLogType.id,
  name : `Website Update Verification Information`,
  description : `${req.decoded.email} has upadated his/her information`,
  data_log : dataLog,
  created_by : {
    type : "System",
    id : "",
    description : "System create log authentication"
  },
  created_at : new Date()
})

if(!insertLog) return res.status(500).send({success: false, message:"Update profile failed, please try again"})
// Success Condition
  // res.status(200).send({
  //   success : true,
  //   message : "Verification successfully",
  // })
  res.redirect('https://diveinc.co/signin');
})

module.exports = controller
