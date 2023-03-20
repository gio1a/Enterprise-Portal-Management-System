const Router = require('koa-router')
const article = require('../../controllers/admin/articleController')

const router = new Router()

const routers = router
  .get('/article_category',article.getCategory)
  .post('/article', article.createNews)
  .put('/article/:path', article.updateArticle)
  .delete('/article/:path', article.deleteArticle)
  .get('/article',article.getArticleList)
  .get('/article/:path',article.getArticleDetail)

  
module.exports = routers
