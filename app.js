/* eslint-disable */
const Koa = require('koa')
const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')
const axios = require('axios')
const qs = require('querystring')
const cors = require('koa2-cors')
const views = require('koa-views')
const koaStatic = require('koa-static')
const path = require('path')
const app = new Koa()

// const url = "http://mhbl.jssmla.cn";

const service = axios.create({
  baseURL: 'http://mhbl.jssmla.cn', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 100000 // request timeout
})

// 下面是两个路由，分别对应用户名或密码错误时候的失败的页面
// 和登陆成功的list页面
router.post('/login', async (ctx, next) => {
  const path = '/app/index.php?i=5&c=entry&m=ewei_shopv2&do=mobile&r=account.login'
  console.log('body', ctx.request.body)
  const { pwd, mobile } = ctx.request.body
  const data = {
    pwd,
    mobile
  }

  const res = await service({
    url: path,
    method: 'POST',
    data: qs.stringify(data)
  })

  if (res.data && res.data.status === 1) {
    const cookieArray = res.headers['set-cookie']
    cookieArray.forEach((item) => {
      const cookieItem = item.split('=')
      ctx.cookies.set(cookieItem[0], cookieItem[1], {
        maxAge: 60 * 1000 * 60 * 24 * 30
      })
    })
    ctx.body = res.data
  } else {
    ctx.body = { status: 2, result: '登陆失败' }
  }
})

router.get('/list', async (ctx, next) => {
  const query = ctx.query
  const { type, status, page } = query
  const header = ctx.request.header

  const path = `/app/index.php?i=5&c=entry&m=ewei_shopv2&do=mobile&r=auction.${type}&page=${page}&status=${status}`
  const list = await service({
    url: path,
    method: 'GET',
    headers: {
      Cookie: header.cookie
    },
    withCredentials: true
  })
  // ctx.status = 200;
  ctx.body = list.data
  ctx.status = 200
})

router.get('/detail', async (ctx, next) => {
  const query = ctx.query
  const { type, id } = query

  const path = `app/index.php?i=5&c=entry&m=ewei_shopv2&do=mobile&r=auction.orderd&type=${type}&id=${id}`
  const detail = await service({
    url: path,
    method: 'get'
  })
  ctx.body = detail.data
})

router.get('/saleDetail', async (ctx, next) => {
  const query = ctx.query
  const { id } = query

  const path = `/app/index.php?i=5&c=entry&m=ewei_shopv2&do=mobile&r=auction.fee&orderid=${id}`
  const detail = await service({
    url: path,
    method: 'get'
  })
  ctx.body = detail.data
})

app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url} `)
  await next()
})

// app.use(async (ctx, next) => {
//   ctx.set("Access-Control-Allow-Origin", "*");
//   ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
//   await next();
// });
app.use(
  cors({
    origin: '*',
    maxAge: 2592000,
    credentials: true
  })
)

app.use(
  koaStatic(
    path.join(__dirname + '/dist'), // 开放的文件夹 __dirname为当前运行文件的目录  目前看来 只能开放文件夹 无法开放单独一个文件
    {
      index: false, // 默认为true  访问的文件为index.html  可以修改为别的文件名或者false
      hidden: false, // 是否同意传输隐藏文件
      defer: true // 如果为true，则在返回next()之后进行服务，从而允许后续中间件先进行响应
    }
  )
)
app.use(bodyParser())
app.use(router.routes())

app.listen(8989, () => {
  console.log('监听成功' + new Date())
})
