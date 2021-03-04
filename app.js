// --------------------------
//      DEPENDENCIES
//-----------------------
const express=require('express');
const socket=require('socket.io')
const path=require('path')
const mongoose=require('mongoose')

const bodyParser = require('body-parser')

const app=express()
const server=app.listen(3000)
const io=socket(server) // opening socket connection


//set up default mongoose connection
mongoose.connect('mongodb://localhost:27017/slack-clone', {
 useNewUrlParser: true,
 useUnifiedTopology: true
});
// Get the default connection
const db=mongoose.connection;
//Bind connection to error event (to get notification of connection errors) 
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set('views', (__dirname, './views'));

const ChannelModel=require('./models/channels')
// Routes
app.get('/login',(req,resp)=>{
    resp.render('login')
})
app.get('/',(req,resp)=>{
    //get channelList from database 
    ChannelModel.find({},(err,channel_list)=>{
            if(err) console.log('error')
            console.log(channel_list);
            resp.render('index',{channels:channel_list})
        })
    
    
    
})
//for individual channels  
app.get('/:id',async(req,resp)=>{
     await ChannelModel
        .find({})
        .exec((err,channel_list)=>{
            if(err) console.log('error')
            console.log(channel_list);
             ChannelModel
            .findById(req.params.id)
            .exec((err,channel)=>{
            if(err) console.log(err.statusCode)
            console.log(channel)
            resp.render('channelDetails', {channel,channels:channel_list})
        })
    })
})
// get form new channel
app.get('/new/channel',(req,resp)=>{
    resp.render('new_channel')
})
//post the new channel
app.post('new/channel',(req,resp)=>{
    const channelData=req.body
    console.log(channelData)
})
//log when the user connects and disconnects
io.on('connection', socket=>{
    // socket.on('joinChannel',()=>{
    socket.emit('message','Welcome to Slack'); //emits only to the person connected 
    socket.broadcast.emit('message','A user has connected')//to all other users 
    // })
 
//  console.log(socket.request)
    
socket.on('chat',(data)=>{

    ChannelModel.findByIdAndUpdate(data.id,
        { $push: 
            { conversation: 
                {message:data.message, user:data.name,timeStamp:new Date()} }},
                (err,messages)=>{
                     if(err) console.log(err.statusCode)
                     console.log(messages)
                }) 
    io.emit('chat',data)
})
//runs when a user disconnects
  socket.on('disconnect',()=>{
    io.emit('message','A user has disconnected')
  })


})