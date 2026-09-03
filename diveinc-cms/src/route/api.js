`use strict`

const route = require(`express`).Router({mergeParams : true})
const auth = require(`@controller/auth`)
const upload = require(`@controller/upload`)
const general = require(`@controller/general`)
const country = require(`@controller/country`)
const city = require(`@controller/city`)
const article = require(`@controller/article`)
const articleCategory = require(`@controller/articleCategory`)
const destination = require(`@controller/destination`)
const subDestination = require(`@controller/subDestination`)
const transactionWallet = require(`@controller/transactionWallet`)
const transactionWalletAdmin = require(`@controller/transactionWalletAdmin`)
const transactionCreator = require(`@controller/transactionCreator`)
const transactionResort = require(`@controller/transactionResort`)
const transactionDivecenter = require(`@controller/transactionDivecenter`)
const transactionLiveaboard = require(`@controller/transactionLiveaboard`)
const creature = require(`@controller/creature`)
const testimoni = require(`@controller/testimoni`)
const ideal = require(`@controller/ideal`)
const language = require(`@controller/language`)
const sport = require(`@controller/sport`)
const facility = require(`@controller/facility`)
const roomAmenity = require(`@controller/roomAmenity`)
const roomOption = require(`@controller/roomOption`)
const activity = require(`@controller/activity`)
const user = require(`@controller/user`)

//Auth
route.post('/login', auth.login)

//upload
route.post(`/upload/image`, upload.image)
route.post(`/upload/file`, upload.image)
route.post(`/upload/video`, upload.image)

//Activity
// route.get(`/activity`, activity.getAll)

//General
route.get(`/general/datatable`, general.datatable)
route.get(`/general`, general.getAll)
route.get(`/general/:id`, general.getById)
route.post(`/general`, general.add)
route.put(`/general/:id`, general.update)
route.delete(`/general/:id`, general.delete)

//Country
route.get(`/country/datatable`, country.datatable)
route.get(`/country`, country.getAll)
route.get(`/country/:id`, country.getById)
route.post(`/country`, country.add)
route.put(`/country/:id`, country.update)
route.delete(`/country/:id`, country.delete)

//City
route.get(`/city/datatable`, city.datatable)
route.get(`/city`, city.getAll)
route.get(`/city/:id`, city.getById)
route.post(`/city`, city.add)
route.put(`/city/:id`, city.update)
route.delete(`/city/:id`, city.delete)

//Article
route.get(`/article/datatable`, article.datatable)
route.get(`/article`, article.getAll)
route.get(`/article/:id`, article.getById)
route.post(`/article`, article.add)
route.put(`/article/:id`, article.update)
route.delete(`/article/:id`, article.delete)

//Article Category
route.get(`/article-category/datatable`, articleCategory.datatable)
route.get(`/article-category`, articleCategory.getAll)
route.get(`/article-category/:id`, articleCategory.getById)
route.post(`/article-category`, articleCategory.add)
route.put(`/article-category/:id`, articleCategory.update)
route.delete(`/article-category/:id`, articleCategory.delete)

//Destination
route.get(`/destination/datatable`, destination.datatable)
route.get(`/destination`, destination.getAll)
route.get(`/destination/:id`, destination.getById)
route.post(`/destination`, destination.add)
route.put(`/destination/:id`, destination.update)
route.delete(`/destination/:id`, destination.delete)
route.get(`/destination/for-cms`, destination.getAll)


//Sub Destination
route.get(`/sub-destination/datatable`, subDestination.datatable)
route.get(`/sub-destination`, subDestination.getAll)
route.get(`/sub-destination/:id`, subDestination.getById)
route.post(`/sub-destination`, subDestination.add)
route.put(`/sub-destination/:id`, subDestination.update)
route.delete(`/sub-destination/:id`, subDestination.delete)
route.get(`/sub-destination/for-cms`)

//Creature
route.get(`/creature/datatable`, creature.datatable)
route.get(`/creature`, creature.getAll)
route.get(`/creature/:id`, creature.getById)
route.post(`/creature`, creature.add)
route.put(`/creature/:id`, creature.update)
route.delete(`/creature/:id`, creature.delete)

//Transaction Wallet
route.get(`/transaction-wallet/datatable`, transactionWallet.datatable)
route.get(`/transaction-wallet`, transactionWallet.getAll)
route.get(`/transaction-wallet/:id`, transactionWallet.getById)
route.post(`/transaction-wallet`, transactionWallet.add)
route.put(`/transaction-wallet/:id`, transactionWallet.update)
route.put(`/transaction-wallet/:id/accept`, transactionWallet.accept)
route.delete(`/transaction-wallet/:id`, transactionWallet.delete)

