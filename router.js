const express = require('express')
const mongoose = require('mongoose');
const md5 = require('md5')

mongoose.connect('mongodb://localhost/myapp', {useNewUrlParser: true, useUnifiedTopology: true});
const Schema = mongoose.Schema
const userSchema = new Schema({
  username: String,
  password: String
})
const commentSchema = new Schema({
  username: String,
  comment: String,
  time: Number
})
const User = mongoose.model('User', userSchema)
const Comment = mongoose.model('Comment', commentSchema)
const Session = mongoose.model('Session', Schema(), 'sessions')

const router = express.Router()

router.get('/', (req, res)=>{
  // 从数据库获取评论
  const commentArr = []
  const sessionID = `"${req.sessionID}"`
  const query = Session.where({'session.sessionID': sessionID})
  let userData = {}
  let failMSg = ''
  // Session.find((err, data)=>{
  //   if(!err){
  //     console.log(data)
  //     for(let v of data) {
  //       console.log(typeof v)
  //       if(JSON.parse(v.session).sessionID === sessionID) {
  //         userData = v.session.userData
  //         break
  //       }
  //     }
  //   }
  // })
  // Session.findOne(query, (err, data)=>{
  //   if(err){
  //     failMsg = '获取数据失败'
  //   } else if (data) {
  //     console.log(data)
  //   }
  // })
  userData = req.session.userData
  Comment.find((err, data)=>{
    if(err){
      failMsg = '获取数据失败'
    } else if (data) {
      data.forEach(v=>commentArr.unshift(v))
      res.render('index.html', {'username': userData ? userData.username : '', 'failMSg': failMSg, 'commentArr': commentArr})
    }
  })
})


router.get('/login', (req, res)=>{
  res.render('login.html', {
    username: 'hello',
    password: 'world'
  })
})

router.get('/register', (req, res)=>{
  res.render('register.html', {
    username: 'hello',
    password: 'world'
  })
})

router.get('/comment', (req, res)=>{
  res.render('comment.html', {'title': 'comment'})
  res.end()
})

router.get('/delete', (req, res)=>{
  // 获取id，从参数中获取的id=“xxxxx”，需要消去两边的引号才能查询
  const id = req.query.id.slice(1, -1)
  Comment.findByIdAndRemove(id, (err)=>{
    if(err){
      console.log(err)
      res.render('index.html', {'failMSg': '删除失败'})
    } else {
      res.redirect('/')
    }
  })
})

// edit和comment使用同一个模板，通过传入的参数不同来控制页面的表现
router.get('/edit', (req, res)=>{
  const id = req.query.id.slice(1, -1)
  Comment.findById(id, (err, data)=>{
    if(err){
      console.log(err)
      res.render('comment.html', {'title': 'edit', 'failMsg': '获取数据失败', id})
    } else if (data) {
      res.render('comment.html', {'title': 'edit', 'comment': data.comment, id})
    } else {
      res.render('comment.html', {'title': 'edit', id})
    }
  })
})

router.post('/login', (req, res)=>{
  // 获取数据，取得的数据的类型为object
  const userData = req.body
  userData.password = md5(userData.password)
  
  const promise = new Promise((resolve, reject)=>{
    // 查询数据库，如果不存在数据就返回登录界面
    // 如果存在数据就保留数据并进入登录状态的首页
    User.findOne(userData, (err, data)=>{
      if(err){
        reject(err)
      }
      resolve(data)
    })
  }).then(
    resolve=>{
      // 进入登录状态的首页
      // curUsername = userData.username
      req.session.userData = Object.assign(userData, resolve)
      req.session.sessionID = req.sessionID
      res.redirect('/')
    },
    reject=>{
      // 打印错误信息并返回登录页面
      console.log(reject.message)
      res.render('login.html', {'failMsg': '信息错误'})
    }
  )
})

router.post('/register', (req, res)=>{
  const userData = req.body
  userData.password = md5(userData.password)

  const promise = new Promise((resolve, reject)=>{
    // 查询数据库
    User.findOne({username: userData.username}, (err, data)=>{
      if (err) {
        reject(err)
      } else if (data) {
        // 如果有数据就返回注册页面提示用户已存在
        res.render('register.html', {'failMsg': '用户名已存在'})
      } else {
        // 没有数据就将数据存入数据库并且保留以及跳转到登录状态的首页
        const user = new User(userData)
        user.save((err)=>{
          if(err){
            reject(err)
          }
          // curUsername = userData.username
          req.session.userData = userData
          res.redirect('/')
        })
      }
    })
  }).catch(err=>{
    console.log(err.message)
    res.render('register.html', {'failMsg': '登录失败'})
  })
})

router.post('/comment', (req, res)=>{
  const userData = req.session.userData
  // 首先要判断当前是否已经登录了
  if(!userData.username){
    return res.render('comment.html', {'failMsg': '请登录'})
  }
  // 获取数据
  const commentData = req.body
  commentData.username = userData.username
  commentData.time = Date.now()

  const comment = new Comment(commentData)

  // 存入数据库
  comment.save((err)=>{
    if(err) {
      console.log(err)
      return res.render('comment.html', {'failMsg': '发表失败'})
    }
    res.redirect('/')
  })
})

router.post('/edit', (req, res)=>{
  // 获取数据
  const comment = req.body.comment
  const id = req.body.id
  
  // 查询并修改
  Comment.findByIdAndUpdate(id, {comment}, (err)=>{
    if(err){
      console.log(err)
      res.render('comment.html', {'title': 'edit', 'failMsg': '更新失败', id})
    }
    res.redirect('/')
  })
})

module.exports = router