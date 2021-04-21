const next = require('next')
const http = require('http')
const url = require('url')
const path = require('path')

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// app.prepare().then(() => {
//   http.createrServer((req, res) => {
//     const parseUrl = url.parse(req.url, true)
//     const { pathname } = parseUrl

//     if (pathname === '/service-worker.js') {
//       const filePath = path.join(__dirname, '.next', pathname)
//       app.serverStatic(req, res, filePath)
//     } else {
//       handle(req, res, parseUrl)
//     }
//   }).listen(port, () => {
//     console.log(`Listing on PORT ${port}`)
//   })
// })