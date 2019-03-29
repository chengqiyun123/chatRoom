/*
 * @Author: chengqiyun 
 * @Date: 2019-03-29 19:14:21 
 * @Last Modified by: chengqiyun
 * @Last Modified time: 2019-03-29 19:26:58
 */
const Koa = require('koa');
const app = new Koa();
const fs = require('mz/fs');
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

let users = [];
let sendval = []

app.use(async (ctx,next) => {
    ctx.response.type = 'text.html';
    let isHas = await fs.exists('./view/index.html');
    if(isHas){
        let html = await fs.readFileSync('./view/index.html');
        ctx.response.body = html;
    }else{
        ctx.response.body = {
            code: 0,
            msg: 'error'
        }
    }
})

io.on('connection',(socket) => {
    socket.on('login',(data) => {
        users.push(data);
        //除了自己别人都能看见
        // socket.broadcast.emit(`income ${data} has joined room`);
        //全量广播
        io.emit('user-login',{
            user: data,
            lists: users
        });
    })
    socket.on('loginout',(user) => {
        users = users.filter(item=>item!==user);
        io.emit('user-loginout',{
            user: user,
            lists: users
        });
    })
    socket.on('sendval',data=>{
        io.emit('sendvals',data)
    })
})

server.listen(8000,()=>{
    console.log('server start port 8000');
})