const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const channelsSchema= new Schema({
    channelName:{
        type:String,
        required:true
        
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    status:{
        type:String,
        required:true
    },
    conversation:[
        {
            message:String,
            timeStamp:Date,
            user:String,
        
        }
    ],
    
})

channelsSchema
    .virtual('url')
    .get(function()  {
        return `/catalog/channels/${this._id}`
    })

module.exports = mongoose.model('channel', channelsSchema)
//pluralise the name and look for that name in the collection ie channels if not create