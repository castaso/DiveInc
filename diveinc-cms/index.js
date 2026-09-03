`use strict`

require(`dotenv`).config()
require(`module-alias/register`)

const express = require(`express`)
const bodyParser = require(`body-parser`)
const morgan = require(`morgan`)
const helmet = require(`helmet`)
const path = require(`path`)

const port = process.env.PORT || 4444
const host = process.env.HOST || `localhost`

const routePage = require(`@route/page`)
const routeApi= require(`@route/api`)

const app = express()

app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use(helmet())
app.use(morgan(`dev`))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cookie");
  res.header("Access-Control-Allow-Credentials", true);
  next()
})

app.use(`/api`, routeApi)
app.use(`/`, routePage)

const server = app.listen(port, host, () => {
  console.log(`API start on host : ${host} and port : ${port}`)
})
