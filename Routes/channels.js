const express=require('express')
const router=express.Router()
const ChannelModel=require('../models/channels')
const { ensureAuthenticated}= require('../config/auth')


//  let usernames=[]
router.get('/',ensureAuthenticated,(req,resp)=>{
    // let new_user=req.user.name
    // usernames.indexOf(new_user)==-1 ? usernames.push(new_user):console.log('user aleady exists')
   
    ChannelModel.find({},(err,channel_list)=>{
            if(err) console.log('error')
            // console.log(channel_list);
            resp.render('index',{channels:channel_list,name:req.user.name})
    })
})
//for new channel
router.get('/new',ensureAuthenticated,(req,resp)=>{
    resp.render('new_channel')
})
router.post('/new',ensureAuthenticated,(req,resp)=>{
    
    const{new_channel, status}=req.body
        const newChannel=new ChannelModel({
        channelName:new_channel,
        status:status
        })
        newChannel.save()
            .then(result=>{
                // console.log(result)
                req.flash('success_msg','Channel succesfully created')
                resp.redirect('/channels')
                })
            .catch(err=>{
                console.log(err)  
            })
})

//for individual channels  
router.get('/:id',ensureAuthenticated,(req,resp)=>{
         ChannelModel
        .find({})
        .exec((err,channel_list)=>{
            if(err) console.log('error')
            // console.log(channel_list);
             ChannelModel
            .findById(req.params.id)
            .exec((err,channel)=>{
            if(err) console.log(err.statusCode)
            console.log(channel)
            resp.render('channelDetails', {channel,channels:channel_list,name:req.user.name})
        })
    })
})

module.exports=router
