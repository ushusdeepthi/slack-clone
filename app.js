const express=require('express');
const app=express()
const socket=require('socket.io')
const path=require('path')
const server=app.listen(3000)
const io=socket(server)

app.use(express.static('public'));

app.get('/',(req,resp)=>{
    resp.sendFile(__dirname+'/html/index.html')
})
io.on('connection', socket=>{
socket.on('chat',data=>{
    console.log(data)  
    io.emit('chat',data)
})
})