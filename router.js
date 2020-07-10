const express = require('express')
const fs = require('fs')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/myapp');
const Schema = mongoose.Schema
const blogSchema = new Schema({
  name: String,
  age: Number
})
const Blog = mongoose.model('Blog', blogSchema)

const router = express.Router()

router.get('/', (req, res)=>{
  res.render('hello.html', {})
  let blog = new Blog({name: 'hello', age: 18})
  Blog.find({name: 'hello', age: 18}, (err, data)=>{
    if (data) {
      console.log(data)
      console.log('数据已存在')
      return res.end()
    }
    blog.save((err, data)=>{
      if(err){
        return res.status(500).end('ERROR')
      } else {
        console.log('保存数据' + data)
      }
    })
  })
  res.end()
})

router.get('/a', (req, res)=>{
  Blog.find((err, data)=>{
    if(err){
      return res.status(500).send('ERROR')
    } else {
      console.log(`data: ${data}`)
    }
  })
  res.end()
})

module.exports = router