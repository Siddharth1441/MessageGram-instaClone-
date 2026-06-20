const mongoose = require('mongoose')

const likeShema = new mongoose.Schema({
    post:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Posts",
    required:[true,"Post id is required for like"]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true ,"User is required for creating a like"]

    }
    
},{
    timestamps:true
})

likeShema.index({post:1,user:1},{ unique:true })

const likeModel = mongoose.model("likes",likeShema)

module.exports = likeModel
