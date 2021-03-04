const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const channelsSchema= new Schema({
    channelName:{
        type:String,
        required:true
        
    },
    status:{
        type:String,
        required:true
    },
    conversation:[
        {
            message:String,
            timeStamp:Date,
            user:String,
            userImage:String
        }
    ],
    
})

channelsSchema
    .virtual('url')
    .get(function()  {
        return `/catalog/channels/${this._id}`
    })

module.exports = mongoose.model('channels', channelsSchema)