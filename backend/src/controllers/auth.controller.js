const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require("crypto")
const asyncHandler = require("../utils/asyncHandler")
const { getCookieOptions } = require("../utils/authCookies")

function publicUser(user) {
    return {
        id:user._id,
        email:user.email,
        username:user.username,
        name:user.name,
        bio:user.bio,
        website:user.website,
        profileImage:user.profileImage,
        isPrivate:user.isPrivate,
        role:user.role
    }
}

function signToken(user) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is required")
    }

    return jwt.sign({
        id:user._id,
        username:user.username,
        role:user.role
    }, process.env.JWT_SECRET, { expiresIn:"1d" })
}

const registerController = asyncHandler(async function registerController(req,res) {
    const {email,username,password,bio,profileImage,name} = req.body

    if (!email || !username || !password) {
        return res.status(400).json({ message:"Email, username and password are required" })
    }

    if (password.length < 8) {
        return res.status(400).json({ message:"Password must be at least 8 characters" })
    }

    const isUserAleadyexsist = await userModel.findOne({
        $or:[
            {username:username.toLowerCase()},
            {email:email.toLowerCase()}
        ]
    })
    if (isUserAleadyexsist) {
        return res.status(409).json({
            Message:"user aready exsist with this " +(isUserAleadyexsist.email===email?"Email":"Username")

        })
    }

    const hash = await bcrypt.hash(password,10)
    
    const user = await userModel.create({
        username,
        password:hash,
        email,
        bio,
        profileImage,
        name
    })
    
    const token = signToken(user)

   res.cookie("token",token,getCookieOptions())

   res.status(201).json({
    Message:"user register succesfully",
    user:publicUser(user)
   })
})

const loginController = asyncHandler(async function loginController (req,res){
    const {username,email,password} = req.body

    if ((!username && !email) || !password) {
        return res.status(400).json({ message:"Username/email and password are required" })
    }

     const user = await userModel.findOne({
        $or:[
            {username:username?.toLowerCase()},
            {email:email?.toLowerCase()}
        ]
     }).select("+password")

     if(!user){
        return res.status(404).json({
            message:"User not found"
        })
     }

    const isVaildPassword = await bcrypt.compare(password,user.password)


    if (!isVaildPassword) {
        return res.status(409).json({
            Message:"Invaild password"
        })
    }
    
    const token = signToken(user)

    res.cookie("token",token,getCookieOptions())

    res.status(201).json({
        Message:"User login",
        user:publicUser(user)
    })


})

const getMeController = asyncHandler(async function getMeController(req,res) {
    const userId = req.user.id
    const user = await userModel.findById(userId)

    if (!user) {
        return res.status(404).json({ message:"User not found" })
    }

    res.status(200).json({
        user:publicUser(user)
    })
})

function logoutController(req,res) {
    res.clearCookie("token", getCookieOptions())
    res.status(200).json({ message:"Logged out" })
}

const forgotPasswordController = asyncHandler(async function forgotPasswordController(req,res) {
    const { email } = req.body
    if (!email) {
        return res.status(400).json({ message:"Email is required" })
    }

    const user = await userModel.findOne({ email:email.toLowerCase() })
    if (!user) {
        return res.status(200).json({ message:"If that email exists, reset instructions were created" })
    }

    const rawToken = crypto.randomBytes(32).toString("hex")
    user.passwordResetToken = crypto.createHash("sha256").update(rawToken).digest("hex")
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000)
    await user.save()

    res.status(200).json({
        message:"Password reset token created",
        resetToken:process.env.NODE_ENV === "production" ? undefined : rawToken
    })
})

const resetPasswordController = asyncHandler(async function resetPasswordController(req,res) {
    const { token, password } = req.body

    if (!token || !password) {
        return res.status(400).json({ message:"Reset token and password are required" })
    }

    if (password.length < 8) {
        return res.status(400).json({ message:"Password must be at least 8 characters" })
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
    const user = await userModel.findOne({
        passwordResetToken:hashedToken,
        passwordResetExpires:{ $gt:new Date() }
    })

    if (!user) {
        return res.status(400).json({ message:"Invalid or expired reset token" })
    }

    user.password = await bcrypt.hash(password, 10)
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    res.status(200).json({ message:"Password reset successfully" })
})

module.exports = {
    registerController,
    loginController,
    getMeController,
    logoutController,
    forgotPasswordController,
    resetPasswordController,
    publicUser
}
