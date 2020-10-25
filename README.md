# Try-Node
Try to make a  CRUD web app during learning Node.js

**used**:

- Node.js
- Express
- MongoDB
- Art-template
- Bootstrap
- Express-session
- (mongoose, nodemon, bodyParser, connect-mongo)

**路由设计**

| 路由      | 请求方式 | 参数               | 操作                                                         |
| --------- | -------- | ------------------ | ------------------------------------------------------------ |
| /         | GET      |                    | 访问首页                                                     |
| /register | GET      |                    | 访问注册页面                                                 |
| /register | POST     | username、password | 检查数据库是否存在相同数据，如果不存在就添加新用户，如果存在就提示已占用 |
| /login    | GET      |                    |                                                              |
| /login    | POST     | username、password | 检查数据库验证正确性，如果不正确提示错误，如果正确，记录用户数据并跳转到首页 |
| /comment  | GET      |                    |                                                              |
| /comment  | POST     | username、comment  | 将数据添加到数据库                                           |
| /edit     | GET      |                    |                                                              |
| /edit     | POST     | commentID、comment | 使用ID查询并更新                                             |
| /delete   | GET      | commentID          | 使用ID删除项                                                 |

**使用方式**
`npm i`
`mongod --dbpath PATH(d:/software/mongodb)`
`nodemon app.js`
模拟用户
`uname: hello  pass: 123456`