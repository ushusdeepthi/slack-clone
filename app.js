// --------------------------
//      DEPENDENCIES
//-----------------------
const express=require('express');
const socket=require('socket.io')
const path=require('path')
const monk=require('monk')
const bodyParser = require('body-parser')

const app=express()
const server=app.listen(3000)
const io=socket(server) // opening socket connection
const db=monk('localhost:27017/slack-clone')


app.use((req, res, next) => {
    req.db = db
    next()
})
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set('views', (__dirname, './views'));


// Routes
app.get('/login',(req,resp)=>{
    resp.render('login')
})
app.get('/',async(req,resp)=>{
    //get channelList from database 
//just for test
    let channel=   db.get('channels')
    let data=await channel.find({})
    console.log(data);
    resp.render('index',{channels:data})
    
})
//for individual channels  
app.get('/:id',async(req,resp)=>{
    let channels=   db.get('channels')
    let channels_data=await channels.find({})
    let channel_data=await channels.find({_id:req.params.id})
    // console.log(channel_data);
    resp.render('channelDetails', {channel:channel_data[0],channels:channels_data})

})
// post a new channel
app.get('/new/channel',(req,resp)=>{

})
//post a new message
app.post('new/message',(req,resp)=>{

})
//log when the user connects and disconnects
io.on('connection', socket=>{
    // socket.on('joinChannel',()=>{
        
        
        socket.emit('message','Welcome to Slack'); //emits only to the person connected 
        socket.broadcast.emit('message','A user has connected')//to all otherusers than the one connected
    // })
 
//  console.log(socket.request)
    
socket.on('chat',(data)=>{

    let channels=   db.get('channels');
    channels.find({})
    .then(data=>{console.log(data)})
    channels.update({_id:data.id},{$push:{"conversation":{message:data.message, user:data.user,timeStamp:new Date()}}})
    console.log(data)  
    io.emit('chat',data)
})
//runs when a user disconnects
  socket.on('disconnect',()=>{
    io.emit('message','A user has disconnected')
  })


})