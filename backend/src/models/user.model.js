const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"User already exsist"],
        required:[true,"Username required"],
        trim:true,
        lowercase:true,
        minlength:3,
        maxlength:30,
        match:/^[a-z0-9._]+$/
    },
    email:{
        type:String,
        unique:[true,"Email already exsist"],
        required:[true,"Email required"],
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,"Password required"],
        select:false
    },
    name:{
        type:String,
        trim:true,
        maxlength:60,
        default:""
    },
    bio:{
        type:String,
        maxlength:150,
        default:""
    },
    profileImage:{
        type:String,
        default:"https://ik.imagekit.io/boks6a8adw/image.jpg"
    },
    website:{
        type:String,
        trim:true,
        default:""
    },
    isPrivate:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    blockedUsers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }],
    passwordResetToken:String,
    passwordResetExpires:Date
},{
    timestamps:true
})

userSchema.index({ username: "text", name: "text", bio: "text" })

const userModel = mongoose.model("users",userSchema) 

module.exports = userModel
