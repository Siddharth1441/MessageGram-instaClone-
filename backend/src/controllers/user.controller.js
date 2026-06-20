const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");
const postModel = require("../models/post.model")
const notificationModel = require("../models/notification.model")
const asyncHandler = require("../utils/asyncHandler")
const { publicUser } = require("./auth.controller")

const followUserController = asyncHandler(async function followUserController(req,res) {
    const followerId = req.user.id
    const followeeUsername =  req.params.username
    const follower = await userModel.findById(followerId)

    if(!follower){
        return res.status(404).json({ message:"Current user not found" })
    }

    if(followeeUsername.toLowerCase() === follower.username){
        return res.status(400).json({
            message:"You cannot follow yourself"
        })
    }

    const isFolloweeExists = await userModel.findOne({
       username : followeeUsername 
    })
    if(!isFolloweeExists){
        return res.status(404).json({
            message:"User you are trying to follow does not exist"
        })
    }

    const isUserAlreadyFollowing = await followModel.findOne({
        follower:followerId,
        followee:isFolloweeExists._id,
    })

    if(isUserAlreadyFollowing){
        return res.status(200).json({
            message:`You already following ${followeeUsername}`,
             follow:isUserAlreadyFollowing
        })
    }
    
    
    const followRecord = await followModel.create({
        follower:followerId,
        followee:isFolloweeExists._id,
        status:isFolloweeExists.isPrivate ? "pending" : "accepted"
    })

    if (followRecord.status === "accepted") {
        await notificationModel.create({
            recipient:isFolloweeExists._id,
            actor:followerId,
            type:"follow"
        })
    }

    res.status(201).json({
        message:`you are now following ${followeeUsername}`,
        follow: followRecord
    })
})

const unfollowUserController = asyncHandler(async function unfollowUserController(req,res){
    const followerId = req.user.id
    const followeeUsername = req.params.username
    const followee = await userModel.findOne({ username:followeeUsername.toLowerCase() })

    if (!followee) {
        return res.status(404).json({ message:"User not found" })
    }
    
    const isUserAlreadyFollowing = await followModel.findOne({
        follower:followerId,
        followee:followee._id
    })

    if(!isUserAlreadyFollowing){
        return res.status(200).json({
            message:`you are not following ${followeeUsername}`
        })
    }

    await followModel.findByIdAndDelete(isUserAlreadyFollowing._id)
    res.status(200).json({
        message:`you have unfollowed ${followeeUsername}`
    })
})

const getProfileController = asyncHandler(async function getProfileController(req,res) {
    const user = await userModel.findOne({ username:req.params.username.toLowerCase() })

    if (!user) {
        return res.status(404).json({ message:"User not found" })
    }

    const [postsCount, followersCount, followingCount, isFollowing] = await Promise.all([
        postModel.countDocuments({ user:user._id }),
        followModel.countDocuments({ followee:user._id, status:"accepted" }),
        followModel.countDocuments({ follower:user._id, status:"accepted" }),
        followModel.exists({ follower:req.user.id, followee:user._id, status:"accepted" })
    ])

    res.status(200).json({
        user:publicUser(user),
        stats:{ postsCount, followersCount, followingCount },
        isFollowing:Boolean(isFollowing),
        isOwnProfile:user._id.toString() === req.user.id
    })
})

const updateProfileController = asyncHandler(async function updateProfileController(req,res) {
    const allowedFields = ["name","bio","website","profileImage","isPrivate"]
    const updates = {}

    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) updates[field] = req.body[field]
    })

    const user = await userModel.findByIdAndUpdate(req.user.id, updates, {
        new:true,
        runValidators:true
    })

    res.status(200).json({
        message:"Profile updated",
        user:publicUser(user)
    })
})

const searchUsersController = asyncHandler(async function searchUsersController(req,res) {
    const q = (req.query.q || "").trim()

    if (!q) {
        return res.status(200).json({ users:[] })
    }

    const users = await userModel.find({
        $or:[
            { username:{ $regex:q, $options:"i" } },
            { name:{ $regex:q, $options:"i" } }
        ]
    }).limit(20)

    res.status(200).json({
        users:users.map(publicUser)
    })
})

const blockUserController = asyncHandler(async function blockUserController(req,res) {
    const target = await userModel.findOne({ username:req.params.username.toLowerCase() })

    if (!target) {
        return res.status(404).json({ message:"User not found" })
    }

    if (target._id.toString() === req.user.id) {
        return res.status(400).json({ message:"You cannot block yourself" })
    }

    await Promise.all([
        userModel.findByIdAndUpdate(req.user.id, { $addToSet:{ blockedUsers:target._id } }),
        followModel.deleteMany({
            $or:[
                { follower:req.user.id, followee:target._id },
                { follower:target._id, followee:req.user.id }
            ]
        })
    ])

    res.status(200).json({ message:`Blocked ${target.username}` })
})

const unblockUserController = asyncHandler(async function unblockUserController(req,res) {
    const target = await userModel.findOne({ username:req.params.username.toLowerCase() })

    if (!target) {
        return res.status(404).json({ message:"User not found" })
    }

    await userModel.findByIdAndUpdate(req.user.id, { $pull:{ blockedUsers:target._id } })
    res.status(200).json({ message:`Unblocked ${target.username}` })
})

module.exports={
    followUserController,
    unfollowUserController,
    getProfileController,
    updateProfileController,
    searchUsersController,
    blockUserController,
    unblockUserController
}
