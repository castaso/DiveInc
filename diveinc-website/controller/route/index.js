'use strict'

const route = require('express').Router({mergeParams : true})

route.get('/', (req,res) => {
    res.render('page/index')
})

// Assets View
route.get('/assets-button', (req,res) => {
    res.render('page/assets-button')
})

// Article
route.get('/article', (req,res) => {
    res.render('page/article')
})
// Article List
route.get('/article-read', (req,res) => {
    res.render('page/article-read')
})
// Article List (SAMPLE)
route.get('/article-read-2', (req,res) => {
    res.render('page/article-read-2')
})
// Article List (SAMPLE)
route.get('/article-read-mola-mola', (req,res) => {
    res.render('page/article-read-mola-mola')
})
// Article List (SAMPLE)
route.get('/article-read-manta', (req,res) => {
    res.render('page/article-read-manta')
})
// Article List (SAMPLE)
route.get('/article-read-sharks', (req,res) => {
    res.render('page/article-read-sharks')
})
// Article List (SAMPLE)
route.get('/article-read-turtles', (req,res) => {
    res.render('page/article-read-turtles')
})

route.get('/article-read/:id', (req,res) => {
    res.render('page/article-read', {id: req.params.id})
})

route.get('/destination/:id', (req,res) => {
    res.render('page/destination', {id: req.params.id})
})
// Destination
route.get('/sub-destination/:id', (req,res) => {
    res.render('page/sub-destination', {id: req.params.id})
})

// Resort
route.get('/resort/:id', (req,res) => {
    res.render('page/resort', {id : req.params.id})
})
// Liveaboards
route.get('/liveaboards/:id', (req,res) => {
    res.render('page/liveaboards', {id : req.params.id})
})
// Divecenter
route.get('/divecenter/:id', (req,res) => {
    res.render('page/divecenter', {id : req.params.id})
})

// Enquiry
route.get('/enquiry', (req,res) => {
    res.render('page/enquiry')
})

// Contribution
route.get('/contribution/:id', (req,res) => {
    res.render('page/contribution', {id : req.params.id})
})

// All Destination
route.get('/all-destination', (req,res) => {
    res.render('page/all-destination')
})
// All Creatures
route.get('/all-creatures', (req,res) => {
    res.render('page/all-creatures')
})

// Search
route.get('/search', (req,res) => {
    res.render('page/search')
})
route.get('/search-liveaboards', (req,res) => {
    res.render('page/search-liveaboards')
})

route.get('/search-divecenter', (req,res) => {
    res.render('page/search-divecenter')
})

route.get('/search-contribution', (req,res) => {
    res.render('page/search-contribution')
})

// Signup
route.get('/signup', (req,res) => {
    res.render('page/signup')
})
// Signin
route.get('/signin', (req,res) => {
    res.render('page/signin')
})
// Signin
route.get('/reset-password', (req,res) => {
    res.render('page/reset-password')
})

// Signin
route.get('/forgot-password', (req,res) => {
    res.render('page/forgot-password',{
        token:req.query.token
    })
})

// My Account
route.get('/my-account', (req,res) => {
    res.render('page/my-account')
})

// My Inbox
route.get('/my-inbox', (req,res) => {
    res.render('page/my-inbox')
})
// My Inbox Read
route.get('/my-inbox-read', (req,res) => {
    res.render('page/my-inbox-read')
})

// My Order
route.get('/my-order', (req,res) => {
    res.render('page/my-order')
})
route.get('/my-order/:type/my-order-detail/:id', (req,res) => {
    res.render('page/my-order-detail', {type:req.params.type, id: req.params.id})
})
route.get('/my-order-detail/:id', (req,res) => {
    res.render('page/my-order-detail', {id: req.params.id})
})

// My Wishlist
route.get('/my-wishlist', (req,res) => {
    res.render('page/my-wishlist')
})

