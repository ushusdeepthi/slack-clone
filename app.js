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
const User=require('./models/users')

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


// socket
// log when the user connects and disconnects
let users=[]
io.on('connection', (socket)=>{
    console.log('-------------------------------------------------------')
     socket.on('join',(data)=>{
    console.log('socket id of '+data.name + socket.id)

        socket.emit('message',`Hi ${data.name} Welcome to slack`); //emits only to the person connected 
        socket.broadcast.emit('message',` ${data.name} has connected`)//to all other users 
        socket.join(data.room)
        //  io.emit('join',data)
        //check if required----------
        let channelId=data.id
        let name=data.name

        // users.indexOf(data.name)==-1 ? users.push(data.name):console.log('user aleady exists')
        // let user=await User.findOne({name:data.name})
        // console.log(user)
        // //  console.log(data.name)
        //  console.log(socket.id)
        //  users[socket.id]={name}        //    person[data.name]=socket.id
        // users[socket.id]={...user,channelId}
        let id=socket.id
        const user={id, name, channelId}
        users.push(user)
    
        //    console.log(users)---------------------

           io.emit('onlineusers',users)
     })
     //socket for chat    
socket.on('chat',(data)=>{
    
    ChannelModel.findByIdAndUpdate(data.id,
        { $push: 
            { conversation: 
                {message:data.message, user:data.name,timeStamp:new Date()} }},
                (err,messages)=>{
                     if(err) console.log(err.statusCode)
                    //  console.log(messages)
                }) 
    
    io.to(data.room).emit('chat',data)
    
})
     
     //trial to fix private chat
     //starting socket for a private chat
        socket.on('private_chat',  (data)=>{
            // console.log(data.sender)
            // console.log(data.receiver)
            // console.log(users)
            let socketId_receiver=users.filter((value)=>{
                return value.name===data.receiver
            })
            console.log('this is'+ data.receiver+'s socket id'+socketId_receiver[0].id);
            //getting user details from database
            User.findOne({name:data.sender})
                .then(sender=>{
                    console.log('sender id'+ sender._id) 
                   User.findOne({name:data.receiver}) // for that user getting receiver details from database
                   .then(receiver=>{
                       console.log('receiver id'+receiver._id)
                        if(sender._id!= receiver.id){
                        // check if the channel already exists
                            ChannelModel.findOne({users: {$all: [sender._id, receiver._id]}})
                                .then(private_channel=>{
                                    // let socketId_reciver= 
                                    // console.log(private_channel)
                                    if(!private_channel){
                                        let new_private_channel= new ChannelModel({
                                            channelName:`${sender.name}-${receiver.name}`,
                                            status:'private',
                                            users:[sender._id,receiver._id]
                                        })
                                        new_private_channel.save()
                                        .then(new_private_channel=>{
                                            // console.log(new_private_channel)
                                            let url=new_private_channel._id
                                            // socket.join(new_private_channel.channelName)
                                             io.to(socket.id).emit('new_private_channel',url)    
                                        })
                                    }
                                    else{
                                        let url=private_channel._id
                                        io.to(socket.id).emit('new_private_channel',url)
                                       }
                                     io.to(socketId_receiver[0].id).emit('alert',`You have messages from ${data.sender} `)   
                                })
                        }
                    
                    })
                })
     })


//runs when a user disconnects
  socket.on('disconnect',()=>{
    const index= users.findIndex(user=>user.id===socket.id)
    if (index !== -1) {
    return users.splice(index, 1)[0];
  }
    io.emit('message','A user has disconnected')
  })
})

  