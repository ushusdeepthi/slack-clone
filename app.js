//set up express

const express=require('express');
const app=express()
const server=app.listen(3000)

// other dependencies

const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash')
const mongoose=require('mongoose')
const path = require('path')
const passport=require('passport')
const session = require('express-session')
const socket=require('socket.io')

const indexRouter=require('./routes/index')
const usersRouter=require('./routes/users')
const channelsRouter=require('./routes/channels')

const ChannelModel=require('./models/channels')

// opening socket connection
const io=socket(server) 


//set up default mongoose connection
mongoose.connect('mongodb://localhost:27017/slack-clone', {
 useNewUrlParser: true,
 useUnifiedTopology: true
});
// Get the default connection
const db=mongoose.connection;
//Bind connection to error event (to get notification of connection errors) 
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//middlewares
// app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(expressEjsLayout)
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));

//session middleware

app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))
//passport
app.use(passport.initialize())
    app.use(passport.session())

// flash
//connect flash
app.use(flash())
// creating global variables
app.use((req, resp, next) => {
    resp.locals.success_msg = req.flash('success_msg')
    resp.locals.error_msg = req.flash('error_msg')
    resp.locals.error = req.flash('error')
    next()
})

//Routes
app.use('/',indexRouter)
app.use('/users',usersRouter)
app.use('/channels',channelsRouter)



//socket
//log when the user connects and disconnects
io.on('connection', socket=>{
    let person={}
    
     socket.on('join',(data)=>{
        socket.emit('message',`Hi ${data.name} Welcome to slack`); //emits only to the person connected 
        socket.broadcast.emit('message',` ${data.name} has connected`)//to all other users 
        //  io.emit('join',data)
            person[data.name]=socket.id
     })
     //trial to fix private chat
    //  socket.on('private_chat',data=>{
    //      io.to(person[data.reciever_name]).emit('private_chat', data);
    //  })
     
 
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
    socket.join(data.channel)
    io.to(data.channel).emit('chat',data)
})
//runs when a user disconnects
  socket.on('disconnect',()=>{
    io.emit('message','A user has disconnected')
  })


})