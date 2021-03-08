const express=require('express')
const router=express.Router()
const ChannelModel=require('../models/channels')
const { ensureAuthenticated}= require('../config/auth')


router.get('/',ensureAuthenticated,(req,resp)=>{
    
    ChannelModel.find({},(err,channel_list)=>{
            if(err) console.log('error')
            console.log(channel_list);
            resp.render('index',{channels:channel_list,name:req.user.name})
    })
})

//for individual channels  
router.get('/:id',ensureAuthenticated,(req,resp)=>{
         ChannelModel
        .find({})
        .exec((err,channel_list)=>{
            if(err) console.log('error')
            console.log(channel_list);
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