// My Resort
route.get('/my-resort', (req,res) => {
    res.render('page/my-resort')
})
// My Resort Create
route.get('/my-resort-create', (req,res) => {
    res.render('page/my-resort-create', {id : null})
})
route.get('/my-resort-create/:id', (req,res) => {
    res.render('page/my-resort-create', {id: req.params.id})
})
// My Resort Create - Room
route.get('/my-resort-create/:parentId/my-resort-create-room', (req,res) => {
    res.render('page/my-resort-create-room', {parentId : req.params.parentId, id: null})
})
route.get('/my-resort-create/:parentId/my-resort-create-room/:id', (req,res) => {
    res.render('page/my-resort-create-room', {parentId : req.params.parentId, id: req.params.id})
})
// My Resort Create - Package
route.get('/my-resort-create/:parentId/my-resort-create-package', (req,res) => {
    res.render('page/my-resort-create-package', {parentId : req.params.parentId, id: null})
})
route.get('/my-resort-create/:parentId/my-resort-create-package/:id', (req,res) => {
    res.render('page/my-resort-create-package', {parentId : req.params.parentId, id: req.params.id})
})
// My Resort - Booking Management
route.get('/my-resort-booking-management', (req,res) => {
    res.render('page/my-resort-booking-management', {id : req.query.id})
})
// My Resort - Booking Management (Detail)
route.get('/my-resort-booking-management/:id', (req,res) => {
    res.render('page/my-resort-booking-management-detail', { id : req.params.id })
})

// My Liveaboards
route.get('/my-liveaboards', (req,res) => {
    res.render('page/my-liveaboards')
})
// My Liveaboards Schedule
route.get('/my-liveaboards-schedule', (req,res) => {
    res.render('page/my-liveaboards-schedule')
})
// My Liveaboards Create
route.get('/my-liveaboards-create', (req,res) => {
    res.render('page/my-liveaboards-create', {id : null})
})

route.get('/my-liveaboards-create/:id', (req,res) => {
    res.render('page/my-liveaboards-create', {id : req.params.id})
})
// My Liveaboards Create Cabin
route.get('/my-liveaboards-create/:parentId/my-liveaboards-create-cabin', (req,res) => {
    res.render('page/my-liveaboards-create-cabin', {parentId : req.params.parentId, id : null})
})
route.get('/my-liveaboards-create/:parentId/my-liveaboards-create-cabin/:id', (req,res) => {
    res.render('page/my-liveaboards-create-cabin', {parentId : req.params.parentId, id : req.params.id})
})
// My Liveaboards Create Package
route.get('/my-liveaboards-create/:parentId/my-liveaboards-create-package', (req,res) => {
    res.render('page/my-liveaboards-create-package', {parentId : req.params.parentId, id : null})
})
route.get('/my-liveaboards-create/:parentId/my-liveaboards-create-package/:id', (req,res) => {
    res.render('page/my-liveaboards-create-package', {parentId : req.params.parentId, id : req.params.id})
})
route.get('/my-liveaboards-create/:parentId/my-liveaboards-create-package/:id/schedule', (req,res) => {
    res.render('page/my-liveaboards-schedule', {parentId : req.params.parentId, id : req.params.id})
})

// My Liveaboards - Booking Management
route.get('/my-liveaboards-booking-management', (req,res) => {
    res.render('page/my-liveaboards-booking-management', { id : req.query.id })
})
// My Resort - Booking Management (Detail)
route.get('/my-liveaboards-booking-management/:id', (req,res) => {
    res.render('page/my-liveaboards-booking-management-detail', { id : req.params.id })
})

// My Divecenter
route.get('/my-divecenter-create', (req,res) => {
    res.render('page/my-divecenter-create', {id : null})
})
route.get('/my-divecenter-create/:id', (req,res) => {
    res.render('page/my-divecenter-create', {id: req.params.id})
})
// My Divecenter Create
route.get('/my-divecenter', (req,res) => {
    res.render('page/my-divecenter')
})
// My Divecenter Create Package
route.get('/my-divecenter-create/:parentId/my-divecenter-create-package', (req,res) => {
    res.render('page/my-divecenter-create-package', {parentId : req.params.parentId, id: null})
})
route.get('/my-divecenter-create/:parentId/my-divecenter-create-package/:id', (req,res) => {
    res.render('page/my-divecenter-create-package', {parentId : req.params.parentId, id: req.params.id})
})

