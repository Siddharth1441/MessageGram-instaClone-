const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    actor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    type:{
        type:String,
        enum:["like","comment","follow","mention"],
        required:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Posts"
    },
    read:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

notificationSchema.index({ recipient:1, read:1, createdAt:-1 })

module.exports = mongoose.model("notifications", notificationSchema)
