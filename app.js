const express = require('express')
const router = require('./router')
const path = require('path')

const app = express()
const port = 3000

app.engine('html', require('express-art-template'))
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
});

app.use(router)

app.listen(port, ()=>{
  console.log(`server is running on http://127.0.0.1:${port}...`)
})
 