// My Divecenter Booking Management
route.get('/my-divecenter-booking-management', (req,res) => {
    res.render('page/my-divecenter-booking-management', {id : req.query.id});
})
// My Resort - Booking Management (Detail)
route.get('/my-divecenter-booking-management/:id', (req,res) => {
    res.render('page/my-divecenter-booking-management-detail', { id : req.params.id })
})
// My Divecenter Schedule
route.get('/my-divecenter-schedule', (req,res) => {
    res.render('page/my-divecenter-schedule')
})

// My Contribution
route.get('/my-contribution', (req,res) => {
    res.render('page/my-contribution')
})

// My Contribution Create
route.get('/my-contribution-create', (req,res) => {
    res.render('page/my-contribution-create', { id : null })
})
route.get('/my-contribution-create/:id', (req,res) => {
    res.render('page/my-contribution-create', { id : req.params.id })
})

// Checkout
route.get('/checkout', (req,res) => {
    res.render('page/checkout')
})
route.get('/checkout-2', (req,res) => {
    res.render('page/checkout-2')
})
route.get('/checkout-3', (req,res) => {
    res.render('page/checkout-3')
})
route.get('/checkout-4', (req,res) => {
    res.render('page/checkout-4')
})

// Checkout Resort
route.get('/checkout-resort/:id/schedule', (req,res) => {
    res.render('page/checkout-resort', {id : req.params.id})
})
route.get('/checkout-resort/:id/extra', (req,res) => {
    res.render('page/checkout-resort-2', {id : req.params.id})
})
route.get('/checkout-resort/:id/guest', (req,res) => {
    res.render('page/checkout-resort-3', {id : req.params.id})
})
route.get('/checkout-resort/:id/reserve', (req,res) => {
    res.render('page/checkout-resort-4', {id : req.params.id})
})

// Checkout Divecenter
route.get('/checkout-divecenter/:id/schedule', (req,res) => {
    res.render('page/checkout-divecenter', {id : req.params.id})
})
route.get('/checkout-divecenter/:id/extra', (req,res) => {
    res.render('page/checkout-divecenter-2', {id : req.params.id})
})
route.get('/checkout-divecenter/:id/guest', (req,res) => {
    res.render('page/checkout-divecenter-3', {id : req.params.id})
})
route.get('/checkout-divecenter/:id/reserve', (req,res) => {
    res.render('page/checkout-divecenter-4', {id : req.params.id})
})

route.get('/checkout-liveaboards/:id/room', (req,res) => {
    res.render('page/checkout', {id : req.params.id})
})
route.get('/checkout-liveaboards/:id/extra', (req,res) => {
    res.render('page/checkout-2', {id : req.params.id})
})
route.get('/checkout-liveaboards/:id/guest', (req,res) => {
    res.render('page/checkout-3', {id : req.params.id})
})
route.get('/checkout-liveaboards/:id/reserve', (req,res) => {
    res.render('page/checkout-4', {id : req.params.id})
})

// Personalization Booking
route.get('/personal-question-1', (req,res) => {
    res.render('page/personal-question-1')
})
route.get('/personal-question-2', (req,res) => {
    res.render('page/personal-question-2')
})
route.get('/personal-question-3', (req,res) => {
    res.render('page/personal-question-3')
})
route.get('/personal-question-4', (req,res) => {
    res.render('page/personal-question-4')
})
route.get('/personal-question-5', (req,res) => {
    res.render('page/personal-question-5')
})
route.get('/personal-question-6', (req,res) => {
    res.render('page/personal-question-6')
})
route.get('/personal-question-7', (req,res) => {
    res.render('page/personal-question-7')
})

// Verify Company
route.get('/verify-company-resort', (req,res) => {
    res.render('page/verify-company-resort')
})
route.get('/verify-company-liveaboards', (req,res) => {
    res.render('page/verify-company-liveaboard')
})
route.get('/verify-company-divecenter', (req,res) => {
    res.render('page/verify-company-divecenter')
})
route.get('/verify-company-contribution', (req,res) => {
    res.render('page/verify-company-contribution')
})

// Terms
route.get('/terms-conditions', (req,res) => {
    res.render('page/terms-conditions')
})
route.get('/privacy-policy', (req,res) => {
    res.render('page/privacy-policy')
})
route.get('/terms-of-website-use', (req,res) => {
    res.render('page/terms-of-website-use')
})

// FAQ
route.get('/faq', (req,res) => {
    res.render('page/faq')
})

module.exports = route