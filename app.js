// --------------------------
//      DEPENDENCIES
//-----------------------
const express=require('express');
const socket=require('socket.io')
const path=require('path')

const app=express()
const server=app.listen(3000)
const io=socket(server) // opening socket connection

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set('views', (__dirname, './views'));


// Routes
app.get('/',(req,resp)=>{
    //get channelList from database 
//just for test
    let channels=[{name:'general', status:'public'}, 
                    {name:'random', status:'public'},
                    {name:'backend1', status:'public'},
                    {name:'endast-elever', status:'private'}]
                    
    resp.render('index',{channels:channels})
    
})
//for all the channels-  will render as a block to index.ejs at the end
app.get('/channelList',(req,resp)=>{
//get channelList from database 
//just for test
    // let channels=[{name:'general', status:'public'}, 
    //                 {name:'random', status:'public'},
    //                 {name:'backend1', status:'public'},
    //                 {name:'endast-elever', status:'private'}]
                    
    // resp.render('channel.ejs',{channels:channels})
})
// post a new channel
app.get('/new/channel',(req,resp)=>{

})
//post a new message
app.post('new/message',(req,resp)=>{

})
//log when the user connects and disconnects
io.on('connection', socket=>{
socket.on('chat',data=>{
    console.log(data)  
    io.emit('chat',data)
})
})