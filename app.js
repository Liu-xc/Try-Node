const express = require('express')
const router = require('./router')
const path = require('path')
const bodyParser = require('body-parser')

// 使用express
const app = express()
const port = 3000

// 使用bodyParser来解析请求的参数
app.use(bodyParser.json())
// 重要！
app.use(bodyParser.urlencoded({ extended: true }))

// 开放文件
app.use('/public',express.static(path.join(__dirname, 'public')))

// 指定渲染模板为html文件
app.engine('html', require('express-art-template'))
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
});

// 注册路由，一定要放在所有中间件的最后
app.use(router)

// 监听端口
app.listen(port, ()=>{
  console.log(`server is running on http://127.0.0.1:${port}...`)
})
 