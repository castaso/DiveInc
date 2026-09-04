`use strict`

const route = require(`express`).Router({mergeParams : true})
const axios = require(`@service/axios`)

const upload = require('@controller/upload')

function parseCookies (request) { 
    var list = {},
        rc = request.headers.cookie

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=')
        list[parts.shift().trim()] = decodeURI(parts.join('='))
    });

    return list;
}

function formatRupiah(angka){
    // console.log("ANGKAAAAAA")
    // console.log(angka)
    // console.log("-=========")
    var number_string = angka.toString(),
    sisa     		= number_string.length % 3,
    rupiah     		= number_string.substr(0, sisa),
    ribuan     		= number_string.substr(sisa).match(/\d{3}/gi);

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if (ribuan) {
        var separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    return rupiah
}

function dateFormatSM(tanggal){
    if (typeof tanggal !== 'undefined') {
        let tgl = tanggal.toString().substring(0,10).split('-');
        const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        return tgl[2]+' '+monthNamesShort[tgl[1]-1]+' '+tgl[0];
    }else{
        return tanggal;
    }
}

function dateFormatMonth(tanggal){
    let tgl = tanggal.toString().substring(0,10).split('-');
    const monthNamesShort = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    return tgl[2]+' '+monthNamesShort[tgl[1]-1]+' '+tgl[0];
}

//upload
route.post(`/upload/image`, upload.image)
route.post(`/upload/file`, upload.file)
route.post(`/upload/video`, upload.video)

route.post('/xendit/paid', async(req,res) => {
    var cookie = parseCookies(req)
    let login = await axios.call(`v1/transaction-wallet/paid`, `POST`, req.body, null, null, req._parsedUrl.query)
    if(!login.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(login.status).send(login.data)
})

route.post('/xendit/disburst', async(req,res) => {
    var cookie = parseCookies(req)
    let login = await axios.call(`v1/transaction-wallet/disburst`, `POST`, req.body, null, null, req._parsedUrl.query)
    if(!login.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(login.status).send(login.data)
})

route.post('/login/email', async(req,res) => {
    var cookie = parseCookies(req)
    let login = await axios.call(`v1/user/website/login/email`, `POST`, req.body, null, null, req._parsedUrl.query)
    if(!login.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(login.status).send(login.data)
})

route.post('/register/email', async(req,res) => {
    var cookie = parseCookies(req)
    let register = await axios.call(`v1/user/website/register/email`, `POST`, req.body, null, null, req._parsedUrl.query)
    if(!register.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(register.status).send(register.data)
})

route.post('/forget-password/email', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/user/website/forget-password/email`, `POST`, req.body, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/forgot-password-form', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/user/website/forgot-password`, `GET`, req.body, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/ganti-password', async(req,res) => {
    // var cookie = parseCookies(req)
    // console.log('cookie',cookie);
    let data = await axios.call(`v1/user/ganti-password`, `PUT`, req.body, req.body.token, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/change-password', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/user/change-password`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/my-permission', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/user/my-permission`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/my-profile', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/user/my-profile`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.post('/my-profile/save-info', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/user/my-profile/save-info`, `POST`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.post('/my-profile/save-wallet', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/user/my-profile/save-wallet`, `POST`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.post('/withdrawl', async(req,res) => {
    var cookie = parseCookies(req)
    let destination = await axios.call(`v1/transaction-wallet`, `POST`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!destination.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(destination.status).send(destination.data)
})

route.get('/my-order', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/user/my-order`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/my-order-detail/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/user/my-order-detail`, `GET`, null, cookie.accessTokenDiveincWebsite, req.params.id, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/destination', async(req,res) => {
    var cookie = parseCookies(req)
    let destination = await axios.call(`v1/destination`, `GET`, null, null, null, req._parsedUrl.query)
    if(!destination.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(destination.status).send(destination.data)
})

route.get('/destination/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let destination = await axios.call(`v1/destination/`, `GET`, null, null, req.params.id, req._parsedUrl.query)
    if(!destination.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(destination.status).send(destination.data)
})

route.get('/sub-destination/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let destination = await axios.call(`v1/sub-destination/`, `GET`, null, null, req.params.id, req._parsedUrl.query)
    if(!destination.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(destination.status).send(destination.data)
})

route.get('/destination/:id/excepted', async(req,res) => {
    var cookie = parseCookies(req)
    let destination = await axios.call(`v1/destination/${req.params.id}/excepted`, `GET`, null, null, null, req._parsedUrl.query)
    if(!destination.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(destination.status).send(destination.data)
})

route.get('/creature', async(req,res) => {
    var cookie = parseCookies(req)
    let creature = await axios.call(`v1/creature`, `GET`, null, null, null, req._parsedUrl.query)
    if(!creature.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(creature.status).send(creature.data)
})

route.post('/transaction-creator', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-creator`, `POST`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/ideal', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/ideal`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/room-option', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/room-option`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/room-aminity', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/room-aminity`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/language', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/language`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/activity', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/activity`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/facility', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/facility`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/sport', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/sport`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/country', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/country`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/bank', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/bank`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/city/:id/country', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/city/${req.params.id}/country`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/destination/:id/country', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/destination/${req.params.id}/country`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/sub-destination/:id/destination', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/sub-destination/${req.params.id}/destination`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/resort', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/resort`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/my-resort', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/resort/my-resort`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/resort/publish', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/resort/publish`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.post('/resort', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/resort`, `POST`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/resort/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/resort/${req.params.id}`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/resort/sub-destination/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/resort/sub-destination/${req.params.id}`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/resort/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/resort/${req.params.id}`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/resort/:id/publish', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/resort/${req.params.id}/publish`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/divecenter', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/divecenter`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/my-divecenter', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/divecenter/my-divecenter`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/divecenter/publish', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/divecenter/publish`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.post('/divecenter', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/divecenter`, `POST`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/divecenter/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/divecenter/${req.params.id}`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/divecenter/sub-destination/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/divecenter/sub-destination/${req.params.id}`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/divecenter/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/divecenter/${req.params.id}`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/divecenter/:id/publish', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/divecenter/${req.params.id}/publish`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/liveaboard', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/liveaboard`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/my-liveaboard', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/liveaboard/my-liveaboard`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/liveaboard/publish', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/liveaboard/publish`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.post('/liveaboard', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/liveaboard`, `POST`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/liveaboard/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/liveaboard/${req.params.id}`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/liveaboard/sub-destination/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/liveaboard/sub-destination/${req.params.id}`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/liveaboard/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/liveaboard/${req.params.id}`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/liveaboard/:id/publish', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/liveaboard/${req.params.id}/publish`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/liveaboard-package/:id/room', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-liveaboard/${req.params.id}/list-checkout-room`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.post('/schedule', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/schedule`, `POST`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.post('/contribution', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/contribution`, `POST`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/contribution/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/contribution/${req.params.id}`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/contribution/:id/publish', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/contribution/${req.params.id}/publish`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/contribution/:id/document', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/contribution/${req.params.id}/document`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})


route.put('/ongoing/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/schedule/ongoing`, `PUT`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/open/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/schedule/${req.params.id}/open`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/close/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/schedule/${req.params.id}/close`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/delete/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/schedule/${req.params.id}/delete`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.post('/room', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/room`, `POST`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/room/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/room/${req.params.id}`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/room/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/room/${req.params.id}`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.delete('/room/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/room/${req.params.id}`, `DELETE`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/room/:id/publish', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/room/${req.params.id}/publish`, `PUT`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.post('/package', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/package`, `POST`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/package/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/package/${req.params.id}`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/package/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/package/${req.params.id}`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.delete('/package/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/package/${req.params.id}`, `DELETE`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/package/:id/publish', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/package/${req.params.id}/publish`, `PUT`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/contribution', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/contribution`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/my-contribution', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/contribution/my-contribution`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.post('/my-contribution', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/my-contribution`, `POST`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/my-contribution/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/my-contribution/${req.params.id}`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/contribution/publish', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/contribution/publish`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/contribution/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/contribution/${req.params.id}`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/contribution/sub-destination/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/contribution/sub-destination/${req.params.id}`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.post('/transaction-contribution', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-contribution`, `POST`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.post('/transaction-resort', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-resort`, `POST`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/transaction-resort/:id/schedule', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-resort/${req.params.id}/schedule`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/transaction-resort/:id/extra', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-resort/${req.params.id}/extra`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/transaction-resort/:id/guest', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-resort/${req.params.id}/guest`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/transaction-resort/:id/approve', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-resort/${req.params.id}/approve`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/transaction-resort/:id/reject', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-resort/${req.params.id}/reject`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/transaction-resort/:id/cancel', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-resort/${req.params.id}/cancel`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/transaction-resort/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-resort/${req.params.id}`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.post('/transaction-divecenter', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-divecenter`, `POST`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/transaction-divecenter/:id/schedule', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-divecenter/${req.params.id}/schedule`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/transaction-divecenter/:id/extra', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-divecenter/${req.params.id}/extra`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/transaction-divecenter/:id/guest', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-divecenter/${req.params.id}/guest`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/transaction-divecenter/:id/approve', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-divecenter/${req.params.id}/approve`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/transaction-divecenter/:id/reject', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-divecenter/${req.params.id}/reject`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/transaction-divecenter/:id/cancel', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-divecenter/${req.params.id}/cancel`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})


route.get('/transaction-divecenter/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-divecenter/${req.params.id}`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.post('/transaction-liveaboard', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-liveaboard`, `POST`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/transaction-liveaboard/:id/schedule', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-liveaboard/${req.params.id}/schedule`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/transaction-liveaboard/:id/extra', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-liveaboard/${req.params.id}/extra`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/transaction-liveaboard/:id/guest', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-liveaboard/${req.params.id}/guest`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/transaction-liveaboard/:id/approve', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-liveaboard/${req.params.id}/approve`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/transaction-liveaboard/:id/reject', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-liveaboard/${req.params.id}/reject`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.put('/transaction-liveaboard/:id/cancel', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-liveaboard/${req.params.id}/cancel`, `PUT`, req.body, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/transaction-liveaboard/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/transaction-liveaboard/${req.params.id}`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/article/:id', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/article/${req.params.id}`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/article', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/article`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/testimony', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/testimony`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/general', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/general`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/room/:id/liveaboard', async(req,res) => {
    var cookie = parseCookies(req)
    let data = await axios.call(`v1/room/${req.params.id}/liveaboard`, `GET`, null, null, null, req._parsedUrl.query)
    if(!data.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    res.status(data.status).send(data.data)
})

route.get('/datatable-schedule/:id', async(req,res) => {
    var cookie = parseCookies(req)
        
    let result = await axios.call(`v1/schedule/datatable/${req.params.id}`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    
    // console.log(result.data.data);
    if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    var data = []
    for(var x = 0; x < result.data.data.length; x++){
        var oneData = []
        
        let tgl_start = result.data.data[x].schedule_date.split('-').reverse().join('-');
        let tgl_start_add = new Date(tgl_start);
        let dS = new Date(tgl_start);
        let dayCount = result.data.data[x].package.info.duration.day;
        
        let tgl_end = new Date(dS.setDate(tgl_start_add.getDate() + parseInt(dayCount) - 1));
        // console.log(dayCount,tgl_start_add.getDate());
        let tgl_end_show =(tgl_end.getFullYear()+'-'+(tgl_end.getMonth()+1).toString().padStart(2,'0')+'-'+tgl_end.getDate().toString().padStart(2,'0'));
        let tglStart = dateFormatSM(tgl_start);
        let tglEnd = dateFormatSM(tgl_end_show);
        // console.log(tgl_start_add, tgl_end);
        // console.log(tglShow);
        
        // oneData.push(`<p style="font-size:14px;">${dateFormatMonth(result.data.data[x].schedule_date.split('-').reverse().join('-'))}</p>`)
        oneData.push(`<p>${tglStart}</p>`)
        oneData.push(`<p>${tglEnd}</p>`)
        oneData.push(`<p>${dayCount} days</p>`)
        oneData.push(`<p>${result.data.data[x].package.info.name}</p>`)
        oneData.push(`<p>${result.data.data[x].schedule_status.name}</p>`)

        if(result.data.data[x].schedule_status_id == "c7999dce-19b7-4bfd-84cc-d2f0845a3d86"){
            //oneData.push("Ordered")
            oneData.push(`
            <div class="d-flex">
            <button type="button" onclick="closeSchedule('${result.data.data[x].id}','${result.data.data[x].schedule_date}')" class="btn btn-sm btn-outline-primary close-schedule"><i class="fas fa-ban mr-2"></i>Close</button>
            <button type="button" onclick="removeScheduleDate('${result.data.data[x].id}','${result.data.data[x].schedule_date}')" class="btn btn-sm btn-outline-primary delete-schedule" ><i class="fas fa-trash mr-2"></i>Delete</button>
            </div>
            `)
        }else if(result.data.data[x].schedule_status_id == "d2f95bbe-159b-4447-9e07-33925e04c5e9"){
            oneData.push("-")
            oneData.push(`
            <div class="d-block mb-1">
                <button type="button" onclick="removeScheduleDate('${result.data.data[x].id}','${result.data.data[x].schedule_date}')" class="btn btn-sm btn-outline-primary" ><i class="fas fa-trash mr-2"></i>Delete</button>
            </div>
            `)
        }else if(result.data.data[x].schedule_status_id != '59cfbb65-efff-4d25-aae1-b439efa62188'){}
        else{
            oneData.push(`
                <div class="d-flex">
                <button type="button" onclick="openSchedule('${result.data.data[x].id}','${result.data.data[x].schedule_date}')" class="btn btn-sm btn-outline-primary"><i class="fas fa-check mr-2"></i>Open</button>
                <button type="button" onclick="removeScheduleDate('${result.data.data[x].id}','${result.data.data[x].schedule_date}')" class="btn btn-sm btn-outline-primary" ><i class="fas fa-trash mr-2"></i>Delete</button>
                </div>
            `)
        }
        
        
        data.push(oneData)
    }
    var hardcode = {
        draw : result.data.dataTableInfo.draw,
        recordsTotal : result.data.dataTableInfo.recordsTotal,
        recordsFiltered : result.data.dataTableInfo.recordsFiltered,
        data : data
    }
    
    // res.status(result.status).send(result.data)
    res.status(result.status).send(hardcode)
})


/* route.get('/datatable-resort', async(req,res) => {

    //console.log(cookie.accessToken)
    var cookie = parseCookies(req)
    var resort_id = req.query.id;
        
    let result = await axios.call(`v1/transaction-resort/datatable-vendor`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    //console.log(result)
    if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    
    var general = result.data.general

    var data = []
    for(var x = 0; x < result.data.data.length; x++){
        var oneData = []
        oneData.push(`<p style="font-size:14px;">${result.data.data[x].transaction_code}</p>`)
        // console.log(result.data.data[x].resort_id +' == '+ resort_id);
        //if (result.data.data[x].resort_id ==  resort_id) {
            var packageData = result.data.data[x].package_data
            
            // console.log('harga package',packageData.package);
            // console.log('harga room',packageData.room);
            var htmlTotal = ""
            var totalPrice = 0;
            var packDateList =[];
            if(packageData.package && typeof packageData.package !== 'undefined'){
                var htmlPackage = ``
                for(var i = 0; i< packageData.package.length; i++){
                    var htmlPackageItem = ``
                    htmlPackage = `${packageData.package[i].packageName}</br>`
                    var totalSummary = 0
                    for (let pi_idx = 0; pi_idx < packageData.package[i].packageItem.length; pi_idx++) {
                        var summaryPrice = parseFloat(packageData.package[i].packagePrice) * parseFloat(packageData.package[i].packageItem[pi_idx].guest);
                        totalSummary += summaryPrice;
                        
                    }

                    var htmlService = `&nbsp;&nbsp;&nbsp;&nbsp; Service : </br>`
                    for (let m = 0; m < packageData.package[i].packageItem.length; m++) {
                        let pck = packageData.package[i].packageItem[m];
                        packDateList.push(pck.package_date);
                        // console.log('pck',packDateList);
                        for(var k = 0; k < pck.service.length; k++){
                            if(pck.service[k].qty > 0){
                                // $(`#extra${packageData.package[i].id}`).append(`
                                //     <div class="list-person--item text-muted">
                                //         <div><i class="fas fa-plus fa-sm fas-fix mr-1"></i>${packageData.package[i].service[k].name} (IDR&nbsp;${packageData.package[i].service[k].price} x${packageData.package[i].service[k].qty})</div>
                                //         <div class="list-price ml-2">IDR&nbsp; ${parseFloat(packageData.package[i].service[k].price) * parseFloat(packageData.package[i].service[k].qty)}</div>
                                //     </div>
                                // `)
                                htmlService += `&nbsp;&nbsp;&nbsp;&nbsp; -${pck.service[k].name} x${pck.service[k].qty}</br>` 
                                totalSummary += (parseFloat(pck.service[k].price) * parseFloat(pck.service[k].qty));
                            }else{
                                htmlService += `&nbsp;&nbsp;&nbsp;&nbsp; None<br/>`
                            }
                            htmlPackageItem += htmlService
                        }
                        
                    }
    
                    //$(`#summaryTotal${packageData.package[i].id}`).text(totalSummary) 
                    totalPrice += totalSummary
                    htmlPackage += htmlPackageItem
                    // console.log("totalPrice2 package  +=",totalPrice);
                    
                }
            }

            var packDate = packDateList.join(',');
            // console.log('pDate',packDateList,packDate);
    
            if(packageData.room){
                var night = (new Date(packageData.room_date.to) - new Date(packageData.room_date.from)) / (1000 * 3600 * 24)
                var htmlRoom = ``
                for(var i = 0; i < packageData.room.length; i++){
                    var htmlRoomItem = ``
                    htmlRoom = `${packageData.room[i].roomName}</br>`
                    var totalSummary = 0
                    for(var j = 0; j < packageData.room[i].roomItem.length; j++){
                        htmlRoomItem = `&nbsp; Room ${j+1}</br>`
                        var htmlService = `&nbsp;&nbsp;&nbsp;&nbsp; Service : </br>`
                        var summaryPrice = parseFloat(night) * parseFloat(packageData.room[i].roomPrice)
                        totalSummary += summaryPrice
                        if(packageData.room[i].roomItem[j].service){
                            for(var k = 0; k < packageData.room[i].roomItem[j].service.length; k++){
                                if(packageData.room[i].roomItem[j].service[k].qty > 0){
                                    htmlService += `&nbsp;&nbsp;&nbsp;&nbsp; -${packageData.room[i].roomItem[j].service[k].name} x${packageData.room[i].roomItem[j].service[k].qty}</br>` 
                                    totalSummary += (parseFloat(packageData.room[i].roomItem[j].service[k].price) * parseFloat(packageData.room[i].roomItem[j].service[k].qty))
                                }
                            }
                        }else{
                            htmlService += `&nbsp;&nbsp;&nbsp;&nbsp; None`
                        }
                        htmlRoomItem += htmlService
                    }

                    totalPrice += totalSummary
                    htmlRoom += htmlRoomItem
                }
                
                htmlTotal = (typeof htmlPackage !== "undefined" ? htmlPackage : "") + (typeof htmlRoom !== 'undefined' ? htmlRoom : "");
                oneData.push(`<p style="font-size:12px;">${htmlTotal}</p>`)
                let fromDate = (packageData.room_date.from ? packageData.room_date.from : '-')
                fromDate = (fromDate != '-' ? fromDate.toString().substring(0,10).split('-').reverse().join('-') : '');
                let toDate = (packageData.room_date.to ? packageData.room_date.to : '-')
                toDate = (toDate != '-' ? toDate.toString().substring(0,10).split('-').reverse().join('-') : '');
                oneData.push(`
                    <h5>Package :</h5>
                    <p style="font-size:14px;">Date : ${(packDate == '' ?'-':packDate)}</p>
                    <h5>Room : </h5>
                    <p style="font-size:14px;">From : ${fromDate} </br> To : ${toDate}</p>`
                )
    
            }else{
                oneData.push("-")
                oneData.push("-")
            }
            
            oneData.push(`Total : IDR ${formatRupiah(totalPrice)}<br>
                Diveinc fee : IDR ${formatRupiah(totalPrice * (general.resort_fee / 100))}<br>
                Your income : IDR ${formatRupiah(totalPrice - (totalPrice * (general.resort_fee / 100)))}
            `)
            // oneData.push(`IDR ${totalPrice + (totalPrice / 10)}`)
            // oneData.push(`IDR ${totalPrice + (totalPrice / 10)}`)
            let namaStatus = [];
            
                namaStatus['c7999dce-19b7-4bfd-84cc-d2f0845a3d86'] = "created";
                namaStatus['d2f95bbe-159b-4447-9e07-33925e04c5e9'] = "scheduled";
                namaStatus['59cfbb65-efff-4d25-aae1-b439efa62188'] = "extra data";
                namaStatus['b648ff73-468f-45cb-bbbc-fd3659e4b8ac'] = "guest data";
                namaStatus['b648ff73-468f-45cb-babc-fd3459e4b8ac'] = "reserved";
                namaStatus['bbb8ff73-468f-45cb-babc-fd3444e4b8ac'] = "approved";
                namaStatus['bcc8ff73-468f-45cb-babc-fd34cce4b8ac'] = "rejected";
                namaStatus['bcc8ff37-468f-45cb-bccc-fd34cce4b8ac'] = "transfered";
                namaStatus['baa8ff37-468f-45cb-bccc-fd34aae4b8ac'] = "done";
                namaStatus['baa8ff37-468f-455b-b5c5-fc34aae4b8ac'] = "Cancelled";
            
            let status_id = result.data.data[x].transaction_resort_status_id; 
            let button_list = '';
            if(status_id == "b648ff73-468f-45cb-bbbc-fd3659e4b8ac"){
                oneData.push("Ordered")
                button_list = `<div class="d-flex">
                    <button onClick="confirm('${result.data.data[x].id}')" class="btnConfirmBooking btn btn-sm btn-success flex-grow-1 mr-1"><i class="fas fa-check"></i></button>
                    <button onClick="decline('${result.data.data[x].id}')" class="btnDeclineBooking btn btn-sm btn-danger flex-grow-1"><i class="fas fa-times"></i></button>
                </div>`;
            }else if(status_id == "bbb8ff73-468f-45cb-babc-fd3444e4b8ac"){
                oneData.push("Approved")
            }else if(status_id == "bcc8ff73-468f-45cb-babc-fd34cce4b8ac"){
                oneData.push("Rejected")
            }else{
                oneData.push(namaStatus[status_id]);
            }
    
            oneData.push(`
                <div class="d-block mb-1">
                    <a onClick="getDetail('${result.data.data[x].id}')" class="btn btn-sm btn-outline-primary btn-block"><i class="fas fa-eye mr-2"></i>Details</a>
                </div>${button_list}`)
            
            data.push(oneData)
        //}
    }
    var hardcode = {
        draw : result.data.dataTableInfo.draw,
        recordsTotal : result.data.dataTableInfo.recordsTotal,
        recordsFiltered : result.data.dataTableInfo.recordsFiltered,
        data : data
    }
    
    res.status(result.status).send(hardcode)
}) */

route.get('/datatable-resort', async(req,res) => {

    //console.log(cookie.accessToken)
    var cookie = parseCookies(req)
    var resort_id = req.query.id;
        
    let result = await axios.call(`v1/transaction-resort/datatable-vendor`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    
    var general = result.data.general

    var data = []
    let dataResult = result.data.data
    
    for(var x = 0; x < dataResult.length; x++){
        var oneData = []
        let created = dataResult[x].created_at.split('T');
        let tgl = created[0].split('-').reverse().join('-');
        let time = created[1].substr(0,8).split(':');
        oneData.push(`<p>${result.data.data[x].transaction_code}<br/>created : <br/>${tgl} ${(parseInt(time[0])+7)%24}:${time[1]}:${time[2]} WIB</p>`)
        // console.log(result.data.data[x].resort_id +' == '+ resort_id);
        //if (result.data.data[x].resort_id ==  resort_id) {
            var packageData = result.data.data[x].package_data
            
            // console.log('harga package',packageData.package);
            // console.log('harga room',packageData.room);
            var htmlTotal = ""
            var totalPrice = 0;
            var packDateList =[];

            // var packDate = packDateList.join(',');
            // console.log('pDate',packDateList,packDate);

            //===============================room=================================
            if(packageData.room){
                if(packageData.room_date){
                    var night = (new Date(packageData.room_date.to) - new Date(packageData.room_date.from)) / (1000 * 3600 * 24)
                    let fromDate = (packageData.room_date.from ? packageData.room_date.from : '-')
                    fromDate = (fromDate != '-' ? dateFormatSM(fromDate) : '');
                    let toDate = (packageData.room_date.to ? packageData.room_date.to : '-')
                    toDate = (toDate != '-' ? dateFormatSM(toDate) : '');
                    var htmlRoom = ``
                    for(var i = 0; i < packageData.room.length; i++){
                        var htmlRoomItem = ``
                        htmlRoom = `<tr style='background:#9dccf5'><td colspan='2' style='padding:0px 5px;'><b>${packageData.room[i].roomName}</b></td></tr>`
                        var totalSummary = 0
                        for(var j = 0; j < packageData.room[i].roomItem.length; j++){
                            htmlRoomItem = `<tr><td style='padding:0px 5px; border:none' colspan='2'>Room ${j+1}</td></tr>`
                            htmlRoomItem = `<tr><td style='padding:0px 5px; border:none'>Guest </td><td style='padding:0px 5px; border:none; text-align:right'> x ${packageData.room[i].roomItem[j].guest}</td></tr>`
                            // var htmlService = `<tr><td style='padding:0px; border:none'>Service</td><td style='padding:0px; border:none'></td></tr>`
                            var htmlService = '';
                            var summaryPrice = parseFloat(night) * parseFloat(packageData.room[i].roomPrice)
                            var serviceContent = '';
                            totalSummary += summaryPrice
                            if(packageData.room[i].roomItem[j].service){
                                for(var k = 0; k < packageData.room[i].roomItem[j].service.length; k++){
                                    if(packageData.room[i].roomItem[j].service[k].qty > 0){
                                        serviceContent += `<tr style='font-size:0.8em'><td style='padding:0px; padding-left:10px; border:none; '>+ ${packageData.room[i].roomItem[j].service[k].name}</td> <td style='padding:0px 5px; border:none; text-align:right'>x ${packageData.room[i].roomItem[j].service[k].qty}</td></tr>` 
                                        totalSummary += (parseFloat(packageData.room[i].roomItem[j].service[k].price) * parseFloat(packageData.room[i].roomItem[j].service[k].qty))
                                    }
                                }
                            }
                            if (serviceContent == '') {
                                // htmlService = `<tr><td style='padding:0px; border:none'>Service </td><td style='padding:0px; border:none'></td><td style='padding:0px; border:none'></td></tr>`
                            var htmlService = ``
                                // serviceContent = `<tr><td style='padding:0px; border:none' colspan='3'>None</td></tr>` 
                            }
                            htmlService += serviceContent
                            htmlRoomItem += htmlService
                        }

                        totalPrice += totalSummary
                        htmlRoom += htmlRoomItem
                    }
                    
                    var htmlTotal = (typeof htmlRoom !== 'undefined' ? htmlRoom : "");
                    oneData.push(`<table width='100%' style='font-size:0.9em'><tr><td style='padding:0px; border:none' colspan='2'><i class='fa fa-calendar'></i> : <span style='font-weight:bold'>${fromDate} - ${toDate}</span></td></tr>${htmlTotal}</table>`)
                    /* oneData.push(`
                        <h5>Package :</h5>
                        <p style="font-size:14px;">Date : ${(packDate == '' ?'-':packDate)}</p>
                        <h5>Room : </h5>
                        <p style="font-size:14px;">From : ${fromDate} </br> To : ${toDate}</p>`
                    ) */
                }else{
                    oneData.push("<small><i>no schedule seted</i></small>")
                }
    
            }else{
                // oneData.push("-")
                oneData.push("<small><i>no room</i></small>")
            }

            //===============================package=================================
            if(packageData.package && typeof packageData.package !== 'undefined'){
                var htmlPackage = ``
                for(var i = 0; i< packageData.package.length; i++){
                    var htmlPackageItem = ``
                    var totalSummary = 0
                    for (let pi_idx = 0; pi_idx < packageData.package[i].packageItem.length; pi_idx++) {
                        var summaryPrice = parseFloat(packageData.package[i].packagePrice) * parseFloat(packageData.package[i].packageItem[pi_idx].guest);
                        totalSummary += summaryPrice;
                        
                    }
                    var serviceContent = '';
                    for (let m = 0; m < packageData.package[i].packageItem.length; m++) {

                        if(packageData.package[i].packageItem[m].package_date){
                            htmlPackage = `<tr><td style='padding:0px; border:none' colspan='2'><i class='fa fa-calendar'></i> : <span style='font-weight:bold'>${dateFormatSM(packageData.package[i].packageItem[m].package_date)}</span></td></tr>`;
                            htmlPackage += `<tr style='background:#FFF44F'><td colspan='2' style='padding:0px 5px'><b>${packageData.package[i].packageName}</b></td></tr>`
                            htmlPackage += `<tr><td style='padding:0px 5px; border:none'>Guest </td><td style='padding:0px 5px; border:none; text-align:right'> x ${packageData.package[i].packageItem[m].guest}</td></tr>`
                        }
                        
                        var htmlService = ``
                        let pck = packageData.package[i].packageItem[m];
                        packDateList.push(pck.package_date);
                        if(pck.service){
                            for(var k = 0; k < pck.service.length; k++){
                                if(pck.service[k].qty > 0){
                                    serviceContent += `<tr style='font-size:0.8em'><td style='padding:0px; padding-left:5px; border:none'>+${pck.service[k].name}</td> <td style='padding:0px;padding-left:10px; border:none; '>x ${pck.service[k].qty}</td></tr>` 
                                    totalSummary += (parseFloat(pck.service[k].price) * parseFloat(pck.service[k].qty));
                                }
    
                            }
                        }
                        
                        htmlService += serviceContent
                        htmlPackageItem += htmlService
                        
                    }
    
                    //$(`#summaryTotal${packageData.package[i].id}`).text(totalSummary) 
                    totalPrice += totalSummary
                    htmlPackage += htmlPackageItem
                    // console.log("totalPrice2 package  +=",totalPrice);
                    
                }

                oneData.push(`<table  width='100%' style='font-size:0.9em'>${htmlPackage}</table>`)

            }else{
                oneData.push("<small><i>no package</i></small>")
            }
            
            oneData.push(`IDR ${formatRupiah(Math.round(totalPrice*1.1*100)/100 )}<br>
                <small style='font-size:0.7em'>(incl. fee : IDR ${formatRupiah(totalPrice * 0.2)})</small><br>
            `);
            // oneData.push(`-`);
            /* oneData.push(`Total : IDR ${formatRupiah(totalPrice)}<br>
                Diveinc fee : IDR ${formatRupiah(totalPrice * (general.resort_fee / 100))}<br>
                Your income : IDR ${formatRupiah(totalPrice - (totalPrice * (general.resort_fee / 100)))}
            `) */
            // oneData.push(`IDR ${totalPrice + (totalPrice / 10)}`)
            // oneData.push(`IDR ${totalPrice + (totalPrice / 10)}`)
            let namaStatus = [];
            
                namaStatus['c7999dce-19b7-4bfd-84cc-d2f0845a3d86'] = "created";
                namaStatus['d2f95bbe-159b-4447-9e07-33925e04c5e9'] = "scheduled";
                namaStatus['59cfbb65-efff-4d25-aae1-b439efa62188'] = "extra data";
                namaStatus['b648ff73-468f-45cb-bbbc-fd3659e4b8ac'] = "ordered";
                namaStatus['b648ff73-468f-45cb-babc-fd3459e4b8ac'] = "reserved";
                namaStatus['bbb8ff73-468f-45cb-babc-fd3444e4b8ac'] = "approved";
                namaStatus['bcc8ff73-468f-45cb-babc-fd34cce4b8ac'] = "rejected";
                namaStatus['bcc8ff37-468f-45cb-bccc-fd34cce4b8ac'] = "transfered";
                namaStatus['baa8ff37-468f-45cb-bccc-fd34aae4b8ac'] = "done";
                namaStatus['baa8ff37-468f-455b-b5c5-fc34aae4b8ac'] = "cancelled";
            
            let status_id = result.data.data[x].transaction_resort_status_id; 
            let button_list = '';
            if(status_id == "b648ff73-468f-45cb-bbbc-fd3659e4b8ac"){
                oneData.push("Ordered")
                button_list = `<div class="d-flex">
                    <button onClick="confirm('${result.data.data[x].id}')" class="btnConfirmBooking btn btn-sm btn-success flex-grow-1 mr-1"><i class="fas fa-check"></i></button>
                    <button onClick="decline('${result.data.data[x].id}')" class="btnDeclineBooking btn btn-sm btn-danger flex-grow-1"><i class="fas fa-times"></i></button>
                </div>`;
            }else if(status_id == "bbb8ff73-468f-45cb-babc-fd3444e4b8ac"){
                oneData.push("Approved")
            }else if(status_id == "bcc8ff73-468f-45cb-babc-fd34cce4b8ac"){
                oneData.push("Rejected")
            }else{
                oneData.push(namaStatus[status_id]);
            }
    
            /* oneData.push(`
                <div class="d-block mb-1">
                    <a onClick="getDetail('${result.data.data[x].id}')" class="btn btn-sm btn-outline-primary btn-block"><!--<i class="fas fa-eye mr-2"></i>-->Details</a>
                </div>${button_list}`) */

            oneData.push(`
                <div class="d-block mb-1">
                    <a onClick="loadTransactionDetailById('${result.data.data[x].id}')" class="btn btn-sm btn-outline-primary btn-block"><!--<i class="fas fa-eye mr-2"></i>-->Details</a>
                </div>${button_list}`)
                
            data.push(oneData)
        //}
    }
    var hardcode = {
        draw : result.data.dataTableInfo.draw,
        recordsTotal : result.data.dataTableInfo.recordsTotal,
        recordsFiltered : result.data.dataTableInfo.recordsFiltered,
        data : data
    }
    
    // res.status(result.status).send(result.data);
    res.status(result.status).send(hardcode);
})

// route.get('/datatable-divecenter', async(req,res) => {
//     var cookie = parseCookies(req)
//     var divecenter_id = req.query.id;
//     // console.log('dvc',divecenter_id);

//     let result = await axios.call(`v1/transaction-divecenter/datatable-vendor`, `GET`, null, cookie.accessToken, null, req._parsedUrl.query)

//     if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    
//     console.log(result.data.data);
//     var data = []
//     for(var x = 0; x < result.data.data.length; x++){
//         var oneData = []
//         // console.log('plcs',result.data.data[x]);
//         // console.log(result.data.data[x].divecenter_id +' == '+ divecenter_id);
//         if (result.data.data[x].divecenter_id == divecenter_id) {
//             oneData.push(`<p style="font-size:14px;">${result.data.data[x].transaction_code}</p>`)
//             var packageData = result.data.data[x].package_data
//             var totalPrice = 0;
//             if(packageData.package){
//                 var htmlPackage = ``
//                 for(var i = 0; i< packageData.package.length; i++){
//                     var htmlPackageItem = ``
//                     htmlPackage = `${packageData.package[i].packageName}</br>`
//                     var totalSummary = 0
//                     if (typeof packageData.package[i].packageItem !== 'undefined') {
                        
//                         for(var j = 0; j < packageData.package[i].packageItem.length; j++){
//                             htmlPackageItem = `&nbsp; Package Plan ${j+1}</br>`
//                             var htmlService = `&nbsp;&nbsp;&nbsp;&nbsp; Service : </br>`
//                             totalSummary += parseFloat(packageData.package[i].packageItem[j].guest) * parseFloat(packageData.package[i].packagePrice)
//                             // console.log('srvc',packageData.package[i].packageItem[j].service.length);
//                             if(typeof packageData.package[i].packageItem[j].service !== 'undefined'){
//                                 for(var k = 0; k < packageData.package[i].packageItem[j].service.length; k++){
//                                     if(packageData.package[i].packageItem[j].service[k].qty > 0){
//                                         htmlService += `&nbsp;&nbsp;&nbsp;&nbsp; -${packageData.package[i].packageItem[j].service[k].name} x${packageData.package[i].packageItem[j].service[k].qty}</br>` 
//                                         totalSummary += (parseFloat(packageData.package[i].packageItem[j].service[k].price) * parseFloat(packageData.package[i].packageItem[j].service[k].qty))
//                                     }else{
//                                         htmlService += `&nbsp;&nbsp;&nbsp;&nbsp; None<br/>`
//                                     }
//                                     htmlPackageItem += htmlService
//                                 }
//                             }
//                             htmlPackage += htmlPackageItem
//                         }
//                     }
//                     totalPrice += totalSummary
//                 }
    
//                 htmlTotal = htmlPackage
//                 oneData.push(`<p style="font-size:12px;">${htmlTotal}</p>`)
//                 oneData.push(`
//                     <h5>Package :</h5>
//                     <!-- p style="font-size:14px;">Date : ${packageData.package_date ? packageData.package_date : '-'}</p -->`
//                 )
                
//             }else{
//                 oneData.push("-")
//                 oneData.push("-")
//             }

            
//             oneData.push(`total : IDR ${formatRupiah(totalPrice)}<br>
//                 diveinc fee : IDR ${formatRupiah(totalPrice * 0.2)}<br>
//                 your income : IDR ${formatRupiah(totalPrice - (totalPrice * 0.2))}
//             `)
//             // oneData.push(`IDR ${totalPrice + (totalPrice / 10)}`)
//             // oneData.push(`IDR ${totalPrice + (totalPrice / 10)}`)
//             /*
//                 c7999dce-19b7-4bfd-84cc-d2f0845a3d86 - created
//                 d2f95bbe-159b-4447-9e07-33925e04c5e9 - scheduled
//                 59cfbb65-efff-4d25-aae1-b439efa62188 - extra data
//                 b648ff73-468f-45cb-bbbc-fd3659e4b8ac - guest data
//                 b648ff73-468f-45cb-babc-fd3459e4b8ac - reserved
//                 bbb8ff73-468f-45cb-babc-fd3444e4b8ac - approved
//                 bcc8ff73-468f-45cb-babc-fd34cce4b8ac - rejected
//                 bcc8ff37-468f-45cb-bccc-fd34cce4b8ac - transfered
//                 baa8ff37-468f-45cb-bccc-fd34aae4b8ac - done
//                 baa8ff37-468f-455b-b5c5-fc34aae4b8ac - cancelled
//             */
//             let status_id = result.data.data[x].transaction_divecenter_status.id;
//             oneData.push(result.data.data[x].transaction_divecenter_status.description);
//             let button_list = '';
            
//             // oneData.push(result.data.data[x].transaction_divecenter_status.description)
//             if(status_id == "b648ff73-468f-45cb-bbbc-fd3659e4b8ac"){
//                 // let prnt = '';
//                 // oneData.push("Ordered")
//                 button_list = `<div class="d-flex">
//                     <button onClick="confirm('${result.data.data[x].id}')" class="btnConfirmBooking btn btn-sm btn-success flex-grow-1 mr-1"><i class="fas fa-check"></i></button>
//                     <button onClick="decline('${result.data.data[x].id}')" class="btnDeclineBooking btn btn-sm btn-danger flex-grow-1"><i class="fas fa-times"></i></button>
//                 </div>`;
//             }else if(status_id == "bbb8ff73-468f-45cb-babc-fd3444e4b8ac"){
//                 // oneData.push("Approved")
//             }else if(status_id == "bcc8ff73-468f-45cb-babc-fd34cce4b8ac"){
//                 // oneData.push("Rejected")
//             }
//             oneData.push(`
//             <div class="d-block mb-1">
//                 <a onClick="getDetail('${result.data.data[x].id}')" href="#" class="btn btn-sm btn-outline-primary btn-block"><i class="fas fa-eye mr-2"></i>Details</a>
//             </div>${button_list}`);
            
//             data.push(oneData);
            
//         }
//     }

//     var hardcode = {
//         draw : result.data.dataTableInfo.draw,
//         recordsTotal : result.data.dataTableInfo.recordsTotal,
//         recordsFiltered : result.data.dataTableInfo.recordsFiltered,
//         data : data
//     }
    
//     res.status(result.status).send(hardcode)
// })

route.get('/datatable-divecenter', async(req,res) => {
    var cookie = parseCookies(req)
    var divecenter_id = req.query.id;
    // console.log('dvc',divecenter_id);

    let result = await axios.call(`v1/transaction-divecenter/datatable-vendor`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)

    if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    
    var data = []
    let dataResult = result.data.data
    for(var x = 0; x < result.data.data.length; x++){
        var oneData = []
        // console.log('plcs',result.data.data[x]);
        // console.log(result.data.data[x].divecenter_id +' == '+ divecenter_id);
        if (result.data.data[x].divecenter_id == divecenter_id) {
            let created = dataResult[x].created_at.split('T');
            let tgl = created[0].split('-').reverse().join('-');
            let time = created[1].substr(0,8).split(':');
            oneData.push(`<p>${result.data.data[x].transaction_code}<br/>created : <br/>${tgl} ${(parseInt(time[0])+7)%24}:${time[1]}:${time[2]} WIB</p>`)
            
            var packageData = result.data.data[x].package_data
            var totalPrice = 0;
            var packDateList = [];
            if(packageData.package && typeof packageData.package !== 'undefined'){
                var htmlPackage = ``
                for(var i = 0; i< packageData.package.length; i++){
                    var htmlPackageItem = ``
                    var totalSummary = 0
                    if (typeof packageData.package[i].packageItem !== 'undefined') {
                        
                        for (let pi_idx = 0; pi_idx < packageData.package[i].packageItem.length; pi_idx++) {
                            var summaryPrice = parseFloat(packageData.package[i].packagePrice) * parseFloat(packageData.package[i].packageItem[pi_idx].guest);
                            totalSummary += summaryPrice;   
                        }
                        var serviceContent = '';
                        for (let m = 0; m < packageData.package[i].packageItem.length; m++) {
                            var dayCount = packageData.package[0].day

                            if(packageData.package[i].packageItem[m].package_date){
                                htmlPackage = `<tr><td style='padding:0px; border:none'>Date: </td><td style='padding:0px; border:none'><span style='font-weight:bold'>${dateFormatSM(packageData.package[i].packageItem[m].package_date)}</span></td></tr>`;
                                htmlPackage += `<tr style='background:#FFF44F'><td colspan='2' style='padding:0px 5px'><b>${packageData.package[i].packageName}</b></td></tr>`
                                htmlPackage += `<tr><td style='padding:0px 5px; border:none'>Guest </td><td style='padding:0px 5px; border:none; '> x ${packageData.package[i].packageItem[m].guest}</td></tr>`
                            }
                            
                            var htmlService = ``
                            let pck = packageData.package[i].packageItem[m];
                            packDateList.push(pck.package_date);
                            if (typeof pck.service !=='undefined') {
                                for(var k = 0; k < pck.service.length; k++){
                                    if(pck.service[k].qty > 0){
                                        serviceContent += `<tr style='font-size:0.8em'><td style='padding:0px; padding-left:5px; border:none'>+${pck.service[k].name}</td> <td style='padding:0px; border:none;'>x ${pck.service[k].qty}</td></tr>` 
                                        totalSummary += (parseFloat(pck.service[k].price) * parseFloat(pck.service[k].qty));
                                    }
        
                                }                            
                            }
                            htmlService += serviceContent
                            htmlPackageItem += htmlService
                            
                        }
                    }
    
                    //$(`#summaryTotal${packageData.package[i].id}`).text(totalSummary) 
                    totalPrice += totalSummary
                    htmlPackage += htmlPackageItem
                    // console.log("totalPrice2 package  +=",totalPrice);
                    
                }

                oneData.push(`<table  width='100%' style='font-size:0.9em'>${htmlPackage}</table>`)

            }else{
                oneData.push("-")
                // oneData.push("-")
            }

            
            // console.log("totalPrices",formatRupiah(Math.round(totalPrice*1.1*100)/100 ));
            oneData.push(`IDR ${formatRupiah(Math.round(totalPrice*1.1*100)/100)}<br>
                <small style='font-size:0.7em'>(incl. fee : IDR ${formatRupiah(totalPrice * 0.2)})</small><br>
            `)
            // oneData.push(`IDR ${totalPrice + (totalPrice / 10)}`)
            // oneData.push(`IDR ${totalPrice + (totalPrice / 10)}`)
            /*
                c7999dce-19b7-4bfd-84cc-d2f0845a3d86 - created
                d2f95bbe-159b-4447-9e07-33925e04c5e9 - scheduled
                59cfbb65-efff-4d25-aae1-b439efa62188 - extra data
                b648ff73-468f-45cb-bbbc-fd3659e4b8ac - guest data
                b648ff73-468f-45cb-babc-fd3459e4b8ac - reserved
                bbb8ff73-468f-45cb-babc-fd3444e4b8ac - approved
                bcc8ff73-468f-45cb-babc-fd34cce4b8ac - rejected
                bcc8ff37-468f-45cb-bccc-fd34cce4b8ac - transfered
                baa8ff37-468f-45cb-bccc-fd34aae4b8ac - done
                baa8ff37-468f-455b-b5c5-fc34aae4b8ac - cancelled
            */
            let status_id = result.data.data[x].transaction_divecenter_status.id;
            if (status_id == 'b648ff73-468f-45cb-bbbc-fd3659e4b8ac') {
                oneData.push('Ordered');
            }else{
                oneData.push(result.data.data[x].transaction_divecenter_status.description);
            }
            let button_list = '';
            
            // oneData.push(result.data.data[x].transaction_divecenter_status.description)
            if(status_id == "b648ff73-468f-45cb-bbbc-fd3659e4b8ac"){
                // let prnt = '';
                // oneData.push("Ordered")
                button_list = `<div class="d-flex">
                    <button onClick="confirm('${result.data.data[x].id}')" class="btnConfirmBooking btn btn-sm btn-success flex-grow-1 mr-1"><i class="fas fa-check"></i></button>
                    <button onClick="decline('${result.data.data[x].id}')" class="btnDeclineBooking btn btn-sm btn-danger flex-grow-1"><i class="fas fa-times"></i></button>
                </div>`;
            }else if(status_id == "bbb8ff73-468f-45cb-babc-fd3444e4b8ac"){
                // oneData.push("Approved")
            }else if(status_id == "bcc8ff73-468f-45cb-babc-fd34cce4b8ac"){
                // oneData.push("Rejected")
            }
            oneData.push(`
            <div class="d-block mb-1">
                <a onClick="loadTransactionDetailById('${result.data.data[x].id}')" class="btn btn-sm btn-outline-primary btn-block"><!--<i class="fas fa-eye mr-2"></i>-->Details</a>
            </div>${button_list}`);
            
            data.push(oneData);
            
        }
    }

    var hardcode = {
        draw : result.data.dataTableInfo.draw,
        recordsTotal : result.data.dataTableInfo.recordsTotal,
        recordsFiltered : result.data.dataTableInfo.recordsFiltered,
        data : data
    }
    
    res.status(result.status).send(hardcode)
})

route.get('/datatable-liveaboard', async(req,res) => {
    var cookie = parseCookies(req)

    var liveaboard_id = req.query.id;
    // console.log(req);
    let status_id = '';

    let result = await axios.call(`v1/transaction-liveaboard/datatable-vendor`, `GET`, null, cookie.accessTokenDiveincWebsite, null, req._parsedUrl.query)
    
    let packageList = [];

    // console.log(req._parsedUrl.query);
    // console.log(result.data.data.length)
    // console.log(result.data)
    if(!result.data.message) return res.status(500).send({success : false, message : `Internal server error`})
    
    var data = []
    var dataResult = result.data.data;
    
    for(var x = 0; x < result.data.data.length; x++){
        var oneData = []
        //0
        
        let created = dataResult[x].created_at.split('T');
        let tgl = created[0].split('-').reverse().join('-');
        let time = created[1].substr(0,8).split(':');
        oneData.push(`<p>${result.data.data[x].transaction_code}<br/>created : <br/>${tgl} ${(parseInt(time[0])+7)%24}:${time[1]}:${time[2]} WIB</p>`)
        
        var packageData = dataResult[x].package_data
        // if(result.data.data[x].liveaboard_id == liveaboard_id){
            
            let srvcList = [];
            let tglShow = '-';
            if (packageData.package) {
                let tgl_start = packageData.package[0].package_date;
                let tgl_start_add = new Date(tgl_start);
                let dS = new Date(tgl_start);
                let dayCount = 1;
                if (typeof packageData.package[0].day !== 'undefined') {
                    dayCount = packageData.package[0].day
                }
                let tgl_end = new Date(dS.setDate(tgl_start_add.getDate() + parseInt(dayCount) - 1));
                let tgl_end_show =(tgl_end.getFullYear()+'-'+(tgl_end.getMonth()+1).toString().padStart(2,'0')+'-'+tgl_end.getDate().toString().padStart(2,'0'));
                tglShow = dateFormatSM(tgl_start) + '-' + dateFormatSM(tgl_end_show);
                srvcList = packageData.package[0].service;
                
                
            }
    
            var totalPrice = 0;
            if(packageData.room){
                
                //var night = (new Date(packageData.room_date.to) - new Date(packageData.room_date.from)) / (1000 * 3600 * 24)
                var htmlRoom = ``
                for(var i = 0; i < packageData.room.length; i++){
                    
                    htmlRoom += `<tr style='background:#9dccf5'><td colspan='2' style='padding:0px 5px;'><b>${packageData.room[i].roomName.toUpperCase()}</b></td></tr>`
                    var htmlRoomItem = ``
                    var totalSummary = 0
                    
                    htmlRoomItem += `<tr>
                        <td style='padding:0px 5px; border:none'>Guest </td>
                        <td style='padding:0px 5px; border:none; text-align:right'> x ${packageData.room[i].roomItem[0].guest}</td>
                        </tr>`
                    
                    //var summaryPrice = parseFloat(night) * parseFloat(packageData.room[i].roomPrice)
                    var summaryPrice = packageData.room[i].roomItem[0].guest * packageData.room[i].roomPrice
                    totalSummary += summaryPrice
                    htmlRoom += htmlRoomItem
                    totalPrice += totalSummary;
                }

                totalSummary = 0;
                var htmlService = '';
                var htmlTotal = htmlRoom;
                if (srvcList.length > 0) {
                    htmlService = `<tr>
                    <td style='padding:0px 5px; border:none; background:#FFF44F' colspan='2'>Additional </td>
                    </tr>`;
                    var htmlServiceItem = '';
                    for(var i = 0; i < srvcList.length; i++){
                        if (parseFloat(srvcList[i].qty) > 0) {
                            htmlServiceItem += `<tr><td style='padding:0px 10px; border:none'><small>+ ${srvcList[i].name}</small></td>
                            <td style='padding:0px 10px; border:none; text-align:right'><small>x ${srvcList[i].qty}</small></td></tr>` 
                            totalSummary += (parseFloat(srvcList[i].qty) * parseFloat(srvcList[i].price))
                        }
                    }

                    if (htmlServiceItem != '') {
                        htmlService += htmlServiceItem
                    }else{
                        htmlService = '';
                    }
                    
                }
                htmlRoom += htmlService
                htmlTotal = htmlRoom
                totalPrice += totalSummary;
                //1
                oneData.push(`<table width='100%' style='font-size:0.9em'><tr><td style='padding:0px; border:none'>Date: </td><td style='padding:0px; border:none'><span style='font-weight:bold'>${tglShow}</span></td></tr>${htmlTotal}</table>`)
                
            }else{
                //1
                // oneData.push("-")
                //2
                oneData.push("-")
            }

            
            
            //3
            oneData.push(`IDR ${formatRupiah(Math.round(totalPrice*1.1*100)/100)}<br>
                <small style='font-size:0.7em'>Incl. fee : IDR ${formatRupiah(totalPrice * 0.2)}</small>
            `)
            // oneData.push(`IDR ${totalPrice + (totalPrice / 10)}`)
            // oneData.push(`IDR ${totalPrice + (totalPrice / 10)}`)
            status_id = result.data.data[x].transaction_liveaboard_status_id;
            if(status_id == "b648ff73-468f-45cb-bbbc-fd3659e4b8ac"){
                //4
                oneData.push("Ordered")
                //5
                oneData.push(`
                <div class="d-block mb-1">
                    <a onClick="loadTransactionDetailById('${result.data.data[x].id}')" href="#" class="btn btn-sm btn-outline-primary btn-block"><i class="fas fa-eye mr-2"></i>Details</a>
                </div>
                <div class="d-flex">
                    <button onClick="confirm('${result.data.data[x].id}')" class="btnConfirmBooking btn btn-sm btn-success flex-grow-1 mr-1"><i class="fas fa-check"></i></button>
                    <button onClick="decline('${result.data.data[x].id}')" class="btnDeclineBooking btn btn-sm btn-danger flex-grow-1"><i class="fas fa-times"></i></button>
                </div>
                `)
            }else{
                //4
                oneData.push(`${result.data.data[x].transaction_liveaboard_status.name}`)
                //5
                oneData.push(`
                <div class="d-block mb-1">
                    <a onClick="loadTransactionDetailById('${result.data.data[x].id}')" href="#" class="btn btn-sm btn-outline-primary btn-block"><i class="fas fa-eye mr-2"></i>Details</a>
                </div>
                `)
            }
            
            
            data.push(oneData)
        // }

    }
    var hardcode = {
        draw : result.data.dataTableInfo.draw,
        recordsTotal : result.data.dataTableInfo.recordsTotal,
        recordsFiltered : result.data.dataTableInfo.recordsFiltered,
        data : data
    }
    
    // res.status(result.status).send(result.data)
    res.status(result.status).send(hardcode)
})

module.exports = route