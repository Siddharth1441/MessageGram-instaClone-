const mongoose = require('mongoose')

const followSchema = new mongoose.Schema({
    follower: { type: mongoose.Schema.Types.ObjectId, ref:"users", required:true },
    followee: { type: mongoose.Schema.Types.ObjectId, ref:"users", required:true },
    status: { type: String, 
    enum:{ 

    values:['pending', 'accepted', 'rejected'],    
    message: "status can only be pending, accepted or rejected"
    },
    default:"accepted"
}}, {
    timestamps: true
})
followSchema.index({follower:1,followee:1},{unique:true})

const Follow = mongoose.model('Follow', followSchema)

module.exports = Follow 
