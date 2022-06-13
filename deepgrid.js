const fs = require('fs');
const path = require('path');
// const express = require('express');

//引入express

const express = require('express');

//引入中间件，解决history模式

// const history = require('connect-history-api-fallback');

//监听的端口

const port = 19997;

const app = express();

//使用中间件

// app.use(history());

//设置静态文件路径

//app.use(express.static('./static'));
// app.use('/api', apiRoutes);
app.use(express.static(path.resolve(__dirname, './static')))


app.get('*', function (req, res) {
    const html = fs.readFileSync(path.resolve(__dirname, './static/index.html'), 'utf-8')
    res.send(html)
})

//监听端口
//
// module.exports = app.listen(port, function (err) {

//     if (err) {

//         console.log(err)

//         return

//     } else {

//         console.log('Listening at http://localhost:' + port + '\n')

//     }

// })
app.listen(port);