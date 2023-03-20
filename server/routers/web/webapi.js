const Router = require('koa-router')
const router = new Router()

const news = require('../../controllers/articleController')
const product = require('../../controllers/productController')
const job = require('../../controllers/jobController')

const routers = router
  .get('/newslist', news.newsList)
  .get('/recomNews', news.recommendNews)
  .get('/hotnews', news.hotNews)
  .get('/searchnews/:keyword', news.searchNews)
  .get('/article/:path', news.newsDetail)

  .get('/products', product.productList)
  
  .get('/job-filters', job.jobFilter)
  .post('/job', job.jobList)
  .get('/job/:id', job.getJobDetail)
module.exports = routers