//Transaction Payment
route.get(`/transaction-wallet-admin/datatable`, transactionWalletAdmin.datatable)
route.get(`/transaction-wallet-admin`, transactionWalletAdmin.getAll)
route.get(`/transaction-wallet-admin/:id`, transactionWalletAdmin.getById)
route.post(`/transaction-wallet-admin`, transactionWalletAdmin.add)
route.put(`/transaction-wallet-admin/:id`, transactionWalletAdmin.update)
route.put(`/transaction-wallet-admin/:id/accept`, transactionWalletAdmin.accept)
route.put(`/transaction-wallet-admin/:id/accept-partial`, transactionWalletAdmin.acceptPartial)
route.delete(`/transaction-wallet-admin/:id`, transactionWalletAdmin.delete)

//Transaction Creator
route.get(`/transaction-creator/datatable`, transactionCreator.datatable)
route.get(`/transaction-creator`, transactionCreator.getAll)
route.get(`/transaction-creator/:id`, transactionCreator.getById)
route.post(`/transaction-creator`, transactionCreator.add)
route.put(`/transaction-creator/:id`, transactionCreator.update)
route.put(`/transaction-creator/:id/accept`, transactionCreator.accept)
route.put(`/transaction-creator/:id/reject`, transactionCreator.reject)
route.delete(`/transaction-creator/:id`, transactionCreator.delete)

//Transaction Resort
route.get(`/transaction-resort/datatable`, transactionResort.datatable)
route.get(`/transaction-resort`, transactionResort.getAll)
route.get(`/transaction-resort/:id`, transactionResort.getById)
route.put(`/transaction-resort/:id`, transactionResort.update)

//Transaction Dive Center
route.get(`/transaction-divecenter/datatable`, transactionDivecenter.datatable)
route.get(`/transaction-divecenter`, transactionDivecenter.getAll)
route.get(`/transaction-divecenter/:id`, transactionDivecenter.getById)
route.put(`/transaction-divecenter/:id`, transactionDivecenter.update)

//Transaction Live Aboard
route.get(`/transaction-liveaboard/datatable`, transactionLiveaboard.datatable)
route.get(`/transaction-liveaboard`, transactionLiveaboard.getAll)
route.get(`/transaction-liveaboard/:id`, transactionLiveaboard.getById)
route.put(`/transaction-liveaboard/:id`, transactionLiveaboard.update)
route.get(`/transaction-liveaboard/status`)

//Testimoni
route.get(`/testimony/datatable`, testimoni.datatable)
route.get(`/testimony`, testimoni.getAll)
route.get(`/testimony/:id`, testimoni.getById)
route.post(`/testimony`, testimoni.add)
route.put(`/testimony/:id`, testimoni.update)
route.delete(`/testimony/:id`, testimoni.delete)

//Ideal
route.get(`/ideal/datatable`, ideal.datatable)
route.get(`/ideal`, ideal.getAll)
route.get(`/ideal/:id`, ideal.getById)
route.post(`/ideal`, ideal.add)
route.put(`/ideal/:id`, ideal.update)
route.delete(`/ideal/:id`, ideal.delete)

//Language
route.get(`/language/datatable`, language.datatable)
route.get(`/language`, language.getAll)
route.get(`/language/:id`, language.getById)
route.post(`/language`, language.add)
route.put(`/language/:id`, language.update)
route.delete(`/language/:id`, language.delete)

//Sport
route.get(`/sport/datatable`, sport.datatable)
route.get(`/sport`, sport.getAll)
route.get(`/sport/:id`, sport.getById)
route.post(`/sport`, sport.add)
route.put(`/sport/:id`, sport.update)
route.delete(`/sport/:id`, sport.delete)

//Facility
route.get(`/facility/datatable`, facility.datatable)
route.get(`/facility`, facility.getAll)
route.get(`/facility/:id`, facility.getById)
route.post(`/facility`, facility.add)
route.put(`/facility/:id`, facility.update)
route.delete(`/facility/:id`, facility.delete)

//Room Amenity
route.get(`/room-amenity/datatable`, roomAmenity.datatable)
route.get(`/room-amenity`, roomAmenity.getAll)
route.get(`/room-amenity/:id`, roomAmenity.getById)
route.post(`/room-amenity`, roomAmenity.add)
route.put(`/room-amenity/:id`, roomAmenity.update)
route.delete(`/room-amenity/:id`, roomAmenity.delete)

//Room Option
route.get(`/room-option/datatable`, roomOption.datatable)
route.get(`/room-option`, roomOption.getAll)
route.get(`/room-option/:id`, roomOption.getById)
route.post(`/room-option`, roomOption.add)
route.put(`/room-option/:id`, roomOption.update)
route.delete(`/room-option/:id`, roomOption.delete)

//Activity
route.get(`/activity/datatable`, activity.datatable)
route.get(`/activity`, activity.getAll)
route.get(`/activity/:id`, activity.getById)
route.post(`/activity`, activity.add)
route.put(`/activity/:id`, activity.update)
route.delete(`/activity/:id`, activity.delete)

//User
route.get(`/user/vendor`, user.getAll)

module.exports = route
