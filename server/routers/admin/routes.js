const Router = require('koa-router')
const routes = require('../../controllers/admin/role/routesController')

const router = new Router()

const routers = router
  .get('/routes',routes.routes)


module.exports = routers
