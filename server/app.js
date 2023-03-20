// 业务

const Koa = require('koa')
const path = require('path')
const KoaStatic = require('koa-static') // 静态资源中间件
const Logger = require('koa-logger') // 日志中间件
const dayjs = require('dayjs')
const cors = require('koa2-cors')
const koa_jwt = require('koa-jwt')
const koaBody = require('koa-body')

const authorization = require('./middleware/authorization')
const getUploadFileExt = require('./utils/getUploadFileExt')
const getUploadFileName = require('./utils/getUploadFileName')
const checkDirExist = require('./utils/checkDirExist')
const getUploadDirName = require('./utils/getUploadDirName')

// 路由
const routers = require('./routers/index')

// 常量
const Port = process.env.PORT || 3000
const staticPath = './static'

const app = new Koa()

const logger = new Logger(str => {
  console.log(dayjs().format('YYYY-MM-DD HH:MM:SS') + str)
})
app.use(cors())
// cors({
//   origin: function (ctx) { //设置允许来自指定域名请求
//     if (ctx.url === '/test') {
//       return '*' // 允许来自所有域名请求
//     }
//     return 'http://localhost:9528' //只允许http://localhost:8080这个域名的请求
//   },
//   maxAge: 5, //指定本次预检请求的有效期，单位为秒。
//   credentials: true, //是否允许发送Cookie
//   allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
//   allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
//   exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
// })

// 中间件挂载
app.use(logger)
// 设置静态文件夹
app.use(KoaStatic(path.join(__dirname, staticPath)))

// 文件上传
app.use(koaBody({
  multipart: true, // 支持文件上传
  formidable: {
    // 在配置选项中不推荐使用相对路径,option里的相对路径不是相对的当前文件，而是相对process.cwd()
    // process.cwd() 是当前Node.js进程执行时的文件夹地址——工作目录，保证了文件在不同的目录下执行时，路径始终不变
    uploadDir: path.join(__dirname, 'static/upload/'), // 设置文件上传目录
    keepExtensions: true,    // 保持文件的后缀
    maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
    onFileBegin: (name, file) => { // 文件上传前的设置
      // console.log(`name: ${name}`);
      // console.log(file);
      // 获取文件后缀
      const ext = getUploadFileExt(file.name)
      // console.log(file)
      // 最终要保存到的文件夹目录
      const dirName = getUploadDirName()
      const dir = path.join(__dirname, `static/upload/${dirName}`)
      // console.log(dir)
      // 检查文件夹是否存在如果不存在则新建文件夹
      checkDirExist(dir)
      // 获取文件名称
      const fileName = getUploadFileName(ext)
      // 重新覆盖 file.path 属性
      file.path = `${dir}/${fileName}`
      app.context.uploadpath = app.context.uploadpath ? app.context.uploadpath : {}
      app.context.uploadpath[name] = `${dirName}/${fileName}`
      // console.log(dirName)
    },
    onError: (err) => {
      console.log(err)
    }
  }
}))

app.use(koa_jwt({
  secret: 'Aerowang'
}).unless({
  path: [
    /^\/api\/v1\/web/,
    /^\/api\/v1\/admin\/login/,
    /^\/api\/v1\/admin\/register/,
    /^\/static\/upload/
  ] //除了这个地址，其他的URL都需要验证
}))
// 验证
app.use(authorization())
// 路由加载
app.use(routers.routes()).use(routers.allowedMethods())
app.on('error', err => {
//   app.on("error", errHandler); // 进行统一的错误处理
  console.log(err)
})

app.listen(Port, () => {
  console.log(`Server running at Port:${Port}`)
})
