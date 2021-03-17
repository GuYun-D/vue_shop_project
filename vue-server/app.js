const express = require("express")
// 使用gzip压缩
const compression = require('compression')
// 配置http，将公钥与私钥放在根目录下
// const https = require('https')
// const fs = require('fs')

const app = express()

// const options = {
//     cert: fs.readFileSync('./full_chain.pem'),
//     key: fs.readFileSync('./private.key')
// }

// 一定要写在静态资源上面
app.use(compression())

app.use(express.static('../dist'))

app.listen(8000, () => {
    console.log("服务器启动成功");
})

// https.createServer(options, app).listen(443)