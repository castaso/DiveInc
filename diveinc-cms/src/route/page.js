`use strict`

const route = require(`express`).Router({mergeParams : true})

const middleware = require('./middleware')

//Dashboard
route.get(`/`, middleware.goLogin, (req,res) => { res.render(`dashboard/home`) })
route.get(`/log`, middleware.goLogin, (req,res) => { res.render(`dashboard/log`) })

//Auth
route.get(`/login`, middleware.goHome, (req,res) => { res.render('auth/login') })
route.get(`/forgot-password`, middleware.goHome, (req,res) => { res.render('auth/forgot-password') })

//Master
route.get(`/general`, middleware.goLogin, (req,res) => { res.render(`master/general`) })
//route.get(`/general/add`, middleware.goLogin, (req,res) => { res.render(`master/general/add`) })
route.get(`/general/edit/:id`, middleware.goLogin, (req,res) => { res.render(`master/general/edit`, {id : req.params.id}) })

route.get(`/country`, middleware.goLogin, (req,res) => { res.render(`master/country`) })
route.get(`/country/add`, middleware.goLogin, (req,res) => { res.render(`master/country/add`) })
route.get(`/country/edit/:id`, middleware.goLogin, (req,res) => { res.render(`master/country/edit`, {id : req.params.id}) })

route.get(`/city`, middleware.goLogin, (req,res) => { res.render(`master/city`) })
route.get(`/city/add`, middleware.goLogin, (req,res) => { res.render(`master/city/add`) })
route.get(`/city/edit/:id`, middleware.goLogin, (req,res) => { res.render(`master/city/edit`, {id : req.params.id}) })

route.get(`/article`, middleware.goLogin, (req,res) => { res.render(`master/article`) })
route.get(`/article/add`, middleware.goLogin, (req,res) => { res.render(`master/article/add`) })
route.get(`/article/edit/:id`, middleware.goLogin, (req,res) => { res.render(`master/article/edit`, {id : req.params.id}) })

route.get(`/destination`, middleware.goLogin, (req,res) => { res.render(`master/destination`) })
route.get(`/destination/add`, middleware.goLogin, (req,res) => { res.render(`master/destination/add`) })
route.get(`/destination/edit/:id`, middleware.goLogin, (req,res) => { res.render(`master/destination/edit`, {id : req.params.id})})

route.get(`/sub-destination`, middleware.goLogin, (req,res) => { res.render(`master/subDestination`) })
route.get(`/sub-destination/add`, middleware.goLogin, (req,res) => { res.render(`master/subDestination/add`) })
route.get(`/sub-destination/edit/:id`, middleware.goLogin, (req,res) => { res.render(`master/subDestination/edit`, {id : req.params.id}) })

route.get(`/creature`, middleware.goLogin, (req,res) => { res.render(`master/creature`) })
route.get(`/creature/add`, middleware.goLogin, (req,res) => { res.render(`master/creature/add`) })
route.get(`/creature/edit/:id`, middleware.goLogin, (req,res) => { res.render(`master/creature/edit`, {id : req.params.id})})

route.get(`/transaction-wallet`, middleware.goLogin, (req,res) => { res.render(`master/transactionWallet`) })
route.get(`/transaction-wallet/add`, middleware.goLogin, (req,res) => { res.render(`master/transactionWallet/add`) })

route.get(`/transaction-wallet-admin`, middleware.goLogin, (req,res) => { res.render(`master/transactionWalletAdmin`) })


route.get(`/transaction-creator`, middleware.goLogin, (req,res) => { res.render(`master/transactionCreator`) })
route.get(`/transaction-creator/add`, middleware.goLogin, (req,res) => { res.render(`master/transactionCreator/add`) })

route.get(`/transaction-resort`, middleware.goLogin, (req,res) => { res.render(`master/transactionResort`) })
route.get(`/transaction-resort/show/:id`, middleware.goLogin, (req,res) => { res.render(`master/transactionResort/show`,{id : req.params.id}) })

route.get(`/transaction-divecenter`, middleware.goLogin, (req,res) => { res.render(`master/transactionDivecenter`) })
route.get(`/transaction-divecenter/show/:id`, middleware.goLogin, (req,res) => { res.render(`master/transactionDivecenter/show`,{id : req.params.id}) })

route.get(`/transaction-liveaboard`, middleware.goLogin, (req,res) => { res.render(`master/transactionLiveaboard`) })
route.get(`/transaction-liveaboard/show/:id`, middleware.goLogin, (req,res) => { res.render(`master/transactionLiveaboard/show`,{id : req.params.id}) })

route.get(`/testimony`, middleware.goLogin, (req,res) => { res.render(`master/testimony`) })
route.get(`/testimony/add`, middleware.goLogin, (req,res) => { res.render(`master/testimony/add`) })
route.get(`/testimony/edit/:id`, middleware.goLogin, (req,res) => { res.render(`master/testimony/edit`,{id : req.params.id}) })

route.get(`/ideal`, middleware.goLogin, (req,res) => { res.render(`master/ideal`) })
route.get(`/ideal/add`, middleware.goLogin, (req,res) => { res.render(`master/ideal/add`) })
route.get(`/ideal/edit/:id`, middleware.goLogin, (req,res) => { res.render(`master/ideal/edit`, {id : req.params.id}) })

route.get(`/language`, middleware.goLogin, (req,res) => { res.render(`master/language`) })
route.get(`/language/add`, middleware.goLogin, (req,res) => { res.render(`master/language/add`) })
route.get(`/language/edit/:id`, middleware.goLogin, (req,res) => { res.render(`master/language/edit`, {id : req.params.id}) })

route.get(`/sport`, middleware.goLogin, (req,res) => { res.render(`master/sport`) })
route.get(`/sport/add`, middleware.goLogin, (req,res) => { res.render(`master/sport/add`) })
route.get(`/sport/edit/:id`, middleware.goLogin, (req,res) => { res.render(`master/sport/edit`, {id : req.params.id}) })

route.get(`/facility`, middleware.goLogin, (req,res) => { res.render(`master/facility`) })
route.get(`/facility/add`, middleware.goLogin, (req,res) => { res.render(`master/facility/add`) })
route.get(`/facility/edit/:id`, middleware.goLogin, (req,res) => { res.render(`master/facility/edit`, {id : req.params.id}) })

route.get(`/room-amenity`, middleware.goLogin, (req,res) => { res.render(`master/roomAmenity`) })
route.get(`/room-amenity/add`, middleware.goLogin, (req,res) => { res.render(`master/roomAmenity/add`) })
route.get(`/room-amenity/edit/:id`, middleware.goLogin, (req,res) => { res.render(`master/roomAmenity/edit`, {id : req.params.id}) })

route.get(`/room-option`, middleware.goLogin, (req,res) => { res.render(`master/roomOption`) })
route.get(`/room-option/add`, middleware.goLogin, (req,res) => { res.render(`master/roomOption/add`) })
route.get(`/room-option/edit/:id`, middleware.goLogin, (req,res) => { res.render(`master/roomOption/edit`, {id : req.params.id}) })

route.get(`/activity`, middleware.goLogin, (req,res) => { res.render(`master/activity`) })
route.get(`/activity/add`, middleware.goLogin, (req,res) => { res.render(`master/activity/add`) })
route.get(`/activity/edit/:id`, middleware.goLogin, (req,res) => { res.render(`master/activity/edit`, {id : req.params.id}) })

route.use('*', (req,res) => { res.render('util/notfound') })

module.exports = route