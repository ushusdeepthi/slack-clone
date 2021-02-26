// --------------------------
//      DEPENDENCIES
//-----------------------
const express=require('express');
const socket=require('socket.io')
const path=require('path')

//---------Express config-----------
const app=express()
const server=app.listen(3000)
const io=socket(server) // opening socket connection
app.use(express.static('public'));

// Routes
app.get('/',(req,resp)=>{
    resp.render('index.ejs')
})
//log when the user connects and disconnects
io.on('connection', socket=>{
socket.on('chat',data=>{
    console.log(data)  
    io.emit('chat',data)
})
})