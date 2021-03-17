# 上线

**开启gzip压缩** 
- 使用 gzip 可以减小文件体积，使传输速度更快。
可以通过服务器端使用 Express 做 gzip 压缩。其配置如下：

```js
 // 安装相应包
 npm install compression -S
 // 导入包
 const compression = require('compression');
 // 启用中间件
app.use(compression());
 ```

**配置 HTTPS 服务**
-  传统的 HTTP 协议传输的数据都是明文，不安全
采用 HTTPS 协议对传输的数据进行了加密处理，可以防止数据被中间人窃取，使用更安全

- 配置 HTTPS 服务
    - 进入 https://freessl.cn/ 官网，输入要申请的域名并选择品牌。
    - 输入自己的邮箱并选择相关选项。
    - 验证 DNS（在域名管理后台添加 TXT 记录）。
    - 验证通过之后，下载 SSL 证书（ full_chain.pem 公钥；private.key 私钥）。
-  配置 HTTPS 服务

```js
const https = require('https');
 const fs = require('fs');
 const options = {
 cert: fs.readFileSync('./full_chain.pem'),
 key: fs.readFileSync('./private.key')
 }
 https.createServer(options, app).listen(443)
```

**使用 pm2 管理应用**
- 在服务器中安装 pm2：npm i pm2 -g
- 启动项目：pm2 start 脚本 --name 自定义名称
- 查看运行项目：pm2 ls
- 重启项目：pm2 restart 自定义名称
- 停止项目：pm2 stop 自定义名称
- 删除项目：pm2 delete 自定义名- 