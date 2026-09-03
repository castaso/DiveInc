`use strict`

require(`dotenv`).config()
require(`module-alias/register`)

const express = require(`express`)
const bodyParser = require(`body-parser`)
const morgan = require(`morgan`)
const helmet = require(`helmet`)
const path = require(`path`)

const port = process.env.PORT || 5556
const host = process.env.HOST || `localhost`
const maintenance = process.env.MAINTENANCE || `no`

const controller = require(`@controller`)

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use(helmet())
app.use(morgan(`dev`))

if(maintenance == 'yes'){
  // app.get(`*`, (req,res) => {
  //   res.render(`page/example.ejs`)
  // })
}else{
  app.use(`/`, controller)
  // app.get(`*`, (req,res) => {
  //   res.render(`page/example.ejs`)
  // })
}

// Coba melakukan perubahan
const server = app.listen(port, host, () => {
  console.log(`API start on host : ${host} and port : ${port}`)
})
